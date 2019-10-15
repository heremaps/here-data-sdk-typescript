# Tile Provider

# Overview

This repository contains the complete source code for the OLP EDGE SDK TS Tile Provider `@here/olp-sdk-tile-provider` project. `olp-sdk-tile-provider` is a TypeScript library to work with tile data from the OLP catalogs.

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

If you want to have a compiled project, you can use bundle commands. After running each of the following commands in the `dist/@here/olp-sdk-tile-provider/bundle` folder from the root folder, you get the js bundled files.

To get bundled files with a source map, run:

```sh
npm run bundle
```

To get minified version for production, run:

```sh
npm run bundle:prod
```

To get bundled and minified js files, run:

```sh
npm run prepublish-bundle
```

## License

Copyright (C) 2018-2019 HERE Europe B.V.

See the [LICENSE](https://main.gitlab.in.here.com/olp/edge/olp-sdk/edge-sdk-for-ts/blob/master/@here/olp-sdk-tile-provider/LICENSE) file in the root of this project for license details about using OLP SDK.

In addition, please note that the fonts are under a different set of licenses.

For other use cases not listed in the license terms, please [contact us](https://developer.here.com/contact-us).
