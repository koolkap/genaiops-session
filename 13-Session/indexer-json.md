{
  "@odata.context": "https://search-ais-eastus2-demo-aisearch.search.windows.net/$metadata#indexers/$entity",
  "@odata.etag": "\"0x8DE1B97D1D05984\"",
  "name": "full-text-search-indexer",
  "description": null,
  "dataSourceName": "full-text-search-datasource",
  "skillsetName": <name_of_skill_set_ai_search>,
  "targetIndexName": "full-text-search",
  "disabled": null,
  "schedule": null,
  "parameters": {
    "batchSize": null,
    "maxFailedItems": null,
    "maxFailedItemsPerBatch": null,
    "configuration": {
      "parsingMode": "json",
      "dataToExtract": "contentAndMetadata"
    }
  },
  "fieldMappings": [
    {
      "sourceFieldName": "metadata_storage_name",
      "targetFieldName": "title",
      "mappingFunction": null
    },
    {
      "sourceFieldName": "metadata_storage_path",
      "targetFieldName": "id",
      "mappingFunction": {
        "name": "base64Encode",
        "parameters": {
          "useHttpServerUtilityUrlTokenEncode": false
        }
      }
    }
  ],
  "outputFieldMappings": [{
    "sourceFieldName": "/document/embedding",
    "targetFieldName": "<name_of_field_in_ai_search>",
    "mappingFunction": null
  }],
  "cache": null,
  "encryptionKey": null
}
