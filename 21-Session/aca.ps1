$resourceGroupName = "rg-flask"
$acrName = "flaskcontainerreg123"
$location = "eastus2"
$containerAppEnv = "flask-python-env"

az containerapp env create `
  --name $containerAppEnv `
  --resource-group $resourceGroupName `
  --location $location

