# Work with an object store layer

This example shows how to read data from and write it to an object store layer on Node.js using HERE Data SDK for TypeScript.

## Build and run an app on Node.js

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
   npm install --save @here/olp-sdk-authentication @here/olp-sdk-dataservice-api
   ```

   Now, everything is set to create the app.

5. Create the `index.ts` file and app skeleton.

   ```typescript
   /**
    * An example of the Node.js app used for reading data from and writing it to an object store layer in the datastore.
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

## Use `ObjectStoreApi` from `@here/olp-sdk-dataservice-api`

You can use the `ObjectStoreApi` functions to request any data from an [object store layer](https://developer.here.com/documentation/data-user-guide/user_guide/portal/layers/layers.html#object-store-layers).

**To use the `ObjectStoreApi` functions:**

1. Create the `OlpClientSettings` object.

   For instructions, see <a href="https://github.com/heremaps/here-data-sdk-typescript/blob/master/docs/create-platform-client-settings.md" target="_blank">Create platform client settings</a>.

2. Create a `RequestBuilder` instance with `RequestFactory` that contains the catalog HRN, the platform client settings from step 1, API name, and API version.

   ```typescript
   const requestBuilder = await RequestFactory.create(
      "blob", 
      "v2", 
      settings, 
      HRN.fromString("your-catalog-hrn")
   );
   ```

## Get data from an object store layer

You can request any data from an [object store layer](https://developer.here.com/documentation/data-user-guide/user_guide/portal/layers/layers.html#object-store-layers) using a key or datahandle.

**To get data from the object store layer:**

1. Create the `RequestBuilder` object.

   For instructions, see [Create RequestBuilder](#use-objectstoreapi-from-hereolp-sdk-dataservice-api).

2. Call the `getBlobByKey` function with the `key` and `layerId` parameters.

   ```typescript
   const result = await ObjectStoreApi.getBlobByKey(requestBuilder, {
      key: "your-data-key",
      layerId: "your-layer-id"
   });
   ```

You receive data from the requested key of the selected layer.

## Get all keys

1. Create the `RequestBuilder` object.

   For instructions, see [Create RequestBuilder](#use-objectstoreapi-from-hereolp-sdk-dataservice-api).

2. Call the `listKeys` function with the `layerId` parameter.

   ```typescript
   const result = await ObjectStoreApi.listKeys(requestBuilder, {
      layerId: "your-layer-id"
   });
   ```
You receive a list of all keys from one level of the selected layer.
The list is a virtual directory. Its structure consists of keys in
the storage where slashes (/) are used as separators.
For each key, the response indicates if it is a folder or object.
To retrieve the next level of keys in a folder,
call this function recursively with a parent in the query string.

## Publish data to the object store layer

**To publish data to the object store layer:**

1. Create the `RequestBuilder` object.

   For instructions, see [Create RequestBuilder](#use-objectstoreapi-from-hereolp-sdk-dataservice-api).

2. Call the `putBlobByKey` function with the `key`, `data`, `contentLength`, and `layerId` parameters.

   ```typescript
   const result = await ObjectStoreApi.putBlobByKey(requestBuilder, {
      layerId: "your-layer-id",
      key: "your-data-key",
      contentLength: data.length,
      body: data
   });
   ```
You receive a response from the datastore with the status of the operation.

## Delete data from the object store layer

**To delete data from the object store layer:**

1. Create the `RequestBuilder` object.

   For instructions, see [Create RequestBuilder](#use-objectstoreapi-from-hereolp-sdk-dataservice-api).

2. Call the `deleteBlobByKey` function with the `key` and `layerId` parameters.

   ```typescript
   const result = await ObjectStoreApi.deleteBlobByKey(requestBuilder, {
      layerId: "your-layer-id",
      key: "your-data-key"
   });
   ```
You receive a response from the datastore with the status of the operation.

For more information, see the [Data User Guide](https://developer.here.com/documentation/data-user-guide/user_guide/portal/layers/layers.html) and [Data API](https://developer.here.com/documentation/data-api/api-reference-blob-v2.html)
