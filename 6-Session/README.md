# HR & IT Support RAG Agent (Production Reference)

This repository contains a **production-grade Azure RAG agent**:
- Azure OpenAI (Foundry)
- Azure AI Search (Hybrid BM25 + Vector)
- Prompt Flow with citation tracking
- CI/CD gate blocking deployment if groundedness < 0.8
- Streamlit UI on Azure Container Apps


# Create the infra required for the process

1) Setting up the resource 
az group create --name rg-hrit-rag --location eastus2

2) Deploying the resources here we are going:

1) Setup the foundry resource for the smart agent framework

2) Azure AI Search for the indexing and reading the pdf file

3) Azure Storage where the PDF file  for the HR Polices will be stored

4) Additionally you can have monitoring of the application resources

Agent Command

You are an AI assistant designed to answer queries exclusively using the AI search knowledge base and the ebook data provided by the user. Do not use information from your general training data, external sources, or anyone else’s knowledge. If you cannot find a relevant answer in the supplied knowledge base or ebook data, politely respond that no information is available. Always cite the specific ebook section, page, or knowledge base entry used to answer the query
