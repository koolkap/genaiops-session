import { ToolUtility } from "@azure/ai-agents";
import { CosmosClient } from "@azure/cosmos";
const COSMOS_DB_ENDPOINT = "https://cosmosdbagent.documents.azure.com:443/";
const COSMOS_DB_KEY = "9wxgQZzahk4BUrhTZqf61A9YsHp2KWcfX2d1syN617piHKoK1uNGhOdEIafbadbNFk9oMl0bxFCbACDbMp4Msw==";
const LOGIC_APP_ENDPOINT = "https://prod-18.eastus2.logic.azure.com:443/workflows/22d54d7c271746a5bafe5eb3aa0dbf0d/triggers/When_an_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=ywGUIV-UTfPRd9dUZ5XOLCABdlpaZK1e7gn4R-vo45E";
   
export class FunctionToolExecutor {
  functionTools;

  constructor() {
    this.functionTools = [
      {
        func: this.getCurrentDateTime,
        ...ToolUtility.createFunctionTool({
          name: "getCurrentDateTime",
          description: "Gets the current date and time.",
          parameters: {
            type: "object",
            properties: {
              currentDateTime: {
                type: "string",
                description: "The current date and time."
              }
            }
          }
        })
      },
      {
        func: this.sendEmailVerification.bind(this),
            ...ToolUtility.createFunctionTool({
                name: "sendEmailVerification",
                description: "Sends a verification email to the user's email address.",
                parameters: {
                type: "object",
                properties: {
                    email: {
                    type: "string",
                    description: "The user's email address."
                    }
                },
                required: ["email"]
                }
            })
      },
      {
        func: this.verifyEmailWith6DigitCode.bind(this),
        ...ToolUtility.createFunctionTool({
            name: "verifyEmailWith6DigitCode",
            description: "Verifies the email using the 6-digit verification code.",
            parameters: {
            type: "object",
            properties: {
                email: {
                type: "string",
                description: "The user's email address."
                },
                verificationCode: {
                type: "string",
                description: "The 6-digit verification code."
                }
            },
            required: ["email", "verificationCode"]
            }
        })
      }
    ];
  }

  // -------------------------
  // Tool implementations
  // -------------------------
  getCurrentDateTime() {
    const now = new Date();
    return { currentDateTime: now.toISOString() };
  }

  async sendEmailVerification(email) {
    console.log(`Sending verification email to: ${email}`);

    if (!email || typeof email !== "string") {
        throw new Error(
        "Invalid or null email address provided to sendEmailVerification."
        );
    }

    // -------------------------
    // Cosmos DB client setup
    // -------------------------
    const client = new CosmosClient({
        endpoint: COSMOS_DB_ENDPOINT,
        key: COSMOS_DB_KEY
    });

    const database = client.database("dbagentreminders");
    const container = database.container("pending_verifications");

    // -------------------------
    // Generate 6-digit code
    // -------------------------
    const verificationCode = Math.floor(
        100000 + Math.random() * 900000
    ).toString();

    const item = {
        id: `${email}-${Date.now()}`,
        email,
        verificationCode,
        status: "pending",
        expiresAt: new Date(
        Date.now() + 15 * 60 * 1000
        ).toISOString() // 15 minutes
    };

    await container.items.create(item);

    // -------------------------
    // Trigger Logic App (EMAIL)
    // -------------------------
    const response = await fetch(
        LOGIC_APP_ENDPOINT,
        {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userEmail: email,
            subject: "Reminder Agent Requests Email Verification",
            body: `Your verification code is: ${verificationCode}`
        })
        }
    );

    if (!response.ok) {
        throw new Error(
        `Failed to send verification email: ${response.statusText}`
        );
    }

    // -------------------------
    // IMPORTANT: Tool output
    // -------------------------
    return {
        success: true,
        email,
        expiresInMinutes: 15,
        message: "Email verification code sent successfully"
    };
    }

    async verifyEmailWith6DigitCode(email, verificationCode) {
  console.log(
    `Verifying email: ${email} with code: ${verificationCode}`
  );

  // -------------------------
  // Input validation
  // -------------------------
  if (
    !email ||
    typeof email !== "string" ||
    !verificationCode ||
    typeof verificationCode !== "string"
  ) {
    throw new Error(
      "Invalid email or verification code provided to verifyEmailWith6DigitCode."
    );
  }

  // -------------------------
  // Cosmos DB client setup
  // -------------------------
  const client = new CosmosClient({
    endpoint: COSMOS_DB_ENDPOINT,
    key: COSMOS_DB_KEY
  });

  const database = client.database("dbagentreminders");
  const container = database.container("pending_verifications");

  // -------------------------
  // Query verification record
  // -------------------------
  const querySpec = {
    query: `
      SELECT * FROM c
      WHERE c.email = @userEmail
        AND c.verificationCode = @code
        AND c.status = "pending"
    `,
    parameters: [
      { name: "@userEmail", value: email },
      { name: "@code", value: verificationCode }
    ]
  };

  const { resources: items } =
    await container.items.query(querySpec).fetchAll();

  console.log(
    `Verification query returned ${items.length} items.`
  );

  // -------------------------
  // Verification failed
  // -------------------------
  if (!items || items.length === 0) {
    console.error(
      `Verification failed for email: ${email} with code: ${verificationCode}`
    );

    return {
      success: false,
      codeVerified: false,
      email,
      message:
        "Invalid or expired verification code. Ask for the code again."
    };
  }

  // -------------------------
  // Verification successful
  // -------------------------
  const item = items[0];

  // Expiration check
  if (new Date(item.expiresAt) < new Date()) {
    return {
      success: false,
      codeVerified: false,
      email,
      message: "Verification code has expired. Request a new one."
    };
  }

  // Update verification status
  item.status = "verified";
  item.verifiedAt = new Date().toISOString();

  // IMPORTANT:
  // Use correct partition key (email only if it's your PK)
  await container
    .item(item.id, item.email)
    .replace(item);

  console.log(
    `Email ${email} verified successfully with code ${verificationCode}`
  );

  // -------------------------
  // Tool-safe return value
  // -------------------------
  return {
    success: true,
    codeVerified: true,
    email,
    message:
      "Email verified successfully. Proceed to schedule reminder email."
  };
}

  // -------------------------
  // Invoke tool from toolCall
  // -------------------------
  async invokeTool(toolCall) {
    console.log(
      `Function tool call - ${toolCall.function.name}`
    );
    // console.log(`Tool call details: ${JSON.stringify(toolCall)}`);

    const args = [];

    // Parse arguments
    if (toolCall.function.arguments) {
      try {
        const params = JSON.parse(toolCall.function.arguments);
        console.log(
          `Parsed parameters: ${JSON.stringify(params)}`
        );

        for (const key in params) {
          if (Object.prototype.hasOwnProperty.call(params, key)) {
            args.push(params[key]);
          }
        }
      } catch (error) {
        console.error(
          `Failed to parse parameters: ${toolCall.function.arguments}`,
          error
        );
        return undefined;
      }
    } else {
      console.error("No parameters found in tool call.");
      return undefined;
    }

    // Find matching tool
    const toolObj = this.functionTools.find(
      (tool) =>
        tool.definition.function.name ===
        toolCall.function.name
    );

    if (!toolObj) {
      console.error(
        `Tool not found for name: ${toolCall.function.name}`
      );
      return undefined;
    }

    // Execute tool
    let result;
    try {
      result = await toolObj.func(...args);
    } catch (err) {
      console.error(
        `Error executing tool function ${toolCall.function.name}`,
        err
      );
      return undefined;
    }

    // Return tool output in required format
    return result
      ? {
          toolCallId: toolCall.id,
          output: JSON.stringify(result)
        }
      : undefined;
  }

  // -------------------------
  // Return function definitions
  // -------------------------
  getFunctionDefinitions() {
    return this.functionTools.map((tool) => tool.definition);
  }
}
