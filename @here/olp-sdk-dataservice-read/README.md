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
    <script src="olp-sdk-authentication.0.3.0.min.js"></script>
    <script src="olp-sdk-dataservice-api.0.3.0.min.js"></script>
    <script src="olp-sdk-dataservice-read.0.3.0.min.js"></script>
</head>
<body>
    <script>
    let userauth = new UserAuth({
    credentials: {
        accessKeyId: "your-app-key",
        accessKeySecret: "your-app-secret"
    }
    });
    let token = userauth.getToken();
    const getBearerToken = () => Promise.resolve(token);
    const dataStoreClient = new DataStoreClient({
        getBearerToken: getBearerToken,
        hrn: HRN.fromString("hrn:here:data:::here-optimized-map-for-location-library-2")
    });

    </script>
</body>
</html>
```

## LICENSE

Copyright (C) 2019 HERE Europe B.V.

For license details, see the [LICENSE](LICENSE).