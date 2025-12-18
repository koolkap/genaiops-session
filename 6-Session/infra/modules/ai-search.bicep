param location string

resource search 'Microsoft.Search/searchServices@2023-11-01' = {
  name: 'hrit-search'
  location: location
  sku: { name: 'standard' }
}