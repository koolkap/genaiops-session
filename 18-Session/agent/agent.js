import "dotenv/config";
import { AgentsClient, isOutputOfType } from "@azure/ai-agents";
import { delay } from "@azure/core-util";
import { DefaultAzureCredential } from "@azure/identity";

import { FunctionToolExecutor } from "./tools/functionToolExecution.js";

const projectEndpoint =
  "https://foundryagentreminder.services.ai.azure.com/api/projects/foundryagentreminder";


const modelDeploymentName = "gpt-4o";

// -------------------------
// Tool setup
// -------------------------
const functionToolExecutor = new FunctionToolExecutor();
const functionTools = functionToolExecutor.getFunctionDefinitions();

// -------------------------
// Client setup
// -------------------------
const client = new AgentsClient(
  projectEndpoint,
  new DefaultAzureCredential()
);

/**
 * Runs the agent with input and maintains history using Azure AI Foundry threads
 */
export async function runAgent(input, threadId = null) {
  // -------------------------
  // Create or reuse agent
  // -------------------------
  let agent;
    //instructions: "You are a Reminder Agent that schedules emails to be sent at a future date",
  if (process.env.AGENT_ID) {
    agent = await client.getAgent(process.env.AGENT_ID);
    console.log(`Using existing agent, agent ID: ${agent.id}`);
  } else {
    agent = await client.createAgent(modelDeploymentName, {
      name: "my-reminder-agent",  
       instructions:
        "You are a Reminder Agent that schedules emails to be sent at a future date for a user. You send an email verification when a user asks you to remind them of something and provides their email address.",
       tools: functionTools
    });

    console.log(`Created agent, agent ID: ${agent.id}`);
  }

  // -------------------------
  // Use existing thread or create new
  // -------------------------
  let thread;

  if (threadId) {
    thread = { id: threadId };
    console.log(`Using existing Thread, thread ID: ${thread.id}`);
  } else {
    thread = await client.threads.create();
    console.log(`Created Thread, thread ID: ${thread.id}`);
  }

  // -------------------------
  // Add user message
  // -------------------------
  const message = await client.messages.create(
    thread.id,
    "user",
    input
  );

  console.log(`Created message, message ID ${message.id}`);

  // -------------------------
  // Create run
  // -------------------------
  let run = await client.runs.create(thread.id, agent.id);
  console.log(`Created Run, Run ID: ${run.id}`);

  // -------------------------
  // Poll run status
  // -------------------------
  while (["queued", "in_progress", "requires_action"].includes(run.status)) {
    await delay(1000);

    run = await client.runs.get(thread.id, run.id);
    console.log(
      `Current Run status - ${run.status}, run ID: ${run.id}`
    );

    // Handle failure
    if (run.status === "failed") {
      console.error(
        "Run failed:",
        run.lastError || run.error || run
      );
      break;
    }

    // -------------------------
    // Handle tool calls
    // -------------------------
    if (run.status === "requires_action" && run.requiredAction) {
      console.log("Run requires action");

      if (isOutputOfType(run.requiredAction, "submit_tool_outputs")) {
        const toolCalls =
          run.requiredAction.submitToolOutputs.toolCalls;

        const toolResponses = [];

        for (const toolCall of toolCalls) {
          if (isOutputOfType(toolCall, "function")) {
            const toolResponse =
              await functionToolExecutor.invokeTool(toolCall);

            if (toolResponse) {
              // Log tool output for debugging
              try {
                console.log(
                  `Tool output for ${toolCall.function.name}:`,
                  JSON.parse(toolResponse.output)
                );
              } catch {
                console.log(
                  `Tool output for ${toolCall.function.name}:`,
                  toolResponse.output
                );
              }

              toolResponses.push(toolResponse);
            }
          }
        }

        if (toolResponses.length > 0) {
          run = await client.runs.submitToolOutputs(
            thread.id,
            run.id,
            toolResponses
          );

          console.log(
            `Submitted tool responses, new status: ${run.status}`
          );
        }
      }
    }
  }

  // -------------------------
  // Collect messages
  // -------------------------
  console.log(`Final Run status - ${run.status}, run ID: ${run.id}`);

  const messages = client.messages.list(thread.id, { order: "asc" });
  const history = [];
  let latest = null;

  for await (const threadMessage of messages) {
    for (const content of threadMessage.content) {
      if (isOutputOfType(content, "text")) {
        const msgObj = {
          role: threadMessage.role,
          content: content.text.value,
          timestamp: threadMessage.createdAt
        };

        history.push(msgObj);
        latest = msgObj;
      }
    }
  }

  return {
    history,
    latest,
    threadId: thread.id
  };
}
