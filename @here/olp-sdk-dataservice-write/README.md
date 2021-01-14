# DataService Write

## Overview

This repository contains the complete source code for the HERE Data SDK for TypeScript Dataservice Write (`@here/olp-sdk-dataservice-write`) project. `olp-sdk-dataservice-write` is a TypeScript library that you can use to upload data to the HERE platform catalogs.

## Directory Layout

Here is an overview of the top-level files of the repository:

    |
    +- @here/olp-sdk-dataservice-write
                        |
                        +- lib    # Implementation of the project
                        |
                        +- test   # Test code

## Development

### Prerequisites

The following NPM packages are required to build/test the library:

    - node: >= 10.0.0
    - npm: >= 6.0.0

### Build

Open a command prompt of the working tree's root directory and type:

```sh
npm install
npm run build
```

### Test

Open a command prompt of the working tree's root directory and type:

```sh
npm run test
```

### Generate a Bundle

If you want to have a compiled project, you can use bundle commands. After running each of the following commands in the `@here/olp-sdk-dataservice-read` folder from the root folder, you get the JavaScript bundled files.

To get bundled files with a source map, run:

```sh
npm run bundle
```

To get minified version for production, run:

```sh
npm run bundle:prod
```

To get bundled and minified JavaScript files, run:

```sh
npm run prepublish-bundle
```

## Publish data

Now, we only support publishing data to a versioned layer.

You can publish data to a [versioned layer](https://developer.here.com/documentation/data-user-guide/portal/layers/layers.html#versioned-layers), if you need to store and access the history of previous data updates. To achieve consistency between layers, publish any update that affects multiple versioned layers together in one publication. You can access a new catalog version when all layers are updated, and the publication is finalized. Once you publish a version, you cannot change the data in that version and can [remove](#cancel) it only by removing the whole catalog version.

The maximum number of partitions you can upload and publish in one request is 1,000. If you have more than 1,000 partitions, upload the data and metadata for the first 1,000 partitions, and then do the same for the next set of partitions.

**To publish data to the versioned layer:**

1. Add the `@here/olp-sdk-dataservice-write` package to your dependencies.

    ```
    "@here/olp-sdk-dataservice-write": "^1.0.0"
    ```

2. Import classes from the `olp-sdk-dataservice-write` module.


    ```typescript
    import {
        VersionedLayerClient,
        StartBatchRequest,
        CompleteBatchRequest,
        UploadPartitionsRequest,
        UploadBlobRequest,
    } from "@here/olp-sdk-dataservice-write";
   ```

3. Create the `OlpClientSettings` object.

   For instructions, see [Create platform client settings](https://developer.here.com/documentation/sdk-typescript/dev_guide/topics/create-olp-client-settings.html).

4. Create the `VersionedLayerClient` object with the HERE Resource Name (HRN) of the catalog that contains the layer and the platform client settings from step 2.

   ```typescript
   const clientWrite = new VersionedLayerClientWrite({
     catalogHrn: HRN.fromString("your-catalog-hrn"),
     settings,
   });
   ```

5. Start the data publication process using the IDs of the layers to which you want to publish data.

   ```typescript
   const publication = await clientWrite.startBatch(
     new StartBatchRequest().withLayers([layerId1, layersId2])
   );
   ```

   You receive a publication ID that you can use to submit your publication or [cancel](#cancel) it.

6. Check if your data handle already exists.

   A data handle is a data identifier. It should be unique within each layer, across all versions. Your data handle can be any unique number or a hash of the content or metadata. If you use a data handle to upload data, you cannot reuse it.

   ```typescript
   const checkDataExistsRequest = new CheckDataExistsRequest().withLayerId(
     layerId
   );
   const dataExist = await clientWrite.checkDataExists(
     checkDataExistsRequest.withDataHandle("your-data-handle")
   );
   ```

7. Depending on the response to `CheckDataExistsRequest`, do the following:

   - If you receive the `200` status, the data handle already exists, and you need to generate a new data handle.

     > #### Warning
     > If you use the data handle that already exists, the data publishing process will fail.

   - If you receive the `404` status, the data handle does not exist, and you can use it to publish data to the versioned layer.

8. Depending on the number of partitions that you want to upload, do one of the following:

   - If you want to publish data of one partition, create the `PublishSinglePartitionRequest` object with the layer ID, the content type that is specified in the layer configuration, the layer binary data, the partition metadata, and the publication ID that you got when you started the data publication process.

      At a minimum, your metadata must consist of a partition ID. You can also specify the data handle that you generated. If you do not specify your unique data handle, it is generated automatically. For a complete description of the fields that you can set, see the [Publish API reference](https://developer.here.com/documentation/data-api/api-reference-publish.html).

     ```typescript
     const request = new PublishSinglePartitionRequest()
       .withLayerId(layerId)
       .withContentType(contentType)
       .withData(data)
       .withMetaData(partition)
       .withPublicationId(publication.id);
     ```

   - If you want to publish data of more than one partition, do the following:

     1. For each layer, create the `UploadBlobRequest` class with the layer ID, the data handle that you generated, the content type that is specified in the layer configuration, and the layer binary data.

        > #### Note
        > If you do not specify your unique data handle, it is generated automatically.

        ```typescript
        const uploadBlobRequest = new UploadBlobRequest()
          .withLayerId(layerId)
          .withDataHandle(dataHandle)
          .withContentType(contentType)
          .withData(data);
        ```

     2. Upload the data that you want to publish.

        > #### Note
        > If you upload more than 50 MB of data, the data is split and uploaded in parts. The size of each file is 5 MB. Therefore, the upload may take some time to finish.

        ```typescript
        const uploadBlobResult = await clientWrite.uploadBlob(uploadBlobRequest);
        ```

        If you have not specified the data handle in the previous step, `uploadBlob` automatically generates and returns the one for you. You can get the data handle using `uploadBlobResult.getDataHandle()`.

     3. To represent your data inside the HERE platform, generate partition metadata.

        At a minimum, your metadata must consist of a partition ID and the same data handle that you used to upload your data. You can get the right data handle using `uploadBlobResult.getDataHandle()`. For a complete description of the fields that you can set, see the [Publish API reference](https://developer.here.com/documentation/data-api/api-reference-publish.html).

        ```typescript
        export interface PublishPartition {
          partition: string;
          dataHandle: string;
        }
        ```

     4. Upload the partition metadata.

        ```typescript
        const partition = {
          partition: "your-partition-id",
          dataHandle: "your-data-handle",
        };
        ```

     5. (Optional) To delete partition metadata, upload it again, but do not specify data handles for the partitions that you want to delete.

     6. Create the `PartitionsRequest` object with the partition IDs that you generated, the publication ID that you got when you started the data publication process, and the layer ID.

        We recommend that you upload all your partitions in one request instead of creating a separate request for each partition.

        ```typescript
        const partitionsRequest = new UploadPartitionsRequest()
            .withPartitions({partitions: [partition]})
            .withPublicationId(publication.id)
            .withLayerId(layerId);

        await clientWrite.uploadPartitions(partitionsRequest)
        ```

9. Submit your publication using the publication ID that you got when you started the data publication process.

   ```typescript
   await clientWrite.completeBatch(
     new CompleteBatchRequest().withPublicationId(publication.id)
   );
   ```

After you submit your publication, the HERE platform processes it. Depending on the current volume of publications and the size of your publication, processing can take from a few minutes to a few hours. You can check the status of your publication using the publication ID:

```typescript
const publicationDetails = await clientWrite.getBatch(
  new GetBatchRequest().withPublicationId(publication.id)
);
```

<h6 id="cancel"></h6>

**To cancel your publication:**

- If the publication is not published, call the `cancelBatch` method with the publication ID.

  ```typescript
  await clientWrite.cancelBatch(
    new CancelBatchRequest().withPublicationId(publication.id)
  );
  ```

- If your publication is published, delete the partitions and create a new layer version.

  To delete a partition, upload partition metadata, but do not specify its data handle.


## LICENSE

Copyright (C) 2020 HERE Europe B.V.

For license details, see the [LICENSE](LICENSE).
