param location string

resource storage 'Microsoft.Storage/storageAccounts@2025-06-01' = {
  name: 'hritpolicystorage'
  location: location
  sku: { name: 'Standard_LRS' }
  kind: 'StorageV2'
}

resource container 'Microsoft.Storage/storageAccounts/blobServices/containers@2025-06-01' = {
  name: '${storage.name}/default/policies'
  properties: { publicAccess: 'None' }
}
