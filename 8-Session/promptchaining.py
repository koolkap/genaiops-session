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
            "content": "List 5 different ideas for a coffee shop name.",
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
            "content": f"Create taglines for each of these: {ideas}",
        }
    ]
namepicker = client.chat.completions.create(
    messages=messages,
    max_completion_tokens=100000,
    model=os.getenv("AZURE_OPENAI_DEPLOYMENT")
)
print(namepicker.choices[0].message.content)

