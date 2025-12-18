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