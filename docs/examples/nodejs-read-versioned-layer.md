# Read from a versioned layer

This example shows how to retrieve partition metadata and partition data from a versioned layer on Node.js using HERE Data SDK for TypeScript.

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
    * Example of the Node.js app used for reading a versioned layer from the datastore.
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

## Create `VersionedLayerClient`

You can use the `VersionedLayerClient` object to request any data and partition metadata version from a [versioned layer](https://developer.here.com/olp/documentation/data-user-guide/portal/layers/layers.html#versioned-layers). When you request a particular version of data from the versioned layer, the partition you receive in the response may have a lower version number than you requested. The version of a layer or partition represents the catalog version in which the layer or partition was last updated.

**To create the `VersionedLayerClient` object:**

1. Create the `OlpClientSettings` object.

   For instructions, see <a href="https://github.com/heremaps/here-data-sdk-typescript/blob/master/docs/create-platform-client-settings.md" target="_blank">Create platform client settings</a>.

2. Create a `VersionedLayerClient` instance with `VersionedLayerClientParams` that contains the catalog HRN, the layer ID, the platform client settings from step 1, and the layer version.

   You do not need to specify a version number if you want to get metadata for the latest version of the versioned layer.

   > #### Note
   > If the version is not specified, the latest version is used.

   ```typescript
   const versionedLayerClient = new VersionedLayerClient({
     catalogHrn: HRN.fromString("your-catalog-hrn"),
     layerId: "your-layer-id",
     settings: olpClientSettings,
     version: number,
   });
   ```

## Get partition metadata from a versioned layer

Partition metadata from a [versioned layer](https://developer.here.com/olp/documentation/data-user-guide/portal/layers/layers.html#versioned-layers) consists of the following information about the partition:

- Data handle
- ID
- Version
- Data size
- Checksum
- Compressed data size

You can get partition metadata in one of the following ways:

- Using the Metadata Service API
- Using the Query Service API
 
You can get partition metadata using the Query Service API only if the partition has the HERE tile scheme. For more information on the HERE tile scheme, see [Partitions](https://developer.here.com/olp/documentation/data-user-guide/portal/layers/partitions.html).

For performance reasons, it is best to use the Query Service API only to get metadata for a specific partition. For batch processes, and to get metadata for many partitions or all partitions in a layer, use the Metadata Service API.

**To get partition metadata from a versioned layer:**

1. Create the `VersionedLayerClient` object.

   For instructions, see [Create VersionedLayerClient](#create-versionedlayerclient).

2. Do one of the following:

   - (For partitions with the HERE tile scheme) To get partition metadata using the Metadata Service API:

     1. Create the `QuadKeyPartitionsRequest` object with the version number of the layer for which you want to get the metadata, the quadkey, and the number of child partitions (from 0 to 4).

        The version specified in the request overrides the version specified in the `VersionedLayerClient` object.

        > #### Note
        > You do not need to specify a version number if you want to get metadata for the latest version of a versioned layer.  

        ```typescript
        const requestByQuadKey = new QuadKeyPartitionsRequest()
          .withVersion("VersionNumber")
          .withQuadKey("QuadKey")
          .withDepth("NumberOfChildPartitions")
          .withBillingTag("MyBillingTag");
        ```

     2. Call the `getPartitions` method with the `RequestByQuadKey` parameter.

        ```typescript
        const partitionsByQuadKey = await versionedLayerClient.getPartitions(
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
        const partitions = await versionedLayerClient.getPartitions(
          partitionsRequest
        );
        ```

     You get metadata for all the partitions in the layer.

In browser and Node.js, to abort requests before they have completed, you can create the `AbortController` object, and then add the `AbortController.signal` property to your requests. For more information, see the [`AbortController` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).

**Example**

```typescript
const abortController = new AbortController();
const partitions = await versionedLayerClient.getPartitions(
  partitionsRequest,
  abortController.signal
);
```

## Get data from a versioned layer

You can request any data version from a [versioned layer](https://developer.here.com/olp/documentation/data-user-guide/portal/layers/layers.html#versioned-layers). When you request a particular version of data from the versioned layer, the partition you receive in the response may have a lower version number than you requested. The version of a layer or partition represents the catalog version in which the layer or partition was last updated.

**To get data from the versioned layer:**

1. Create the `VersionedLayerClient` object.

   For instructions, see [Create VersionedLayerClient](#create-versionedlayerclient).

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
   const partitions = await versionedLayerClient.getData(dataRequest);
   ```

You receive data from the requested partition of the selected layer version.

In browser and Node.js, to abort requests before they have completed, you can create the `AbortController` object, and then add the `AbortController.signal` property to your requests. For more information, see the [`AbortController` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).

**Example**

```typescript
const abortController = new AbortController();
const partitions = await versionedLayerClient.getData(
  dataRequest,
  abortController.signal
);
```
