# Read from a Stream Layer

This example shows how to retrieve partition metadata and partition data from a Stream layer on Node.js using the OLP SDK for TypeScript.

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
    * Example of the Node.js application used for reading a stream layer from the datastore.
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

## <a name="create-streamlayerclient"></a>Create `StreamLayerClient`

You can use the `StreamLayerClient` class to request data from the queue that streams data from a [stream layer](https://developer.here.com/olp/documentation/data-user-guide/portal/layers/layers.html#stream-layers). Once a consumer read the data, the data is no longer available to that consumer, but the data remains available to other consumers.

Stream layers can be configured with retention time, or time-to-live (TTL) which results in unconsumed data being removed after a specified period.

To create the `StreamLayerClient` instance:

1. Get an access key ID and access key secret.
   For instructions, see [Authenticate to HERE OLP Using Client Credentials](#authenticate-using-client-credentials).

2. Create the `OlpClientSettings` object.
   For instructions, see [Create OlpClientSettings](#create-olpclientsettings).

3.  Create an [[StreamLayerClient]] instance with StreamLayerClientParams that contains the catalog HRN, the layer ID, the OLP client settings from step 2.

   ```typescript
   const streamLayerClient = new StreamLayerClient(
      {
         catalogHrn: "CatalogHRN",
         layerId: "LayerId",
         settings: olpClientSettings
      }
   );
   ```

## <a name="subscribe-streamlayerclient"></a>Subscribe to the Stream Layer

To subscribe to the stream layer:

1. Create the `StreamLayerClient` object.
   For instructions, see [Create StreamLayerClient](#create-streamlayerclient).

2. Create the `SubscribeRequest` object with the type of subscription.

   ```typescript
   const subscribeRequest = new SubscribeRequest().withMode("serial");
   ```
   
   > Note: If you want to create one more subscription for the same stream, you can use "parallel" mode.

   ```typescript
   const subscribeRequest = new SubscribeRequest().withMode("parallel").withSubscriptionId("some-another-your-subscription-id");
   ```

3. Call the `Subscribe` method with the `SubscribeRequest` parameter.

   ```typescript
   const subscribtionId = await streamLayerClient.subscribe(subscribeRequest);
   ```

You receive a subscription ID from the requested subscription to the selected layer.
Then you can call the Poll method.

## <a name="get-data-streamlayerclient"></a>Get Data from a Stream Layer

To get data from a stream layer:

1. Create the `streamLayerClient` object.
   For instructions, see [Create StreamLayerClient](#create-streamlayerclient).

2. Subscribe to the stream layer, see [Subscribe to the Stream Layer](#subscribe-streamlayerclient)

3. Call method Poll with the ID of subscription:

  ```typescript
        const messages = await streamLayerClient.poll(new PollRequest().withMode("serial").withSubscriptionId(subscribtionId));
  ```
You will get the messages of the data. Each message will contains metadata and data of partition:

```json
{
  "messages": [
    {
      "metaData": {
        "partition": "314010583",
        "checksum": "ff7494d6f17da702862e550c907c0a91",
        "compressedDataSize": 152417,
        "dataSize": 250110,
        "data": "iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAABGdBTUEAALGPC/xhBQAAABhQTFRFvb29AACEAP8AhIKEPb5x2m9E5413aFQirhRuvAMqCw+6kE2BVsa8miQaYSKyshxFvhqdzKx8UsPYk9gDEcY1ghZXcPbENtax8g5T+3zHYufF1Lf9HdIZBfNEiKAAAAAElFTkSuQmCC",
        "dataHandle": "",
        "timestamp": 1517916706
      },
      "offset": {
        "partition": 7,
        "offset": 38562
      }
    }
  ]
}
  ```

  If the data size is less than 1 MB, the data field will be populated. If the data size is greater than 1 MB, a data handle will be returned pointing to the object stored in the Blob store and you can fetch that data using getData method:

  ```typescript
  const data = await streamLayerClient.getData({
        "partition": "1314010583",
        "checksum": "ff7494d6f17da702862e550c907c0a91",
        "compressedDataSize": 1152417,
        "dataSize": 1250110,
        "data": "",
        "dataHandle": "some-datahandle",
        "timestamp": 1517916706
      });
  ```

## <a name="seek-streamlayerclient"></a>Seek to predefined offset.
Enables you to start reading data from a specified offset. You can move the message pointer to any offset in the layer (topic). Message consumption will start from that offset. Once you seek to an offset, there is no returning to the initial offset, unless the initial offset is saved.

```typescript
await streamLayerClient.seek(
  new SeekRequest()
    .withMode("serial")
    .withSubscriptionId(subscribtionId)
    .withSeekOffsets({offsets: [{partition: 7, offset: 38562}]}
  )
);
  ```

## <a name="unsubscribe-streamlayerclient"></a>Delete subscription to a layer.
Deletes a subscription to a layer (topic). This operation removes the subscription from the service.

```typescript
await streamLayerClient.unsubscribe(
  new UnsubscribeRequest()
    .withMode("serial")
    .withSubscriptionId(subscribtionId)
  )
);
  ```
