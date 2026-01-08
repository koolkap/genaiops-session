1. Install the grafana windows client software 

https://grafana.com/grafana/download

2. Open Command Prompt as Administrator
Run:

net start grafana


3. Open the localhost:3000

username: admin
password:admin

4. Create the log analytics workspace in the marketplace and deploy with default settings

5. go to entra id

6. go to app registration 

* create the name "<aoo-registartion-grafana>"

* single tenant

* no redirect url

7. Take the two id from the register app

Object ID: 0f22199d-93e4-4fcc-8c64-544002a3b47f

Directory ID: 3eeb1469-c780-45e3-81f6-92f875051561

8. Click the Certificate and Secert

9. Create New Secert 

Copy the value: 7a77c8f4-b24b-48b0-b1cd-779d2b1571ab

10. Go to localhost:3000 >> Connection  >> Data Source >> azure monitor

fill the above three id in sequential order (dont save now )

11. Keep page and come back to portal azure 

* click subscription here

12. Click IAM in the subscription

13. Add role assignment in the IAM

14. search monitor reader adn select

15. add the member as service principal search for log analytics workspace

16. back to localhost:3000 and now apply

17. Now click "Dashboard" >> create new >. select the grafana 

18. Explore in details