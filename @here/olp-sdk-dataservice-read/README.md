# DataStore Access Library

# Overview

This repository contains the complete source code for the HERE OLP SDK for TypeScript Dataservice Read `@here/olp-sdk-dataservice-read` project. `olp-sdk-dataservice-read` is a TypeScript library that will fetch request Layer and Partition data from the OLP catalogs.

# Directory Layout

Here is an overview of the top-level files of the repository:

    |
    +- @here/olp-sdk-dataservice-read
                        |
                        +- lib    # Implementation of the project
                        |
                        +- test   # Test code

# Development

## Prerequisites

The following NPM packages are required to build/test the library:

    - node: >= 10.0.0
    - npm: >= 6.0.0

## Building

Open a command prompt of the working tree's root directory and type:

```sh
npm install
npm run build
```

## Testing

Open a command prompt of the working tree's root directory and type:

```sh
npm run test
```

## Usage of Bundle functionality

If you want to have a compiled project, you can use bundle commands. After running each of the following commands in the `@here/olp-sdk-dataservice-read/dist/bundle` folder from the root folder, you get the JavaScript bundled files.

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

## Simple bundle

Add minified JavaScript files to your `html` and create an object of userAuth and catalogClient:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <script src="https://unpkg.com/browse/@here/olp-sdk-fetch@0.9.1/dist/olp-sdk-fetch.min.js"></script>
    <script src="https://unpkg.com/browse/@here/olp-sdk-authentication@0.9.1/dist/olp-sdk-authentication.min.js"></script>
    <script src="https://unpkg.com/browse/@here/olp-sdk-dataservice-api@0.9.1/dist/olp-sdk-dataservice-api.min.js"></script>
    <script src="https://unpkg.com/browse/@here/olp-sdk-dataservice-read@0.9.1/dist/olp-sdk-dataservice-read.min.js"></script>
</head>
<body>
    <script>
    /**
     * Authentification with olp-sdk-authentification
     */
    const userAuth = new UserAuth({
        env: "here",
        credentials: {
            accessKeyId: "your-access-key",
            accessKeySecret: "your-access-secret"
        },
        tokenRequester: requestToken
    });

    /**
     * Create DatastoreContext with olp-sdk-dataservice-read
     */
    const context = new DataStoreContext({
        environment: "here",
        getToken: () => userAuth.getToken()
    });

    /**
     * Create client to the volatile layer with olp-sdk-dataservice-read
     */
    const volatileLayerClient = new VolatileLayerClient({
        context,
        hrn: "your-catalog-hrn",
        layerId: "your-layer-id",
    });

    /**
     * Get some partition from the layer by ID
     */
    volatileLayerClient.getPartition('some-partition-id').then(partitionResponse => {
        partitionResponse.blob().then(partitionBlob => {
            // your blob here
        });
    });
    </script>
</body>
</html>
```

## LICENSE

Copyright (C) 2019 HERE Europe B.V.

For license details, see the [LICENSE](LICENSE).