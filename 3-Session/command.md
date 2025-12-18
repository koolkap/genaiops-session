Steps to learn basic bicep operation.

1. Create the file main.bicep in the project
2. Install the plugin for the bicep
3. let deploy virtual network type the vnet and auto complete the resource
4. It will create the virtual network with the defined snippet
5. Notice location has error no create the param location string = resourceGroup().location (tab for autocomplete)
6. this means we want to deploy bicep in same location
7. get the latest avaialble api with the latest whenever possible
8. right click and deploy the bicep (fix the error if there are any)
9. Ask the name for the deployment + select the subscription 
10. Now go to the azure portal and verify this
11. congratulation created first resource (check the subnetfor confirmation)
12. Now lets delete ther resource
az group delete --name <name_of_bicep> --yes --no-wait ## to delete resource


13. Now instead of the guided interface lets learn with the command line utility
az group create --name <name_of_bicep> --location <location_name>
14. now do the deployment 
az deployment group create --resource-group <name_+of_bicep> --template-file <file_to_run.bicep>




