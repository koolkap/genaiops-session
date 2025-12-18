param location string

resource aoai 'Microsoft.CognitiveServices/accounts@2025-10-01-preview' = {
  name: 'hrit-openai'
  location: location
  kind: 'OpenAI'
  sku: { name: 'S0' }
}

resource chat 'Microsoft.CognitiveServices/accounts/deployments@2025-10-01-preview' = {
  name: '${aoai.name}/chat'
  properties: {
    model: { name: 'gpt-4o-mini', version: '2024-07-18' }
  }
}

resource embed 'Microsoft.CognitiveServices/accounts/deployments@2025-10-01-preview' = {
  name: '${aoai.name}/embeddings'
  properties: {
    model: { name: 'text-embedding-3-large', version: '1' }
  }
}
