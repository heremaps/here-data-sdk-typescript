# Example how to read the layer data on Node.js using @here/olp-sdk-dataservice-read and @here/olp-sdk-authentication

This example shows how to retrieve partition metadata, and partition data using the OLP SDK for TypeScript.

## Build and running on Node.js

Requirements:

Node.js 10+
TypeScript: 3.5+

Start by creating a simple Node.js app:

```
mkdir example-app && cd example-app && npm init
```

Then initialize a TypeScript project:

```
tsc --init
```

Also, install node types:

```
npm install --save-dev @types/node
```

Then install SDK modules:

```
npm install --save @here/olp-sdk-authentication @here/olp-sdk-dataservice-read @here/olp-sdk-dataservice-api
```

Now everything is set to create the app.

Create index.ts file add app skeleton:

```typescript
/**
 * Example Node.js app for reading versioned layer from datastore
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

## Log into the data store

The first thing you need is https://account.here.com account.
Log into your account and create a test app to get app access key id and secret access key at https://platform.here.com/admin/apps

Now you can obtain the token for requests to the datastore by using the @here/olp-sdk-authentification.

Log into the api. Modify our app to the following state:

```typescript
/**
 * Example Node.js app for reading versioned layer from datastore
 */
import { UserAuth } from "@here/olp-sdk-authentification";

const userAuth = new UserAuth({
    env: "here",
    credentials: {
        accessKeyId: "your-access-key-id",
        accessKeySecret: "your-access-key-secret"
    }
});

```

## Context

Now you can initialize DataStore client for `here` environment and, for example, list catalogs.
To do so you need a `DatastoreContext`. It contains look up api functionallity to get the base urls to the services.

```typescript
/**
 * Example Node.js app for reading versioned layer from datastore
 */
import { UserAuth } from "@here/olp-sdk-authentification";
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

## VersionLayerClient

Therefore, when you have context, you can get catalog clients for different catalogs and read the information.
You can get more information about Version Layer following the [link](https://developer.here.com/olp/documentation/data-api/data_dev_guide/rest/publishing-data-versioned.html).
To create VersionLayerClient, run:


```typescript
import { UserAuth } from "@here/olp-sdk-authentification";
import { DataStoreContext, VersionLayerClient } from "@here/olp-sdk-dataservice-read";
import * as utils from "@here/olp-sdk-dataservice-read";

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

//  Client for "protobuf-example-berlin-v1" layer from "sensor-data-sensoris-versioned-example" catalog
const versionClient = await new VersionLayerClient({
    context,
    hrn: "hrn:here:data:::sensor-data-sensoris-versioned-example",
    layerId: "protobuf-example-berlin-v1",
    version: 0
});

// Get partition "23618173" by id
const partition = await versionClient.getPartition('23618173');

// Get tile using QuadKey
const tile = await versionClient.getTile({
    row: 1,
    column: 2,
    level: 3
});

// Get tile using mortonCode
const tile = await versionClient.getTile(utils.quadKeyFromMortonCode("1476147"));

// Get aggregated tile using mortonCode
const aggregatedTile = await versionClient.getAggregatedTile(utils.quadKeyFromMortonCode("1476147"));

// Get all partitions metadata for this layer
const partitions = await versionClient.getPartitionsMetadata();

// Get data coverage bitmap for this layer
const bitmap = await versionClient.getDataCoverageBitMap();

// Get data coverage sizemap for this layer
const sizeMap = await versionClient.getDataCoverageSizeMap();

// Get data coverage timemap for this layer
const timeMap = await versionClient.getDataCoverageTimeMap();

// Get index metadata for layer by QuadKey
const index = await versionClient.getIndexMetadata({
    row: 1,
    column: 2,
    level: 3
});

// Get layer summary metadata
const summary = await versionClient.getSummary();

```
