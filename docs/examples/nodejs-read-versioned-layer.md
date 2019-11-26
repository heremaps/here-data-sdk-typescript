# Example how to read layer data on Node.js using @here/olp-sdk-dataservice-read and @here/olp-sdk-authentication

This example shows how to retrieve partition metadata and partition data using the OLP SDK for TypeScript.

## Build and run on Node.js

Requirements:

For information on dependencies, see [README.md](../../README.md#Dependencies)

Create the Node.js app:

```shell
mkdir example-app && cd example-app && npm init
```

Then initialize a TypeScript project:

```shell
tsc --init
```

Install node types:

```shell
npm install --save-dev @types/node
```

Install SDK modules:

```shell
npm install --save @here/olp-sdk-authentication @here/olp-sdk-dataservice-read @here/olp-sdk-dataservice-api
```

Now, everything is set to create the app.

Create the index.ts file and add app skeleton:

```typescript
/**
 * Example Node.js app for reading a versioned layer from the datastore
 */

class App {
    run() {
        console.log("App works!");
    }
}

const app = new App();
app.run();
```

Compile and run the app:

```shell
tsc && node .
```

After a successful run, the console displays the following message:

```shell
App works!
```

## Log in to the datastore

To work with the datastore, you need to have an [account](https://account.here.com).
To get an access key id and access key secret, log in to the [HERE Open Location Platform (OLP)](https://platform.here.com/admin/apps) and create a test app.

Now, you can get a token for requests to the datastore using @here/olp-sdk-authentication.

Log in to the API. Modify our app to the following state:

```typescript
/**
 * Example Node.js app for reading a versioned layer from the datastore
 */
import { UserAuth, requestToken } from "@here/olp-sdk-authentication";

const userAuth = new UserAuth({
    env: "here",
    credentials: {
        accessKeyId: "your-access-key-id",
        accessKeySecret: "your-access-key-secret"
    },
    tokenRequester: requestToken
});

```

## OlpClientSettings

Now, you can initialize the `DataStore` client for the `here` environment and, for example, list catalogs.
To do so, you need the `OlpClientSettings` object. It contains a download manager, token provider, and key-value cache.

```typescript
/**
 * Example Node.js app for reading a versioned layer from the datastore
 */
import { UserAuth } from "@here/olp-sdk-authentication";
import { OlpClientSettings } from "@here/olp-sdk-dataservice-read";

const userAuth = new UserAuth({
    env: "here",
    credentials: {
        accessKeyId: "your-access-key-id",
        accessKeySecret: "your-access-key-secret"
    },
    tokenRequester: requestToken
});

const settings = new OlpClientSettings({
    environment: "here",
    getToken: () => userAuth.getToken()
});

```

## VersionedLayerClient

When you have  the `OlpClientSettings` object, you can get catalog clients for different catalogs and read information.
For more information on versioned layers, see [the related section](https://developer.here.com/olp/documentation/get-started/dev_guide/shared_content/topics/olp/concepts/layers.html#versioned-layers) in the Get Started guide.
To create `VersionedLayerClient`, run:

```typescript
//  Client for the "example-layer-id" layer from the "hrn:here:data:::hrn-example" catalog
const versionClient = await new VersionedLayerClient(
    HRN.fromString("hrn:here:data:::hrn-example"),
    "example-layer-id",
    settings
);
```

`VersionedLayerClient` has 2 public methods:

1. getData() - fetches partition data
2. getPartitions() - fetches partitions metadata

The `getData()` method expects the following arguments:

* `dataRequest` &ndash; the `DataRequest` instanсe. This class prepares data for the requests to the BlobAPI. The `getData` method can fetch partition data by the following 3 types of parameters (sorted by priority): `dataHandle`, `partitionId` and `quadKey`. Below, see an example of how to create the `DataRequest` instanсe.
* `abortSignal` &ndash; a signal object that allows you to communicate with the request (such as the `fetch` request) and, if required, abort it  using the `AbortController` object. For more information, see [`AbortSignal` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal).

```typescript
import { DataRequest } from "@here/olp-sdk-dataservice-read";
// DataRequest usage example
const request = new DataRequest();
// Add the `dataHandle` property.
request.withDataHandle("TEST24A111D82321A9BA9071A7EF042.042");
// Add the `PartitionId` property.
request.withPartitionId("123123123");
// Add the `QuadKey` property.
request.withQuadKey(quadKeyFromMortonCode("123121122"));

// Also, you can add data in the following way:
const requestByChain = new DataRequest().withPartitionId("123123123").withQuadKey(quadKeyFromMortonCode("123121122"));
```

Now, you can get data from the layer.

```typescript
const request = new DataRequest().withDataHandle("TESTE24A111D82321A9BA9071A7EF042.042");
const result = await versionClient.getData(request);
```

The `getPartitions` method expects the following arguments:

* `QuadKeyPartitionsRequest` or `PartitionsRequest`.
* `abortSignal` &ndash; a signal object that allows you to communicate with the request (such as the `fetch` request) and, if required, abort it  using the `AbortController` object. For more information, see [`AbortSignal` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal).

To fetch partitions metadata from the `query` API by `QuadKey`, use `QuadKeyPartitionsRequest`. It expects a quadkey, depth (from 0 to 4), and layer version (optional).

```typescript
import { QuadKeyPartitionsRequest } from "@here/olp-sdk-dataservice-read";
// QuadKeyPartitionsRequest usage example
const request = new QuadKeyPartitionsRequest()
                    .withQuadKey(quadKeyFromMortonCode("75717"))
                    .withDepth(3) // default value is 0
                    .withVersion(42); // optional
const result = await versionClient.getPartitions(request);
```

To fetch partitions metadata from the `metadata` API, use `PartitionsRequest`. It expects version parameter (optional). If you skip version and pass an empty `PartitionsRequest` instanсe, than the last layer version will be returned.

```typescript
import { PartitionsRequest } from "@here/olp-sdk-dataservice-read";
// PartitionsRequest usage example
const request = new PartitionsRequest().withVersion(42);
const result = await versionClient.getPartitions(request);
```
