#Iterative Prompting Example

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
            "role": "user",
            "content": "My days is going good. I had a great cup of coffee in the morning.But now I am feeling a bit tired.",
        }
    ]

response = client.chat.completions.create(
    messages=messages,
    max_completion_tokens=100000,
    model=os.getenv("AZURE_OPENAI_DEPLOYMENT")
)

ideas  = response.choices[0].message.content

messages=[   
        {
            "role": "user",
            "content": f"Want to rephrase the above message to more formal way for mailing to boss: {ideas}",
        }
    ]
namepicker = client.chat.completions.create(
    messages=messages,
    max_completion_tokens=100000,
    model=os.getenv("AZURE_OPENAI_DEPLOYMENT")
)
print(namepicker.choices[0].message.content)

