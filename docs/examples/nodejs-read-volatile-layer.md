# Example of how to read the layer data on Node.js using @here/olp-edge-sdk-dataservice-read and @here/olp-edge-sdk-authentification

This example shows how to retrieve partition metadata and partition data using the OLP SDK for TypeScript.

## Build and run the app on Node.js

Requirements:

See [README.md](../../README.md#Dependencies) for dependencies

Create a simple Node.js app:

```
mkdir example-app && cd example-app && npm init
```

Initialize a TypeScript project:

```
tsc --init
```

Install node types:

```
npm install --save-dev @types/node
```

Install SDK modules:

```
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

```
tsc && node .
```

After a successful run, the console displays the following message:

```
App works!
```

## Log in to the data store

The first thing you need is https://account.here.com account.
Log in to your account and create a test app to get the app access key id and the secret access key at https://platform.here.com/admin/apps

Now, you can obtain the token for requests to the datastore by using @here/olp-edge-sdk-authentification.

Log in to the API. Modify our app to the following state:

```typescript
/**
 * Example Node.js app for reading a volatile layer from the datastore
 */
import { UserAuth } from "@here/olp-edge-sdk-authentification";

const userAuth = new UserAuth({
    env: "here",
    credentials: {
        accessKeyId: "your-access-key-id",
        accessKeySecret: "your-access-key-secret"
    }
});

```

## Context

Now, you can initialize the DataStore client for `here` environment and, for example, list catalogs.
To do so, you need `DatastoreContext`. It contains the Lookup API functionality to provide the base URLs for the services.

```typescript
/**
 * Example Node.js app for reading a volatile layer from the datastore
 */
import { UserAuth } from "@here/olp-edge-sdk-authentification";
import { DataStoreContext } from "@here/olp-sdk-dataservice-read";

const userAuth = new UserAuth({
    env: "here",
    credentials: {
        accessKeyId: "your-access-key-id",
        accessKeySecret: "your-access-key-secret"
    }
});

const context = new DataStoreContext({
    environment: "here",
    getToken: () => userAuth.getToken()
});

```

## VolatileLayerClient

When you have context, you can get catalog clients for different catalogs and read the information.
For more information about volatile layers, see [Publish to a Volatile Layer] (https://developer.here.com/olp/documentation/data-api/data_dev_guide/rest/publishing-data-volatile.html).
To create VolatileLayerClient, run:


```typescript

//  Client for "latest-data" layer from "hrn:here:data:::live-weather-na" catalog
const volatileClient = await new VolatileLayerClient({
    context,
    hrn: "hrn:here:data:::live-weather-na",
    layerId: "latest-data",
});

// Get partition "75717" by id
const partition = await volatileClient.getPartition('75717');

// Get tile using QuadKey
const tile = await volatileClient.getTile({
    row: 1,
    column: 2,
    level: 3
});

// Get tile using mortonCode
const tile = await volatileClient.getTile(utils.quadKeyFromMortonCode("75717"));

// Get aggregated tile using mortonCode
const aggregatedTile = await volatileClient.getAggregatedTile(utils.quadKeyFromMortonCode("75717"));

// Get all partitions metadata for this layer
const partitions = await volatileClient.getPartitionsMetadata();

// Get index metadata for the layer using QuadKey
const index = await volatileClient.getIndexMetadata({
    row: 1,
    column: 2,
    level: 3
});

```
