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

19. in cosmo db add the data explorer one more time add the item in the reminder for referesh and our function take new data (you see the prior message send is true and now this we make false)

20. now push our function to the server use the following command

func azure functionapp publish <name if the func whcih we created on the gui portal>

func azure functionapp publish funcapp-demo-agent-reminder

21. start the logging 

func azure functionapp logstream <nameof functionapp>

22. now create the agent on foundry

23. deploy the model

24. create folder agent and add code

25. run the npm init to create the package file

26. package change the type to module 

27. create agent.js in the folder and copy paste the code
    copy index.js as entry point also

28. Go to overview and copy the endpoint and model name

29. copy the endpoint and copy the model name 

30. install this npm packages 

npm install @azure/ai-agents @azure/core-util @azure/cosmos @azure/identity dotenv express

31. creat the server.js  copy the code

updat the package.json with the start in script 

32. install express server

33. {"message": "What you can do?"} add this in raw  body and hit localhost:3000/chat with type json

34. create folder tools in the agent folder, and create functionToolExecutor.js

35. in the agent.js file import functionToolExecutor 
add the require methods and add the tools to the createAgent function

36. add requires_action method in the agent.js

37. add new function defination 

sendEmailVerification 

38. change the creatagent instruction 

instructions:
        "You are a Reminder Agent that schedules emails to be sent at a future date for a user. You send an email verification when a user asks you to remind them of something and provides their email address.",


39. Now add the verification code snnippet 

40. now we have scuucesfllu created our email agent going forward you can add function like scheduling or user action based posting

41. also you can create the web app and deploy this solution as GPT agent with UI