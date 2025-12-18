#Delimiting/Separating different sections of the prompt with special tokens or characters to provide clarity to the model.

from openai import AzureOpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = AzureOpenAI(
    api_version=os.getenv("AZURE_OPENAI_VERSION"),
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_KEY")
)

inputText = "<document>How dollar increase affects the economy?</document>"

prompt = f"Extract the text enclosed within the <document> and </document> tags.{inputText}"

response = client.chat.completions.create(
    messages=[{"role": "user", "content": prompt}],
    max_completion_tokens=100000,
    model=os.getenv("AZURE_OPENAI_DEPLOYMENT")
)



print(response.choices[0].message.content)

