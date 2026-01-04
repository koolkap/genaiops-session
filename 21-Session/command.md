1. Setup the virtual environment in my python folder

python -m venv venv

2.  Install the required packages from the requirement.txt

pip install -r requirement.txt

3. Create the app.py simple falsk hello world script

4. Run locally to check everything is good

5. Install docker for the windows and now make the build (before this make sure you have DockerFile in the folder with the steps)

6. Make the docker build either by the command line or the clt+shift+p from the extension which is installed on VS Code

(run the docker before the build command)

docker build --pull --rm -f ".\Dockerfile" -t flask-python-app:latest "."

7. After this run the power shell containerreg.ps1 which says

* setting up the resource 
* location 
* ACR (azure conatiner registry)

[Same you can do with the GUI portal too]

8. Run the dockerized.ps1 

this will create the docker image on the on ACR

9. Run the aca.ps1 script 

* do the log analytics setup
* create ACA

10.From the GUI portal enable the Admin right for the ACR by clicking on the access code or run the command

az acr update -n <name_of_acr_resource> --admin-enabled true

11.