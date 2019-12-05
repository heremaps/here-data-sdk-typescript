# HERE OLP SDK for TypeScript

The HERE OLP SDK for TypeScript is a TypeScript client for the [HERE Open Location Platform](https://platform.here.com).

## Health Сheck

**Build & Test**

|   Master                       | Node version                    | Status                          |
| :----------------------------- | :------------------------------ |:------------------------------- |
| Build/Test/Bundling/Typedoc    | Node 12.13.0 lts                | [![Build Status](https://travis-ci.com/heremaps/here-olp-sdk-typescript.svg?branch=master)](https://travis-ci.com/heremaps/here-olp-sdk-typescript)   |

## Why Use

The Open Location Platform (OLP) SDK for TypeScript provides support for the core HERE OLP use cases. The SDK is intended to save your time and effort on using OLP REST APIs. It provides a set of stable APIs that simplify complex OLP operations and keeps up to date with the latest OLP REST API changes.

The OLP SDK for TypeScrypt is a modern, lightweight, and modular SDK with minimal dependencies targeted towards a wide range of hardware platforms from embedded devices to desktops.

This SDK lets you:

* Authenticate to HERE OLP using client credentials
* Read catalog and partition metadata
* Retrieve data from versioned and volatile layers of OLP catalogs

Additionally, the SDK includes classes for work with geospatial tiling schemes that are used by most OLP catalog layers.

## About This Repository

The OLP SDK for TypeScript repository is a monorepo that contains the core components of the OLP SDK organized in the NPM workspace.

All components can be used stand-alone and are in the **@here** subdirectory.

## Installation

You can install the SDK modules using npm:

```sh
npm install @here/olp-sdk-authentication
npm install @here/olp-sdk-dataservice-read
npm install @here/olp-sdk-dataservice-api
```

You can also use the compiled bundles from CDN:

```
https://unpkg.com/@here/olp-sdk-authentication/bundle.umd.min.js
https://unpkg.com/@here/olp-sdk-dataservice-api/bundle.umd.min.js
https://unpkg.com/@here/olp-sdk-dataservice-read/bundle.umd.min.js
https://unpkg.com/@here/olp-sdk-fetch/bundle.umd.min.js
```

To learn how to use the HERE OLP SDK for TypeScript, see the [Getting Started Guide](docs/GettingStartedGuide.md).

## Development

### Dependencies

* npm 6.0.0+ (for installation instructions, see [npm](https://www.npmjs.com/))
* Node.js 10+ (for installation instructions, see [Node.js](http://nodejs.org))
* Lerna.js 3+ (for installation instructions, see [Lerna.js](http://lerna.js.org))
* TypeDoc 0.15+ (for installation instructions, see [TypeDoc](http://typedoc.org))

> Note: As an alternative to npm, you can also use Yarn 1+ (for installation instructions, see [Yarn](http://yarnpkg.com))

#### Download Dependencies

To bootstrap the packages in the current Lerna repo, install all interdependent packages, and link any cross-dependencies, run the following command:

```sh
yarn install && yarn bootstrap
```

#### Build the SDK

To build a TypeScript source code into a JavaScript code, run the following command:

```sh
npm run build
```

#### Test the SDK

To test the built results, run the following command:

```sh
npm run test
```

#### Test Coverage

To run unit tests and generate test coverage reports, run the following command:

```sh
npm run coverage
```

#### Generate Documentation with TypeDoc

To generate documentation for all modules and classes, run the following command:

```sh
npm run typedoc
```

The **dist/doc** folder is generated.

#### Use the Bundle Functionality

If you want to have a compiled project, you can use bundle commands. After running each of the following commands, you get the .js bundled files from the root folder for each package:

```sh
@here/olp-sdk-authentication/bundle.umd.min.js
@here/olp-sdk-dataservice-read/bundle.umd.min.js
@here/olp-sdk-dataservice-api/bundle.umd.min.js
@here/olp-sdk-fetch/bundle.umd.min.js
```

To get the bundled .js files with sourcemaps files for all modules, run the following command:

```sh
npm run bundle:dev
```

To get a minified version for production, run the following command:

```sh
npm run bundle:prod
```

To get the bundled and minified .js files, run the following command:

```sh
npm run bundle
```

## LICENSE

Copyright (C) 2019 HERE Europe B.V.

For license details, see the [LICENSE](https://github.com/heremaps/here-olp-sdk-typescript/blob/master/LICENSE) file in the root of this project.
