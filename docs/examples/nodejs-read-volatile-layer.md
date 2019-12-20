# Read from a Volatile Layer

This example shows how to retrieve partition metadata and partition data from a volatile layer on Node.js using the OLP SDK for TypeScript.

## Build and Run an Application on Node.js

Before you build an application, make sure that you installed all of the dependencies. For more information on the dependencies, see the [related section](../../README.md#Dependencies) in the README file.

To build and run an application on Node.js:

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

   Now, everything is set to create the application.

5. Create the index.ts file and application skeleton.

   ```typescript
   /**
    * Example of the Node.js application used for reading a volatile layer from the datastore.
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

## <a name="authenticate-using-client-credentials"></a>Authenticate to HERE OLP Using Client Credentials

To authenticate with the Open Location Platform (OLP), you must get platform credentials that contain the access key ID and access key secret.

To authenticate using client credentials:

1. Get your platform credentials. For instructions, see the [Get Credentials](https://developer.here.com/olp/documentation/access-control/user-guide/topics/get-credentials.html) section in the Terms and Permissions User Guide.

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
       accessKeySecret: "replace-with-your-access-key-secret"
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
     tokenRequester: requestToken
   });
   ```

5. Get the OAuth 2.0 token from OLP using the `getToken` method.

   ```typescript
   const token: string = await userAuth.getToken();
   ```

You can use the `UserAuth` instance to create the `OlpClientSettings` object.

## <a name="create-olpclientsettings"></a>Create `OlpClientSettings`

You need to create the `OlpClientSettings` object to get catalog and partition metadata, as well as layer data from the Open Location Platform (OLP).

To create the `OlpClientSettings` object:

1. [Authenticate](#authenticate-using-client-credentials) to the Open Location Platform (OLP).

2. Import the `OlpClientSettings` class from the `olp-sdk-dataservice-read` module.

   ```typescript
   import { OlpClientSettings } from "@here/olp-sdk-dataservice-read";
   ```

3. Create the `olpClientSettings` instance using the environment in which you work and the `getToken` method.

   ```typescript
   const olpClientSettings = new OlpClientSettings({
     environment:
       "here | here-dev | here-cn | here-cn-dev | http://YourCustomEnvironment",
     getToken: () => userAuth.getToken()
   });
   ```

## <a name="create-volatilelayerclient"></a>Create `VolatileLayerClient`

You can use the `VolatileLayerClient` object to get the latest published data and partition metadata from a [volatile layer](https://developer.here.com/olp/documentation/data-user-guide/portal/layers/layers.html#volatile-layers).

To create the `VolatileLayerClient` object:

1. Get an access key ID and access key secret.
   For instructions, see [Authenticate to HERE OLP Using Client Credentials](#authenticate-using-client-credentials).

2. Create the `OlpClientSettings` object.
   For instructions, see [Create OlpClientSettings](#create-olpclientsettings).

3. Create the `VolatileLayerClient` object with the HERE Resource Name (HRN) of the catalog that contains the layer, the layer ID, and the OLP client settings.

   ```typescript
   const volatileLayerClient = await new VolatileLayerClient()
       hrn: "CatalogHRN",
       layerId: "LayerId",
       olpClientSettings
   );
   ```

## Get Data from a Volatile Layer

To get data from the volatile layer:

1. Create the `VolatileLayerClient` object.
   For instructions, see [Create VolatileLayerClient](#create-volatilelayerclient).

2. Create the `DataRequest` object with the partition ID.

   ```typescript
   const dataRequest = new DataRequest()
     .withPartitionId("PartitionId")
     .withBillingTag("MyBillingTag");
   ```

3. Call the `GetData` method with the `DataRequest` parameter.

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

## Get Partition Metadata from a Volatile Layer

Partition metadata from a volatile layer consists of the following information about the partition:

- Data handle
- ID
- Data size
- Checksum
- Compressed data size

You can get partition metadata in one of the following ways:

- Using the OLP Metadata Service
- Using the OLP Query Service

You can get partition metadata using the OLP Query Service only if the partition has the HERE tile scheme. For more information on the HERE tile scheme, see [Partitions](https://developer.here.com/olp/documentation/data-user-guide/portal/layers/partitions.html).

For performance reasons, it is best to use the OLP Query Service to get metadata for a specific partition. For batch processes, and to get metadata for many partitions or all partitions in a layer, use the OLP Metadata Service.

To get partition metadata from a voaltile layer:

1. Create the `VolatileLayerClient` object.
   For instructions, see [Create VolatileLayerClient](#create-volatilelayerclient).

2. Do one of the following:

   - (For partitions with the HERE tile scheme) To get partition metadata using the OLP Metadata Service:

     1. Create the `QuadKeyPartitionsRequest` object with the quadkey and the number of child partitions (from 0 to 4).

        ```typescript
        const requestByQuadKey = new QuadKeyPartitionsRequest()
          .withQuadKey("QuadKey")
          .withDepth("NumberOfChildPartitions")
          .withBillingTag("MyBillingTag");
        ```

     2. Call the `GetPartitions` method with the `RequestByQuadKey` parameter.

        ```typescript
        const partitionsByQuadKey = await volatileLayerClient.getPartitions(
          requestByQuadKey
        );
        ```

     You get the quadkey tree index with metadata for the requested partition and its parent and children partitions.

   - To get partition metadata using the OLP Metadata Service:

     1. Create the `PartitionsRequest` object.

        ```typescript
        const partitionsRequest = new PartitionsRequest().withBillingTag(
          "MyBillingTag"
        );
        ```

     2. Call the `GetPartitions` method with the `PartitionsRequest` parameter.

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
