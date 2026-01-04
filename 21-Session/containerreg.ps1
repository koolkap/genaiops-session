$rgname = "rg-flask"
$location = "eastus2"
$acrname = "flaskcontainerreg123"
# Create Resource Group
az group create --name $rgname --location $location
# Create Azure Container Registry
az acr create --resource-group $rgname --name $acrname --sku Basic --admin-enabled true
# # Get the login server name
# $loginServer = az acr show --name $acrname --query loginServer --output tsv
# Write-Output "Azure Container Registry Login Server: $loginServer"
# # Get the admin username and password
# $adminUsername = az acr credential show --name $acrname --query username --output tsv
# $adminPassword = az acr credential show --name $acrname --query passwords[0].value --output tsv
# Write-Output "Admin Username: $adminUsername"
# Write-Output "Admin Password: $adminPassword"
# # Log in to the Azure Container Registry
# az acr login --name $acrname
# Write-Output "Logged in to Azure Container Registry: $acrname"
# # Optional: List repositories in the ACR (will be empty initially)
# az acr repository list --name $acrname --output table 
# Write-Output "Listed repositories in Azure Container Registry: $acrname"
