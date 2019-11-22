# Example of how to read the layer data on Node.js using @here/olp-edge-sdk-dataservice-read and @here/olp-edge-sdk-authentification

This example shows how to retrieve partition metadata and partition data using the OLP SDK for TypeScript.

## Build and run the app on Node.js

Requirements:

See [README.md](../../README.md#Dependencies) for dependencies

Create a simple Node.js app:

```shell
mkdir example-app && cd example-app && npm init
```

Initialize a TypeScript project:

```shell
tsc --init
```

Install node types:

```shell
npm install --save-dev @types/node
```

Install SDK modules:

```shell
npm install --save @here/olp-edge-sdk-authentification @here/olp-edge-sdk-dataservice-read @here/olp-edge-sdk-dataservice-api
```

Now, everything is set to create the app.

Create the index.ts file and app skeleton:

```typescript
/**
 * Example Node.js app for reading a volatile layer from the datastore
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

## Log in to the data store

The first thing you need is [account](https://account.here.com).
Log into your account and create a test app to get app access key id and secret access key at [platform.here.com](https://platform.here.com/admin/apps)

Now you can obtain the token for requests to the datastore by using the @here/olp-sdk-authentification.

Log into the api. Modify our app to the following state:

```typescript
/**
 * Example Node.js app for reading versioned layer from datastore
 */
import { UserAuth, requestToken } from "@here/olp-sdk-authentification";

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

Now you can initialize DataStore client for `here` environment and, for example, list catalogs.
To do so you need a `OlpClientSettings`. It contains download manager, token provider, and key-value cache.

```typescript
/**
 * Example Node.js app for reading versioned layer from datastore
 */
import { UserAuth } from "@here/olp-sdk-authentification";
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

## VolatileLayerClient

When you have context, you can get catalog clients for different catalogs and read the information.
For more information about volatile layers, see [Publish to a Volatile Layer](https://developer.here.com/olp/documentation/data-api/data_dev_guide/rest/publishing-data-volatile.html).
To create VolatileLayerClient, run:

```typescript

//  Client for "latest-data" layer from "hrn:here:data:::live-weather-na" catalog
const volatileClient = await new VolatileLayerClient(
    HRN.fromString("hrn:here:data:::hrn-example"),
    "example-layer-id",
    settings
);
```

`VolatileLayerClient` has 2 public methods:

1. getData() - to fetch partition data
2. getPartitions() - to fetch partitions metadata

Method `getData()` expects 2 arguments:

* dataRequest - `DataRequest` instanse. Class that prepare data for the requests to the BlobAPI. `getData` method can fetch partition data by 3 types of parameters you can provide to it. It could be next parameters sorted by priority: `dataHandle`, `partitionId` and `quadKey`. Below you can take a look on the example of creating `DataRequest` instanse.
* abortSignal - a signal object that allows you to communicate with a request (such as a Fetch) and abort it if required via an AbortController object. More details see [here](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal).

```typescript
import { DataRequest } from "@here/olp-sdk-dataservice-read";
// DataRequest usage example
const request = new DataRequest();
// add `dataHandle` property
request.withDataHandle("TEST24A111D82321A9BA9071A7EF042.042");
// add `PartitionId` property
request.withPartitionId("123123123");
// add `QuadKey` property
request.withQuadKey(quadKeyFromMortonCode("123123123"));

//Also data could be added by chain like so
const requestByChain = new DataRequest().withPartitionId("123123123").withQuadKey(quadKeyFromMortonCode("123123123"));
```

Now let's get data

```typescript
const request = new DataRequest().withDataHandle("TEST24A111D82321A9BA9071A7EF042.042");
const result = await volatileClient.getData(request);
```

Method `getPartitions` expects 2 arguments:

* QuadKeyPartitionsRequest `or` PartitionsRequest`.
* abortSignal - a signal object that allows you to communicate with a request (such as a Fetch) and abort it if required via an AbortController object. More details see [here](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal).

To fetch partitions metadata from Query API by `QuadKey` use `QuadKeyPartitionsRequest`. It expects quadKey, depth (from 0 to 4) and version (optional).

```typescript
import { QuadKeyPartitionsRequest } from "@here/olp-sdk-dataservice-read";
// QuadKeyPartitionsRequest usage example
const request = new QuadKeyPartitionsRequest()
                    .withQuadKey(quadKeyFromMortonCode("123123123"))
                    .withDepth(3); // default value is 0
const result = await volatileClient.getPartitions(request);
```

To fetch partitions metadata from MetadataAPI use `PartitionsRequest`. It expects version parameter (optional). If you skip version and pass empty PartitionsRequest instanse, than the last layer verion will be used.

```typescript
import { PartitionsRequest } from "@here/olp-sdk-dataservice-read";
// PartitionsRequest usage example
const request = new PartitionsRequest();
const result = await volatileClient.getPartitions(request);
```
