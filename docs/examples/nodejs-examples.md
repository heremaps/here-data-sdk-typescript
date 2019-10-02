# Example how to read the catalog data on Node.js using @here/olp-sdk-dataservice-read and @here/olp-sdk-authentication

This example shows how to retrieve catalog, partition metadata or partition data by using the HERE OLP SDK for TypeScript.

## Build and running on Node.js

**Requirements:**

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
npm install --save @here/olp-sdk-authentification @here/olp-sdk-dataservice-read
```

Now everything is set to create the app.

Create `index.ts` file add app ckeleton:

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

class App {
    async run() {
        console.log("App works!");

        const userAuth = new UserAuth({
            env: "here",
            credentials: {
                accessKeyId: "your-access-key-id",
                accessKeySecret: "your-access-key-secret"
            }
        });
    }
}

const app = new App();
app.run();
```

## Context and data store client

Now you can initialize DataStore client for `here` environment and, for example, list catalogs.
To do so you need a `DatastoreContext`. It contains look up api functionallity to get the base urls to the services.

Add this to the app and play around with context and `DataStoreClient`:

```typescript
/**
 * Example Node.js app for reading versioned layer from datastore
 */
import { UserAuth } from "@here/olp-sdk-authentification";
import { DataStoreClient, HRN, CatalogClient } from "@here/olp-sdk-dataservice-read";
import { DataStoreContext } from "@here/olp-sdk-dataservice-read";

class App {
    async run() {
        console.log("App works!");

         const userAuth = new UserAuth({
            env: "here",
            credentials: {
                accessKeyId: "your-access-key-id",
                accessKeySecret: "your-access-key-secret"
            }
        });

        cconst context = new DataStoreContext({
            environment: "here",
            getToken: () => userAuth.getToken()
        });


        // gets urls to some endpoints just for fun..
        const configBaseUrl = await context.getBaseUrl("config");
        const artifactBaseUrl = await context.getBaseUrl("artifact");
        const catalogOmvConfigBaseUrl = await context.getBaseUrl("metadata", "hrn:here:data:::here-optimized-map-for-visualization-2");
        const catalogRibBaseUrl = await context.getBaseUrl("metadata", "hrn:here:data:::rib-2");
        const dataStoreClient = new DataStoreClient(context);

        // List catalogs in datastore. you also can set schema HRN and the result will be filtered by it.
        const catalogs = await dataStoreClient.getCatalogsBySchema();
    }
}

const app = new App();
app.run();
```

## Catalog Client

Therefore, when you have context, you can get catalog clients for different catalogs and read the information.

To create two catalog clients, run:


```typescript
const context = new DataStoreContext({
    environment: "here",
    getToken: () => userAuth.getToken()
});

// Client for here-optimized-map-for-visualization-2 catalog
const omvCatalogClient = new CatalogClient({context, hrn: "hrn:here:data:::here-optimized-map-for-visualization-2"})

// Get layer "omv-base-v2" from catalog (deprecaded)
const omvBaseLayer = await omvCatalogClient.getLayer("omv-base-v2");
const omvBaseLayerSummary = await omvBaseLayer.getSummary();

// Client for hrn:here:data:::rib-2 catalog
const ribCatalogClient = new CatalogClient({context, hrn: "hrn:here:data:::rib-2"})

// Get layer "address-locations" from catalog (deprecaded)
const addressesBaseLayer = await ribCatalogClient.getLayer("address-locations");

// get summary for this layer
const addressesBaseLayerSummary = await addressesBaseLayer.getSummary();

```

This way, when you have a catalog client you can read informaion about catalog configuration and layers.