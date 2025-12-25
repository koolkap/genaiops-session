import os
from dotenv import load_dotenv
from azure.search.documents import SearchClient
from azure.search.documents.models import VectorizedQuery
from azure.core.credentials import AzureKeyCredential
from openai import AzureOpenAI
load_dotenv()
# Load environment variables
AZURE_SEARCH_ENDPOINT = os.getenv("AZURE_SEARCH_ENDPOINT")

AZURE_SEARCH_INDEX = os.getenv("AZURE_SEARCH_INDEX")
AZURE_SEARCH_API_KEY = os.getenv("AZURE_SEARCH_API_KEY")

AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
AZURE_OPENAI_DEPLOYMENT_ID = os.getenv("AZURE_OPENAI_DEPLOYMENT_GPT_ID")
AZURE_OPENAI_EMBEDDING_DEPLOYMENT_ID = os.getenv("AZURE_OPENAI_DEPLOYMENT_TEXT_EMBEDDING_ID")

# Step 1: Initialize Azure AI Search client
search_client = SearchClient(
    endpoint=AZURE_SEARCH_ENDPOINT,
    index_name=AZURE_SEARCH_INDEX,
    credential=AzureKeyCredential(AZURE_SEARCH_API_KEY)
)

# Step2: Initialize Azure OpenAI client
openai_client = AzureOpenAI(
    api_key=AZURE_OPENAI_API_KEY,
    azure_endpoint=AZURE_OPENAI_ENDPOINT,
    api_version="2024-12-01-preview"
)

# Step 3: Create embeddings for the query
def create_embeddings(query):
    client = AzureOpenAI(
        api_key=AZURE_OPENAI_API_KEY,
        api_version="2024-12-01-preview",  # or the version you're using
        azure_endpoint=AZURE_OPENAI_ENDPOINT,  # This should be your Azure OpenAI endpoint
    )
    response = client.embeddings.create(
        input=[query],
        model=AZURE_OPENAI_EMBEDDING_DEPLOYMENT_ID  # 👈 This is your Azure deployment name, not the model ID
    )
    embedding = response.data[0].embedding
    return embedding

# Step 4: Search the index using vector search
def vector_search(query, top_k=5):

    embedding = create_embeddings(query)

    vector_query = VectorizedQuery(
        vector=embedding,
        fields="text_vector",
        kind="vector",
        k_nearest_neighbors=top_k
    )
    search_results = search_client.search(
        search_text=query,
        vector_queries=[vector_query],
        select=["chunk", "title"],  # Adjust based on your index schema
        top=top_k
    )

    results = []
    for result in search_results:
        results.append({
            "chunk": result["chunk"],
            "title": result["title"]
        })

    return results

# Step 6: Query Azure AI Search
def retrieve_documents(query: str, top_k: int = 5):
    results = search_client.search(
        search_text=query,
        top=top_k,
        select="chunk,title"  # Adjust based on your index schema
    )
    documents = []
    for doc in results:
        documents.append(f"{doc['title']}: {doc['chunk']}")
    return "\n".join(documents)

# Step 7: Format prompt and call OpenAI
def generate_answer(query: str):
    sources = retrieve_documents(query)
    results = vector_search(query)
    # Step 7.1: Get top-k documents from Azure AI Search
    docs = [result["chunk"] for result in results]
    # Step 7.2: Build the context
    context = "\n\n".join(docs)

    prompt = f"""You are Korean healthcare Knowledge Generator, which helps user for NHS policy questions based on the context provided.
         You don't have access to external knowledge, so answer based on the current context.Cite sources using the [number] format, but only cite a source if you use its content in your answer.
          f"Context:\n{context}\n\nWhat 
         Question: {query}
         Sources:
             {sources}
         """
    response = openai_client.chat.completions.create(
        model=AZURE_OPENAI_DEPLOYMENT_ID,
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content

# Example usage
if __name__ == "__main__":
    canContinue = 'y'
    while canContinue.lower() == 'y':
        user_query = input("Enter your question: ")
        answer = generate_answer(user_query)
        print("Answer:", answer)
        canContinue = input("Do you want to continue? (y/n): ")
        # clear the console for better readability
        os.system('cls' if os.name == 'nt' else 'clear')
        if canContinue.lower() != 'y':
            print("Exiting the chat.")
            break