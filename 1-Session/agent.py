# Before running the sample:
#    pip install --pre azure-ai-projects>=2.0.0b1
#    pip install azure-identity

from azure.identity import DefaultAzureCredential, CredentialUnavailableError
from azure.ai.projects import AIProjectClient
from azure.ai.projects.models import PromptAgentDefinition
 
try:
    user_endpoint = "https://ai-foundry-repo-2.services.ai.azure.com/api/projects/ai-foundry-repo-2"

    project_client = AIProjectClient(
        endpoint=user_endpoint,
        credential=DefaultAzureCredential(),
    )
except CredentialUnavailableError:
    print("DefaultAzureCredential authentication failed. Please ensure that your Azure credentials are properly configured.")
    exit(1)

print(project_client)
agent_name = "my-first-agent"
model_deployment_name = "gpt-5-chat"

# Creates an agent, bumps the agent version if parameters have changed
agent = project_client.agents.create_version(  
    agent_name=agent_name,
    definition=PromptAgentDefinition(
            model=model_deployment_name,
            instructions="Create a storyteller which take the input from the user and create only one line of story out of it and don't create story in details.",
        ),
)

openai_client = project_client.get_openai_client()
storyname = input("Tell me a one line story ")
# Reference the agent to get a response
response = openai_client.responses.create(
    input=[{"role": "user", "content": storyname}],
    extra_body={"agent": {"name": agent.name, "type": "agent_reference"}},
)

print(f"Response output: {response.output_text}")


