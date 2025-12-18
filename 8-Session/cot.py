from openai import AzureOpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = AzureOpenAI(
    api_version=os.getenv("AZURE_OPENAI_VERSION"),
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_KEY")
)

prompt = (
    "If Alex is taller than Bob \n"
    "And Bob is taller then Joe\n"
    "Who is the tallest? Let me think step by step."
)

response = client.chat.completions.create(
    messages=[{"role": "user", "content": prompt}],
    max_completion_tokens=100000,
    model=os.getenv("AZURE_OPENAI_DEPLOYMENT")
)



print(response.choices[0].message.content)

