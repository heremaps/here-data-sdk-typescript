# Read from a volatile layer

This example shows how to retrieve partition metadata and partition data from a volatile layer on Node.js using HERE Data SDK for TypeScript.

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
   npm install --save @here/olp-sdk-authentication @here/olp-sdk-dataservice-read
   ```

   Now, everything is set to create the app.

5. Create the `index.ts` file and app skeleton.

   ```typescript
   /**
    * Example of the Node.js app used for reading a volatile layer from the datastore.
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

## Create `VolatileLayerClient`

You can use the `VolatileLayerClient` object to get the latest published data and partition metadata from a [volatile layer](https://developer.here.com/documentation/data-user-guide/portal/layers/layers.html#volatile-layers).

**To create the `VolatileLayerClient` object:**

1. Create the `OlpClientSettings` object.

   For instructions, see <a href="https://github.com/heremaps/here-data-sdk-typescript/blob/master/docs/create-platform-client-settings.md" target="_blank">Create platform client settings</a>.

2. Create the `VolatileLayerClient` object with `VolatileLayerClientParams` that contains the HERE Resource Name (HRN) of the catalog, the layer ID, and the platform client settings from step 1.

   ```typescript
   const volatileLayerClient = new VolatileLayerClient({
     catalogHrn: HRN.fromString("your-catalog-hrn"),
     layerId: "your-layer-id",
     settings: olpClientSettings,
   });
   ```

## Get partition metadata from a volatile layer

Partition metadata from a [volatile layer](https://developer.here.com/documentation/data-user-guide/portal/layers/layers.html#volatile-layers) consists of the following information about the partition:

- Data handle
- ID
- Data size
- Checksum
- Compressed data size

You can get partition metadata in one of the following ways:

- Using the Metadata Service API
- Using the Query Service API

You can get partition metadata using the Query Service API only if the partition has the HERE tile scheme. For more information on the HERE tile scheme, see [Partitions](https://developer.here.com/documentation/data-user-guide/portal/layers/partitions.html).

For performance reasons, it is best to use the Query Service API only to get metadata for a specific partition. For batch processes, and to get metadata for many partitions or all partitions in a layer, use the Metadata Service API.

**To get partition metadata from a volatile layer:**

1. Create the `VolatileLayerClient` object.

   For instructions, see [Create VolatileLayerClient](#create-volatilelayerclient).

2. Do one of the following:

   - (For partitions with the HERE tile scheme) To get partition metadata using the Metadata Service API:

     1. Create the `QuadKeyPartitionsRequest` object with the quadkey and the number of child partitions (from 0 to 4).

        ```typescript
        const requestByQuadKey = new QuadKeyPartitionsRequest()
          .withQuadKey("QuadKey")
          .withDepth("NumberOfChildPartitions")
          .withBillingTag("MyBillingTag");
        ```

     2. Call the `getPartitions` method with the `RequestByQuadKey` parameter.

        ```typescript
        const partitionsByQuadKey = await volatileLayerClient.getPartitions(
          requestByQuadKey
        );
        ```

     You get the quadkey tree index with metadata for the requested partition and its parent and children partitions.

   - To get partition metadata using the Metadata Service API:

     1. Create the `PartitionsRequest` object with the fetch option.

        The default fetch option is `OnlineIfNotFound`. It queries the network if the requested resource is not found in the cache. If you want to skip cache lookups and query the network right away, set the `withFetchOption` method to `OnlineOnly`.

        ```typescript
        const partitionsRequest = new PartitionsRequest()
          .withBillingTag("MyBillingTag")
          .withFetchOption(FetchOptions.OnlineOnly);
        ```

     2. Call the `getPartitions` method with the `PartitionsRequest` parameter.

        ```typescript
        const partitions = await volatileLayerClient.getPartitions(
          partitionsRequest
        );
        ```

     You get metadata for all the partitions in the layer.

In browser and Node.js, to abort requests before they have completed, you can create the `AbortController` object, and then add the `AbortController.signal` property to your requests. For more information, see the [`AbortController` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).

**Example**

```typescript
const abortController = new AbortController();
const partitions = await volatileLayerClient.getPartitions(
  partitionsRequest,
  abortController.signal
);
```

## Get data from a volatile layer

**To get data from the volatile layer:**

1. Create the `VolatileLayerClient` object.

   For instructions, see [Create VolatileLayerClient](#create-volatilelayerclient).

2. Create the `DataRequest` object with the partition ID and fetch option.

   The default fetch option is `OnlineIfNotFound`. It queries the network if the requested resource is not found in the cache. If you want to skip cache lookups and query the network right away, set the `withFetchOption` method to `OnlineOnly`.

   ```typescript
   const dataRequest = new DataRequest()
     .withPartitionId("PartitionId")
     .withBillingTag("MyBillingTag")
     .withFetchOption(FetchOptions.OnlineOnly);
   ```

3. Call the `getData` method with the `DataRequest` parameter.

   ```typescript
   const partitions = await volatileLayerClient.getData(dataRequest);
   ```

You receive data from the requested partition of the selected volatile layer.

In browser and Node.js, to abort requests before they have completed, you can create the `AbortController` object, and then add the `AbortController.signal` property to your requests. For more information, see the [`AbortController` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).

**Example**

```typescript
const abortController = new AbortController();
const partitions = await volatileLayerClient.getData(
  dataRequest,
  abortController.signal
);
```
