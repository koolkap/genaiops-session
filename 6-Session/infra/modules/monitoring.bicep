param location string

resource log 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: 'hrit-logs'
  location: location
  properties: { retentionInDays: 30 }
}

output logAnalyticsId string = log.id