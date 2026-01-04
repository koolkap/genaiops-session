1. Create the azure container instance 
[Learn to create simple instance with the public IP]

[Here we will learn hosting the web app to my custom instance using ACR]
2. Open the cloud shell from the portal azure

3. git clone https://github.com/Azure-Samples/aci-helloworld.git

4. Create the azure registry with the default options

[This is optional to understand ACI]
5. come back to power shell type following command
    az acr build --image demo/custom-image-demo:v1 --registry <name_of_azure_registyr> --file Dockerfile .

    az acr build --image demo/custom-image-demo:v1 --registry azreg57 --file Dockerfile .

6. Close the cloud shell if everything is setup successfully

7. Now go back create the ACI using the custom Azure Registry

8. Select the above registry option which you created or use the drop down to select

9. Deploy the resource, new public IP has your new image with changes


[Follow the ACI steps and publish the docker image]
10. Now understand same with ACA with same steps