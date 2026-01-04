1. create the azure logic app (select the multi tenant option)

2. Go to the Development >> Logic app designer

3. Create the HTTP request we need to send the verification code trigger here

4. Give the sample payload 

{"userEmail":"ajitkohir2025@outlook.com", "subject":"subject for email", "body":"body for email"}


5. Now add the action to the HTTP trigger 

add >> outlook >> send email v2 >> sign in

6. Create cosmodb database with serverless option using nosql

7. go to data explorer and create db 

* create two container pending_verification
* reminders

8. In the reminders add the new item and save. It would look like this after save

{
    "email": "xxxx@outlook.com",
    "subject": "Reminder From Reminder Agent!",
    "message": "Remember to create agentic app",
    "send_time": "2026-01-05T18:29:21.000Z",
    "sent": false,
    "id": "a7d36f21-7a4b-44de-8d8b-f219094769b3",
    "_rid": "I4BlANKpYEQBAAAAAAAAAA==",
    "_self": "dbs/I4BlAA==/colls/I4BlANKpYEQ=/docs/I4BlANKpYEQBAAAAAAAAAA==/",
    "_etag": "\"f3014b7b-0000-0200-0000-695aba1a0000\"",
    "_attachments": "attachments/",
    "_ts": 1767553562
}

9. through ctl+shift + P

create the azure function:create function

10. Select the project, Javascript, name the function & save

11. create the storage account in local.setting.json add the storage account

12. https://github.com/Azure/azure-functions-core-tools?tab=readme-ov-file

Install the cli tool 

13. create the new function func-reminder-agent.js

14. execute install npm with cosmodb library

15. run func start and see everything is good 

16. Now create function app, consumption type

17. Select the same storage type which you created

18. Now add the environment variable same with local setting json

19. in cosmo db add the data explorer one more time add the item in the reminder for referesh and our function take new data

20. now push our function to the server use the following command

func azure functionapp publish func-email-agent

21. start the logging 

func azure functionapp logstream func-email-agent