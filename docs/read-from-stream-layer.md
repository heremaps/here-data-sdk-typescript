# Read from a stream layer

This example shows how to read partition metadata and partition data from a stream layer on Node.js using HERE Data SDK for TypeScript.

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
    * Example of the Node.js app used for reading a stream layer from the datastore.
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

## Create `StreamLayerClient`

You can use the `StreamLayerClient` class to request data from the queue that streams data from a [stream layer](https://developer.here.com/documentation/data-user-guide/portal/layers/layers.html#stream-layers). Once a consumer reads the data, the data is no longer available to that consumer, but the data remains available to other consumers.

Stream layers can be configured with retention time, or time-to-live (TTL) which results in unconsumed data being removed after a specified period.

**To create the `StreamLayerClient` instance:**

1. Create the `OlpClientSettings` object.

   For instructions, see <a href="https://github.com/heremaps/here-data-sdk-typescript/blob/master/docs/create-platform-client-settings.md" target="_blank">Create platform client settings</a>.

2. Create an `StreamLayerClient` instance with `StreamLayerClientParams` that contains the catalog HRN, the layer ID, the platform client settings from step 1.

  ```typescript
  const streamLayerClient = new StreamLayerClient({
    catalogHrn: HRN.fromString("your-catalog-hrn"),
    layerId: "your-layer-id",
    settings: olpClientSettings,
  });
  ```

## Subscribe to a stream layer

**To subscribe to the stream layer:**

1. Create the `StreamLayerClient` object.

   For instructions, see [Create StreamLayerClient](#create-streamlayerclient).

2. Create the `SubscribeRequest` object with the `serial` or `parallel` subscription type.

   - If your app should read smaller volumes of data using a single subscription, use the `serial` subscription type.

     ```typescript
     const subscribeRequest = new SubscribeRequest().withMode("serial");
     ```

   - If your app should read large volumes of data in a parallel manner, use the `parallel` subscription type and subscription ID.

     ```typescript
     const subscribeRequest = new SubscribeRequest()
       .withMode("parallel")
       .withSubscriptionId("your-subscription-id");
     ```

3. Call the `subscribe` method with the `subscribeRequest` parameter.

   ```typescript
   const subscribtionId = await streamLayerClient.subscribe(subscribeRequest);
   ```

   You receive a subscription ID from the requested subscription to the selected layer.

Now, to get data, you can call the `Poll` method.

## <a name="get-data-streamlayerclient"></a>Get data and partition metadata from a stream layer

You can read messages from a [stream layer](https://developer.here.com/documentation/data-user-guide/portal/layers/layers.html#stream-layers) if you subscribe to the layer. The messages contain data and the following partition metadata:

- Data handle
- ID
- Data size
- Compressed data size
- Checksum
- Timestamp

**To get data from the stream layer:**

1. Create the `streamLayerClient` object.

   For instructions, see [Create StreamLayerClient](#create-streamlayerclient).

2. Subscribe to the stream layer. See [Subscribe to the stream layer](#subscribe-to-the-stream-layer)

3. Call the `poll` method with the subscription ID.

   ```typescript
   const messages = await streamLayerClient.poll(
     new PollRequest().withMode("serial").withSubscriptionId(subscribtionId)
   );
   ```

   You get messages with the layer data and partition metadata. The `poll` method also commits the offsets, so you can continue polling new messages.

   Example:

   ```typescript
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

   If the data size is less than 1 MB, the data field is populated. If the data size is greater than 1 MB, you get a data handle that points to the object stored in the blob store.

4. If the data size is greater than 1 MB, call the `getData` method with the `Messages` object.

   ```typescript
   const data = await streamLayerClient.getData({
     metaData: {
       partition: "314010583",
       checksum: "ff7494d6f17da702862e550c907c0a91",
       compressedDataSize: 152417,
       dataSize: 250110,
       data: "",
       dataHandle:
          "iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAABGdBTUEAALGPC/xhBQAAABhQTFRFvb29AACEAP8AhIKEPb5x2m9E5413aFQirhRuvAMqCw+6kE2BVsa8miQaYSKyshxFvhqdzKx8UsPYk9gDEcY1ghZXcPbENtax8g5T+3zHYufF1Lf9HdIZBfNEiKAAAAAElFTkSuQmCC",
       timestamp: 1517916706,
     },
     offset: {
       partition: 7,
       offset: 38562,
     },
   });
   ```

You get data from the requested partition.
 
## <a name="seek-streamlayerclient"></a>Seek to a predefined offset

You can start reading data from a specified offset. To start message consumption from a layer (topic) offset, move the message pointer to it. Once you seek to an offset, you cannot return to the initial offset, unless the initial offset is saved.

```typescript
await streamLayerClient.seek(
  new SeekRequest()
    .withMode("serial")
    .withSubscriptionId(subscribtionId)
    .withSeekOffsets({ offsets: [{ partition: 7, offset: 38562 }] })
);
```

## <a name="unsubscribe-streamlayerclient"></a>Delete a subscription to a layer

You can delete a subscription to a layer (topic). This operation removes the subscription from the service.

```typescript
await streamLayerClient.unsubscribe(
  new UnsubscribeRequest()
    .withMode("serial")
    .withSubscriptionId(subscribtionId)
  )
);
```
