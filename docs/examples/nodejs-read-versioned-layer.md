# Read from a Versioned Layer

This example shows how to retrieve partition metadata and partition data from a versioned layer on Node.js using the HERE Data SDK for TypeScript.

## Build and Run an Application on Node.js

Before you build an application, make sure that you installed all of the dependencies. For more information on the dependencies, see the [related section](../../README.md#Dependencies) in the README file.

**To build and run an application on Node.js:**

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

   Now, everything is set to create the application.

5. Create the `index.ts` file and application skeleton.

   ```typescript
   /**
    * Example of the Node.js application used for reading a versioned layer from the datastore.
    */

   class App {
     run() {
       console.log("App works!");
     }
   }

   const app = new App();
   app.run();
   ```

6. Compile and run the application.

   ```shell
   tsc && node .
   ```

After a successful run, the console displays the following message:

```shell
App works!
```

## <a name="authenticate-using-client-credentials"></a>Authenticate to the HERE Platform Using Client Credentials

To authenticate with the Here platform, you must get platform credentials that contain the access key ID and access key secret.

**To authenticate using client credentials:**

1. Get your platform credentials.

   For instructions, see the [Get Credentials](https://developer.here.com/olp/documentation/access-control/user-guide/topics/get-credentials.html) section in the Terms and Permissions User Guide.

   You get the `credentials.properties` file.

2. Set your credentials in one of the following ways:

   - (For Node.js only) Get your credentials from the file using the `loadCredentialsFromFile` helper method.

     ```typescript
     const credentials = loadCredentialsFromFile("Path");
     ```

   - (For browser and Node.js) Set credentials manually using the **here.access.key.іd** and **here.access.key.secret** from the `credentials.properties` file.

     ```typescript
     const credentials = {
       accessKeyId: "replace-with-your-access-key-id",
       accessKeySecret: "replace-with-your-access-key-secret",
     };
     ```

3. Import the `requestToken` method and the `UserAuth` module from the `olp-sdk-authentication` module.

   ```typescript
   import { UserAuth, requestToken } from "@here/olp-sdk-authentication";
   ```

4. Create the `UserAuth` instance using the environment in which you work, your credentials, and the `tokenRequester` method.

   > Note: Depending on the environment that you use, specify one of the following parameters: `env` or `customUrl`.

   ```typescript
   const userAuth = new UserAuth({
     env: "here | here-dev | here-cn | here-cn-dev",
     customUrl: "http://YourCustomEnvironment",
     credentials: credentials,
     tokenRequester: requestToken,
   });
   ```

5. Get the OAuth 2.0 token from the HERE platform using the `getToken` method.

   ```typescript
   const token: string = await userAuth.getToken();
   ```

You can use the `UserAuth` instance to create the `OlpClientSettings` object.

To learn more about authentication, see [Authenticate to the HERE Platform](authenticate.md).

## <a name="create-olpclientsettings"></a>Create `OlpClientSettings`

You need to create the `OlpClientSettings` object to get catalog and partition metadata, as well as layer data from the HERE platform.

**To create the `OlpClientSettings` object:**

1. [Authenticate](#authenticate-using-client-credentials) to the HERE platform.

2. Import the `OlpClientSettings` class from the `olp-sdk-dataservice-read` module.

   ```typescript
   import { OlpClientSettings } from "@here/olp-sdk-dataservice-read";
   ```

3. Create the `olpClientSettings` instance using the environment in which you work and the `getToken` method.

   ```typescript
   const olpClientSettings = new OlpClientSettings({
     environment:
       "here | here-dev | here-cn | here-cn-dev | http://YourCustomEnvironment",
     getToken: () => userAuth.getToken(),
   });
   ```

## <a name="create-versionedlayerclient"></a>Create `VersionedLayerClient`

You can use the `VersionedLayerClient` object to request any data and partition metadata version from a [versioned layer](https://developer.here.com/olp/documentation/data-user-guide/portal/layers/layers.html#versioned-layers). When you request a particular version of data from the versioned layer, the partition you receive in the response may have a lower version number than you requested. The version of a layer or partition represents the catalog version in which the layer or partition was last updated.

**To create the `VersionedLayerClient` object:**

1. Create the `OlpClientSettings` object.

   For instructions, see [Create OlpClientSettings](#create-olpclientsettings).

2. Create a [[VersionedLayerClient]] instance with `VersionedLayerClientParams` that contains the catalog HRN, the layer ID, the platform client settings from step 1, and the layer version.

   > Note: If the version is not specified, the latest version is used.

   ```typescript
   const versionedLayerClient = new VersionedLayerClient({
     catalogHrn: "CatalogHRN",
     layerId: "LayerId",
     settings: olpClientSettings,
     version: 5,
   });
   ```

## Get Data from a Versioned Layer

**To get data from the versioned layer:**

1. Create the `VersionedLayerClient` object.

   For instructions, see [Create VersionedLayerClient](#create-versionedlayerclient).

2. Create the `DataRequest` object with the layer version and partition ID.

   > Note: If a catalog version is not specified, the latest version is used.

   ```typescript
   const dataRequest = new DataRequest()
     .withVersion("VersionNumber")
     .withPartitionId("PartitionId")
     .withBillingTag("MyBillingTag");
   ```

3. Call the `GetData` method with the `DataRequest` parameter.

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

## Get Partition Metadata from a Versioned Layer

Partition metadata from a versioned layer consists of the following information about the partition:

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

For performance reasons, it is best to use the Query Service API to get metadata for a specific partition. For batch processes, and to get metadata for many partitions or all partitions in a layer, use the Metadata Service API.

**To get partition metadata from a versioned layer:**

1. Create the `versionedLayerClient` object.

   For instructions, see [Create VersionedLayerClient](#create-versionedlayerclient).

2. Do one of the following:

   - (For partitions with the HERE tile scheme) To get partition metadata using the Metadata Service API:

     1. Create the `QuadKeyPartitionsRequest` object with the version number of the layer for which you want to get the metadata, the quadkey, and the number of child partitions (from 0 to 4).

        > Note: You do not need to specify a version number if you want to get metadata for a volatile layer or the latest version of the versioned layer.

        ```typescript
        const requestByQuadKey = new QuadKeyPartitionsRequest()
          .withVersion("VersionNumber")
          .withQuadKey("QuadKey")
          .withDepth("NumberOfChildPartitions")
          .withBillingTag("MyBillingTag");
        ```

     2. Call the `GetPartitions` method with the `RequestByQuadKey` parameter.

        ```typescript
        const partitionsByQuadKey = await versionedLayerClient.getPartitions(
          requestByQuadKey
        );
        ```

     You get the quadkey tree index with metadata for the requested partition and its parent and children partitions.

   - To get partition metadata using the Metadata Service API:

     1. Create the `PartitionsRequest` object with the version number of the layer for which you want to get the metadata.

        > Note: You don't need to specify a version number if you want to get metadata for the latest version of the versioned layer.

        ```typescript
        const partitionsRequest = new PartitionsRequest()
          .withVersion("VersionNumber")
          .withBillingTag("MyBillingTag");
        ```

     2. Call the `GetPartitions` method with the `PartitionsRequest` parameter.

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
