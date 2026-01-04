$resourceGroupName = "rg-flask"
$acrName = "flaskcontainerreg123"
$acrImage = "$acrName.azurecr.io/flask-python-app:v1"
$location = "eastus2"
$containerAppEnv = "flask-python-env"
$containerAppName = "flaskwebapp01"

az acr update -n $acrName --admin-enabled true

$acrUsername = az acr credential show --name $acrName --query "username" --output tsv
$acrPassword = az acr credential show --name $acrName --query "passwords[0].value" --output tsv

az containerapp create `
  --name $containerAppName `
  --resource-group $resourceGroupName `
  --environment $containerAppEnv `
  --image $acrImage `
  --registry-server "$acrName.azurecr.io" `
  --registry-username $acrUsername `
  --registry-password $acrPassword `
  --target-port 80 `
  --ingress 'external' `
  --cpu 0.5 `
  --memory 1.0Gi