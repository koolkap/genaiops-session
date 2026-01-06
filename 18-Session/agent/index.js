import readline from "readline";
import { runAgent } from "./agent.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let threadId = null;

function ask() {
  rl.question("You: ", async (input) => {
    if (input.toLowerCase() === "exit") {
      rl.close();
      return;
    }

    // Call agent with input and current threadId
    const result = await runAgent(input, threadId);

    // Print latest agent response
    console.log("Agent:", result.latest.content);

    // Update threadId for next turn
    threadId = result.threadId;

    ask();
  });
}

ask();
