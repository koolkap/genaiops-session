from openai import AzureOpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = AzureOpenAI(
    api_version=os.getenv("AZURE_OPENAI_VERSION"),
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_KEY")
)



messages=[
        {
            "role": "system",
            "content": "You are a helpful assistant.",
        },
        {
            "role": "user",
            "content": "I need to write mail to my manager about project status.Notify her that we are on track to complete the project by the end of the month.",
        }
    ]

response = client.chat.completions.create(
    messages=messages,
    max_completion_tokens=100000,
    model=os.getenv("AZURE_OPENAI_DEPLOYMENT")
)



print(response.choices[0].message.content)

