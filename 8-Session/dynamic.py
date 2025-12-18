#Dynamic Prompting Example
#Iterative Prompting Example

from openai import AzureOpenAI
import os
from dotenv import load_dotenv
from jinja2 import Template

load_dotenv()

client = AzureOpenAI(
    api_version=os.getenv("AZURE_OPENAI_VERSION"),
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_KEY")
)


template_str = """
You are a {{ role }}.
Your task: {{ task }}
Input: {{ user_input }}
"""

t = Template(template_str)

final = t.render(
    role="financial advisor",
    task="explain compounding interest",
    user_input="How does compounding work?"
)

messages=[   
        {
            "role": "user",
            "content": final,
        }
    ]
response = client.chat.completions.create(
    messages=messages,
    max_completion_tokens=100000,
    model=os.getenv("AZURE_OPENAI_DEPLOYMENT")
)
print(response.choices[0].message.content)

