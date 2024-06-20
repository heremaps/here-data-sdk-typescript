# Work with an object store layer

This example shows how to read data from and write it to an object store layer on Node.js using HERE Data SDK for TypeScript.

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

## Create `RequestBuilder`

You need `RequestBuilder` to use the `ObjectStoreApi` functions from `@here/olp-sdk-dataservice-api`.
You can use the `ObjectStoreApi` functions to request any data from an [object store layer](https://www.here.com/docs/bundle/data-api-developer-guide/page/rest/getting-data-objectstore.html).

**To create the `RequestBuilder` instance:**

1. Create the `OlpClientSettings` object.

   For instructions, see <a href="https://github.com/heremaps/here-data-sdk-typescript/blob/master/docs/create-platform-client-settings.md" target="_blank">Create platform client settings</a>.

2. Create the `RequestBuilder` instance with `RequestFactory` that contains the catalog HRN, platform client settings from step 1, API name, and API version.

   ```typescript
   const requestBuilder = await RequestFactory.create(
      "blob", 
      "v2", 
      settings, 
      HRN.fromString("your-catalog-HRN")
   );
   ```

## Get data from an object store layer

You can request any data from an [object store layer](https://www.here.com/docs/bundle/data-api-developer-guide/page/rest/getting-data-objectstore.html) using its key or data handle.

**To get data from the object store layer:**

1. Create the `RequestBuilder` object.

   For instructions, see [Create RequestBuilder](#create-requestbuilder).

2. Call the `getBlobByKey` function with the key of the data that you request and layer ID.

   ```typescript
   const result = await ObjectStoreApi.getBlobByKey(requestBuilder, {
      key: "your-data-key",
      layerId: "your-layer-id"
   });
   ```

You receive data from the requested key of the selected layer.

## Get all keys from an object store layer

You can get a list of all keys from an [object store layer](https://www.here.com/docs/bundle/data-api-developer-guide/page/rest/getting-data-objectstore-listing.html).

**To get the list of keys:**

1. Create the `RequestBuilder` object.

   For instructions, see [Create RequestBuilder](#create-requestbuilder).

2. Call the `listKeys` function with the ID of the layer from which you want to get the list of keys.

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

## Publish data to an object store layer

You can publish data to an [object store layer](https://www.here.com/docs/bundle/data-api-developer-guide/page/rest/publishing-data-objectstore.html) by referencing its key. For data of up to 192 MB, use the single part upload method. If you want to upload larger amounts of data, use the multipart upload method.

When you publish new data, old data is overwritten.

### Publish data using the single part upload method

1. Create the `RequestBuilder` object.

   For instructions, see [Create RequestBuilder](#create-requestbuilder).

2. Call the `putBlobByKey` function with the layer ID and data key, data length, and content type.

   ```typescript
   const result = await ObjectStoreApi.putBlobByKey(requestBuilder, {
      layerId: "your-layer-id",
      key: "your-data-key",
      contentLength: data.length,
      body: data
   });
   ```

You receive a response from the datastore with the status of the operation.

### Publish data using the multipart upload method

1. Make sure you created the `OlpClientSettings` object.

   For instructions, see <a href="https://github.com/heremaps/here-data-sdk-typescript/blob/master/docs/create-platform-client-settings.md" target="_blank">Create platform client settings</a>.

2. Initialize the `MultiPartUploadWrapper` class with the version of the Blob API, catalog HRN, content type, data handle, and layer ID.

    ```ts
    const wrapper = new MultiPartUploadWrapper(
      {
        blobVersion: "v2",
        catalogHrn: "your-catalog-HRN",
        contentType: "your-content-type",
        handle: "your-data-key",
        layerId: "your-layer-id",
      },
      settings
    );
    ```

3. To upload the data, call the `upload` method with one of the following values:
   - For browsers: `File` | `Blob` | `ArrayBufferLike`.
   - For Node.js: string (the path of the file) | `ArrayBufferLike`.

    ```ts
    await wrapper.upload("your data");
    ```

You receive a response from the datastore with the status of the operation.

To practice uploading large amounts of data and learn how to upload it to the Blob API v1, see the <a href="https://github.com/heremaps/here-data-sdk-typescript/tree/master/examples/multipart-upload-wrapper-example" target="_blank">MultiPartUploadWrapper example</a>.

## Delete data from an object store layer

You can delete data from any [object store layer](https://www.here.com/docs/bundle/data-api-developer-guide/page/rest/deleting-data-objectstore.html) using its key.

**To delete data from the object store layer:**

1. Create the `RequestBuilder` object.

   For instructions, see [Create RequestBuilder](#create-requestbuilder).

2. Call the `deleteBlobByKey` function with the key of the data that you want to delete and layer ID.

   ```typescript
   const result = await ObjectStoreApi.deleteBlobByKey(requestBuilder, {
      layerId: "your-layer-id",
      key: "your-data-key"
   });
   ```

You receive a response from the datastore with the status of the operation.

For more information, see the [Data API Developer Guide](https://www.here.com/docs/bundle/data-api-developer-guide/page/README.html) and [Data API Blob v2 API Reference](https://www.here.com/docs/bundle/data-api-blob-v2-api-reference/page/index.html).
