import readline from "readline";
import { runAgent } from "./agent.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let threadId = null;

async function main() {
  // First call (agent interaction)
  rl.question("You: ", async (input) => {
    try {
      const result = await runAgent(input, threadId);
      threadId = result.threadId;

      if (result.latest) {
        console.log(`Agent: ${result.latest.content}`);
      }
    } catch (err) {
      console.error("Error:", err.message);
    }

    ask();
  });
}

function ask() {
  rl.question("You: ", async (input) => {
    if (input.toLowerCase() === "exit") {
      rl.close();
      return;
    }

    try {
      const result = await runAgent(input, threadId);
      threadId = result.threadId;

      if (result.latest) {
        console.log(`Agent: ${result.latest.content}`);
      }
    } catch (err) {
      console.error("Error:", err.message);
    }

    ask();
  });
}

main();
