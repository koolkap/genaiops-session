{
  "name": "Learn vectorization",
  "description": "Skill set to merge product text and generate embeddings for Product Catalog.",
  "skills": [
    {
      "@odata.type": "#Microsoft.Skills.Text.MergeSkill",
      "name": "mergeText",
      "description": "Merge description and tags for embedding",
      "context": "/document",
      "insertPreTag": " ",
      "insertPostTag": " ",
      "inputs": [
        {
          "name": "text",
          "source": "/document/description"
        },
        {
          "name": "itemsToInsert",
          "source": "/document/tags"
        }
      ],
      "outputs": [
        {
          "name": "mergedText",
          "targetName": "combined_text"
        }
      ]
    },
    {
      "@odata.type": "#Microsoft.Skills.Text.AzureOpenAIEmbeddingSkill",
      "name": "generateEmbedding",
      "description": "Skill to generate embeddings via Azure OpenAI",
      "context": "/document",
      "resourceUri": "https://<aifoundry-resource-name>.cognitiveservices.azure.com",
      "deploymentId": "<embedding-deployment-name>",
      "modelName": "<embedding-model-name>",
      "dimensions": 1536,
      "inputs": [
        {
          "name": "text",
          "source": "/document/combined_text"
        }
      ],
      "outputs": [
        {
          "name": "embedding",
          "targetName": "embedding"
        }
      ]
    }
  ],
  "cognitiveServices": {
    "@odata.type": "#Microsoft.Azure.Search.CognitiveServicesByKey",
    "key": "<cognitive-services-key-for-ai-foundry-resource>"
  }
}
