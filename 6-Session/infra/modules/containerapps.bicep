param location string
param logAnalyticsId string

resource env 'Microsoft.Web/containerApps/managedEnvironments@2025-05-01' = {
  name: 'hrit-ca-env'
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: reference(logAnalyticsId).customerId
        sharedKey: listKeys(logAnalyticsId, '2020-08-01').primarySharedKey
      }
    }
  }
}
