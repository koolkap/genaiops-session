// server.js (Express API)

import express from "express";
import { runAgent } from "./agent.js";

const app = express();
app.use(express.json());

app.post("/chat", async (req, res) => {
  const { message, threadId } = req.body;

  try {
    // Pass threadId from frontend, or create new if not provided
    const agentResult = await runAgent(message, threadId || null);

    res.json({
      threadId: agentResult.threadId,
      latest: agentResult.latest,
      history: agentResult.history
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Server running on port ${port}`)
);
