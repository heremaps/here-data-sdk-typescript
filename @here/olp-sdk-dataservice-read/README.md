# DataService Access Library

## Overview

This repository contains the complete source code for the HERE Data SDK for TypeScript Dataservice Read `@here/olp-sdk-dataservice-read` project. `olp-sdk-dataservice-read` is a TypeScript library that will fetch request Layer and Partition data from the HERE platform catalogs.

## Directory Layout

Here is an overview of the top-level files of the repository:

    |
    +- @here/olp-sdk-dataservice-read
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

### Use a Bundle from CDN

Add minified JavaScript files to your `html` and create an object of userAuth and catalogClient:

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <script src="https://unpkg.com/@here/olp-sdk-fetch/bundle.umd.min.js"></script>
        <script src="https://unpkg.com/@here/olp-sdk-authentication/bundle.umd.min.js"></script>
        <script src="https://unpkg.com/@here/olp-sdk-dataservice-api/bundle.umd.min.js"></script>
        <script src="https://unpkg.com/@here/olp-sdk-dataservice-read/bundle.umd.min.js"></script>
    </head>
    <body>
        <script>
            /**
             * Authentication with olp-sdk-authentication
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
             * Create the `OlpClientSettings` object
             */
            const olpClientSettings = new OlpClientSettings({
                environment:
                "here | here-dev | here-cn | here-cn-dev | http://YourCustomEnvironment",
                getToken: () => userAuth.getToken()
            });
            /**
             * Create client to the volatile layer with VolatileLayerClientParams
             */
            const volatileLayerClient = new VolatileLayerClient({
                    catalogHrn: "CatalogHRN",
                    layerId: "LayerId",
                    settings: olpClientSettings
            });
            /**
             * Gets some data from the layer by ID
             */
            const request = new DataRequest().withPartitionId("your-partition-id");
            volatileLayerClient
                .getData(request)
                .then(response => {
                    response.blob().then(blob => {
                        // your blob here
                    });
                });
        </script>
    </body>
</html>
```

## LICENSE

Copyright (C) 2019-2023 HERE Europe B.V.

For license details, see the [LICENSE](LICENSE).
