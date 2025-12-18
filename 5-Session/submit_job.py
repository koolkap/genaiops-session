# submit_job.py
import os
from azure.identity import DefaultAzureCredential
from azure.ai.ml import MLClient
from azure.ai.ml import command
from dotenv import load_dotenv

load_dotenv()

# --- Azure config from environment ---
SUBSCRIPTION_ID = os.environ["AZURE_SUBSCRIPTION_ID"]
RESOURCE_GROUP = os.environ["AZURE_RESOURCE_GROUP"]
WORKSPACE = os.environ["AZURE_ML_WORKSPACE"]

# Authenticate (uses az login or env vars automatically)
credential = DefaultAzureCredential()

# Create ML client
ml_client = MLClient(
    credential,
    subscription_id=SUBSCRIPTION_ID,
    resource_group_name=RESOURCE_GROUP,
    workspace_name=WORKSPACE,
)

print("Submitting job to Azure ML workspace...")

# Simple command job
job = command(
    code="./src",                    # folder containing train.py
    command="python train.py",      # what to run
    environment="AzureML-sklearn-1.0-ubuntu20.04-py38-cpu@latest",  # built-in curated environment
    display_name="simple-example-job"
)

# Submit job
created_job = ml_client.jobs.create_or_update(job)
print("Submitted job:", created_job.name)

# Stream job logs until completed
ml_client.jobs.stream(created_job.name)
