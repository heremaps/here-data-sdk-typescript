# Read from an Index Layer

This example shows how to retrieve partition metadata and partition data from an index layer on Node.js using the OLP SDK for TypeScript.

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
   npm install --save @here/olp-sdk-authentication @here/olp-sdk-dataservice-read @here/olp-sdk-dataservice-api
   ```

   Now, everything is set to create the application.

5. Create the index.ts file and application skeleton.

   ```typescript
   /**
    * Example of the Node.js application used for reading an index layer from the datastore.
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

## <a name="create-IndexlayerClient"></a>Create `IndexLayerClient`

You can use the `IndexLayerClient` object to request any data and partition metadata from an [index layer](https://developer.here.com/olp/documentation/data-user-guide/portal/layers/layers.html#index-layers).

To create the `IndexLayerClient` object:

1. Get an access key ID and access key secret.
   For instructions, see [Authenticate to HERE OLP Using Client Credentials](#authenticate-using-client-credentials).

2. Create the `OlpClientSettings` object.
   For instructions, see [Create OlpClientSettings](#create-olpclientsettings).

3. Create the `IndexLayerClient` object with the HERE Resource Name (HRN) of the catalog that contains the layer, the layer ID, and the OLP client settings from step 2.

   ```typescript
   const indexLayerClient = await new IndexLayerClient()
       hrn: "CatalogHRN",
       layerId: "LayerId",
       olpClientSettings
   );
   ```

## Get Partition Metadata from an Index Layer

Partition metadata from an index layer consists of the following information about the partition:

- ID (data handle)
- Data size
- Checksum
- Metadata
- Timestamp

To get partition metadata from an index layer:

1. Create the `IndexLayerClient` object.
   For instructions, see [Create IndexLayerClient](#create-IndexlayerClient).

2. Create the `IndexQueryRequest` object with the RSQL query string and, if the query string is huge, set the `huge` boolean parameter to `true`.

   > Note: The `huge` parameter is optional, and its default value is `false`.

   ```typescript
   const request = new IndexQueryRequest()
     .withQueryString("RSQL string query")
     .withHugeResponse(true);
   ```

3. Call the `GetPartitions` method with the `IndexQueryRequest` parameter.

   ```typescript
   const partitions = await indexLayerClient.getPartitions(request);
   ```

   You get metadata for all the partitions in the layer.

In browser and Node.js, to abort requests before they have completed, you can create the `AbortController` object, and then add the `AbortController.signal` property to your requests. For more information, see the [`AbortController` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).

**Example**

```typescript
const abortController = new AbortController();
const partitions = await indexLayerClient.getPartitions(
  partitionsRequest,
  abortController.signal
);
```

## Get Data from an Index Layer

To get data from the index layer:

1. Create the `IndexLayerClient` object.
   For instructions, see [Create IndexLayerClient](#create-IndexlayerClient).

2. Call the `GetData` method with the data model that contains the ID property (also used as the data handle).

   > Note: You can find the data model in the partition metadata. For instructions, see [Get Partition Metadata from an Index Layer](#get-partition-metadata-from-an-index-layer).

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
