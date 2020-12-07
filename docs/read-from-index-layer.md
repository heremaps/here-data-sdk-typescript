# Read from an index layer

This example shows how to retrieve partition metadata and partition data from an index layer on Node.js using HERE Data SDK for TypeScript.

## Build and run an app on Node.js

Before you build an app, make sure that you installed all of the <a href="https://github.com/heremaps/here-data-sdk-typescript#dependencies" target="_blank">dependencies</a>.

**To build and run an app on Node.js:**

1. Create an npm project.

   ```shell
   mkdir example-app && cd example-app && npm init
   ```

2. Initialize a TypeScript project.

   ```shell
   tsc --init
   ```

3. Install node types.

   ```shell
   npm install --save-dev @types/node
   ```

4. Install the SDK modules.

   ```shell
   npm install --save @here/olp-sdk-authentication @here/olp-sdk-dataservice-read @here/olp-sdk-dataservice-api
   ```

   Now, everything is set to create the app.

5. Create the `index.ts` file and app skeleton.

   ```typescript
   /**
    * Example of the Node.js app used for reading an index layer from the datastore.
    */

   class App {
     run() {
       console.log("App works!");
     }
   }

   const app = new App();
   app.run();
   ```

6. Compile and run the app.

   ```shell
   tsc && node .
   ```

After a successful run, the console displays the following message:

```shell
App works!
```

## Create `IndexLayerClient`

You can use the `IndexLayerClient` object to request any data and partition metadata from an [index layer](https://developer.here.com/olp/documentation/data-user-guide/portal/layers/layers.html#index-layers).

**To create the `IndexLayerClient` object:**

1. Create the `OlpClientSettings` object.

   For instructions, see <a href="https://github.com/heremaps/here-data-sdk-typescript/blob/master/docs/create-platform-client-settings.md" target="_blank">Create platform client settings</a>.

2. Create the `IndexLayerClient` object with `IndexLayerClientParams` that contains the HERE Resource Name (HRN) of the catalog that contains the layer, layer ID, and platform client settings from step 1.

   ```typescript
   const indexLayerClient = await new IndexLayerClient({
     catalogHrn: HRN.fromString("your-catalog-hrn"),
     layerId: "your-layer-id",
     settings: olpClientSettings,
   });
   ```

## Get partition metadata from an index layer

Partition metadata from [index layer](https://developer.here.com/olp/documentation/data-user-guide/portal/layers/layers.html#index-layers) consists of the following information about the partition:

- ID (data handle)
- Data size
- Checksum
- Metadata
- Timestamp

**To get partition metadata from an index layer:**

1. Create the `IndexLayerClient` object.

   For instructions, see [Create IndexLayerClient](#create-indexlayerclient).

2. Create the `IndexQueryRequest` object with the RSQL query string and, if the query string is huge, set the `huge` boolean parameter to `true`.

   > #### Note
   > The `huge` parameter is optional, and its default value is `false`.

   ```typescript
   const request = new IndexQueryRequest()
     .withQueryString("RSQL string query")
     .withHugeResponse(true);
   ```

3. Call the `getPartitions` method with the `IndexQueryRequest` parameter.

   ```typescript
   const partitions = await indexLayerClient.getPartitions(request);
   ```

   You get the partition metadata filtered by the RSQL query.

In browser and Node.js, to abort requests before they have completed, you can create the `AbortController` object, and then add the `AbortController.signal` property to your requests. For more information, see the [`AbortController` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).

**Example**

```typescript
const abortController = new AbortController();
const partitions = await indexLayerClient.getPartitions(request),
  abortController.signal
);
```

## Get data from an index layer

An [index layer](https://developer.here.com/olp/documentation/data-user-guide/portal/layers/layers.html#index-layers) is an index of the catalog data by attributes. You can query the index layer to get the data handles of data that meets your query criteria, and you can then use those data handles to retrieve the corresponding data.

**To get data from the index layer:**

1. Create the `IndexLayerClient` object.

   For instructions, see [Create IndexLayerClient](#create-indexlayerclient).

2. Call the `getData` method with the data model that contains the ID property (also used as the data handle).

   > #### Note
   > You can find the data model in the partition metadata. For instructions, see [Get partition metadata from an index layer](#get-partition-metadata-from-an-index-layer).

   ```typescript
   const data = await indexLayerClient.getData(model);
   ```

You receive data from the requested partition.
 
In browser and Node.js, to abort requests before they have completed, you can create the `AbortController` object, and then add the `AbortController.signal` property to your requests. For more information, see the [`AbortController` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).

**Example**

```typescript
const abortController = new AbortController();
const data = await indexLayerClient.getData(model, abortController.signal);
```
