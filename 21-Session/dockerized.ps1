$acrname = "flaskcontainerreg123"

az acr login --name $acrname

#Docker build -t flaskapp:latest .
#docker tag flask-python-app flaskcontainerreg123.azurecr.io/flask-python-app:v1

#docker push flaskcontainerreg123.azurecr.io/flask-python-app:v1


#second image

docker tag flask-python-app-2 flaskcontainerreg123.azurecr.io/flask-python-app-2:v1

docker push flaskcontainerreg123.azurecr.io/flask-python-app-2:v1