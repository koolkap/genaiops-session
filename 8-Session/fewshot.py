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
    "Translate the English to Korean:\n"
    "English: Hello. \n Korean: 안녕하세요.\n"
    "English: I love programming. \n Korean:"
)

response = client.chat.completions.create(
    messages=[{"role": "user", "content": prompt}],
    max_completion_tokens=100000,
    model=os.getenv("AZURE_OPENAI_DEPLOYMENT")
)



print(response.choices[0].message.content)

