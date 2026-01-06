// const { app } = require('@azure/functions');

// app.timer('func-demo-agent-reminder', {
//     schedule: '0 */1 * * * *',
//     handler: (myTimer, context) => {
//         context.log('Timer function processed request.');
//     }
// });

const { app } = require('@azure/functions');
const { CosmosClient } = require('@azure/cosmos');

app.timer('func-demo-agent-reminder', {
  schedule: '0 */1 * * * *',
  handler: async (myTimer, context) => {
    context.log('Timer function processed request.');

    // Cosmos DB client setup
    const client = new CosmosClient({
      endpoint: process.env.COSMOS_DB_ENDPOINT,
      key: process.env.COSMOS_DB_KEY
    });

    const database = client.database('dbagentreminders');
    const container = database.container('reminders');

    // Query reminders
    const querySpec = {
      query: 'SELECT * FROM c WHERE c.sent = false AND c.send_time <= @now',
      parameters: [
        { name: '@now', value: new Date().toISOString() }
      ]
    };

    const { resources: reminders } =
      await container.items.query(querySpec).fetchAll();

    for (const reminder of reminders) {
      try {
        // Trigger Logic App
        await fetch(process.env.LOGIC_APP_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userEmail: reminder.email,
            subject: reminder.subject,
            body: reminder.message
          })
        });

        // Mark as sent in Cosmos DB
        await container
          .item(reminder.id, reminder.email)
          .replace({ ...reminder, sent: true });

        context.log(`Sent reminder to: ${reminder.email}`);
        context.log(`Sent reminder message: ${reminder.message}`);
      } catch (err) {
        context.error(
          `Failed to send reminder for ${reminder.id}: ${err.message}`
        );
      }
    }
  }
});
