import "dotenv/config";
import { AgentsClient, isOutputOfType } from "@azure/ai-agents";
import { delay } from "@azure/core-util";
import { DefaultAzureCredential } from "@azure/identity";

// Environment variables
const projectEndpoint = "https://foundryreminderagent.openai.azure.com/openai/v1";
const modelDeploymentName = "gpt-4o";

// Client
const client = new AgentsClient(
  projectEndpoint,
  new DefaultAzureCredential()
);

/**
 * Runs the agent with input and maintains history using Azure AI Foundry threads
 *
 * @param {string} input - User input
 * @param {string|null} threadId - Optional existing threadId
 * @returns {Promise<{history: Array, latest: object|null, threadId: string}>}
 */
export async function runAgent(input, threadId = null) {
  // --------------------------------------------------
  // Create or reuse agent
  // --------------------------------------------------
  let agent;
  if (process.env.AGENT_ID) {
    agent = await client.getAgent(process.env.AGENT_ID);
    console.log(`Using existing agent, agent ID: ${agent.id}`);
  } else {
    agent = await client.createAgent(modelDeploymentName, {
      name: "my-reminder-agent",
      instructions:
        "You are a Reminder Agent that schedules emails to be sent at a future date for a user. You craft a pretty email reminder.",
    });
    console.log(`Created agent, agent ID: ${agent.id}`);
  }

  // --------------------------------------------------
  // Create or reuse thread
  // --------------------------------------------------
  let thread;
  if (threadId) {
    thread = { id: threadId };
    console.log(`Using existing thread, thread ID: ${thread.id}`);
  } else {
    thread = await client.threads.create();
    console.log(`Created thread, thread ID: ${thread.id}`);
  }

  // --------------------------------------------------
  // Add user message
  // --------------------------------------------------
  const message = await client.messages.create(
    thread.id,
    "user",
    input
  );
  console.log(`Created message, message ID: ${message.id}`);

  // --------------------------------------------------
  // Create run
  // --------------------------------------------------
  let run = await client.runs.create(thread.id, agent.id);
  console.log(`Created run, run ID: ${run.id}`);

  // --------------------------------------------------
  // Poll run status
  // --------------------------------------------------
  while (["queued", "in_progress", "requires_action"].includes(run.status)) {
    await delay(1000);
    run = await client.runs.get(thread.id, run.id);
    console.log(`Run status: ${run.status}, run ID: ${run.id}`);
  }

  // --------------------------------------------------
  // Handle failure
  // --------------------------------------------------
  if (run.status === "failed") {
    console.error("Run failed:", run.lastError || run.error || run);
    throw new Error("Agent run failed");
  }

  console.log(`Run completed with status: ${run.status}`);

  // --------------------------------------------------
  // Read conversation history
  // --------------------------------------------------
  const messages = client.messages.list(thread.id, { order: "asc" });
  const history = [];
  let latest = null;

  for await (const threadMessage of messages) {
    threadMessage.content.forEach((content) => {
      if (isOutputOfType(content, "text")) {
        const msgObj = {
          role: threadMessage.role,
          content: content.text.value,
          timestamp: threadMessage.createdAt
        };
        history.push(msgObj);
        latest = msgObj;
      }
    });
  }

  // --------------------------------------------------
  // Optional cleanup (commented intentionally)
  // --------------------------------------------------
  // await client.deleteAgent(agent.id);
  // console.log(`Deleted agent, agent ID: ${agent.id}`);

  return {
    history,
    latest,
    threadId: thread.id
  };
}
