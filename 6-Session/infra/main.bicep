param location string = resourceGroup().location

module storage './modules/storage.bicep' = {
  name: 'storage'
  params: { location: location }
}

module openai './modules/openai-foundry.bicep' = {
  name: 'openai'
  params: { location: location }
}

module search './modules/ai-search.bicep' = {
  name: 'search'
  params: { location: location }
}

module monitoring './modules/monitoring.bicep' = {
  name: 'monitoring'
  params: { location: location }
}

