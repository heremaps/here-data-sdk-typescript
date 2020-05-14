# Here Data SDK Core Library

## Overview

This repository contains the complete source code for the HERE Data SDK Core for TypeScript `@here/olp-sdk-core` project. `olp-sdk-core` is a TypeScript library that contains the common code for `@here/olp-sdk-dataservice-read`, `@here/olp-sdk-dataservice-api` and `@here/olp-sdk-authentication`.

## Directory Layout

Here is an overview of the top-level files of the repository:

    |
    +- @here/olp-sdk-core
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

## LICENSE

Copyright (C) 2020 HERE Europe B.V.

For license details, see the [LICENSE](LICENSE).
