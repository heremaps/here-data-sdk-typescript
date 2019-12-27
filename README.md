# HERE OLP SDK for TypeScript

The HERE OLP SDK for TypeScript is a TypeScript client for the <a href="https://platform.here.com" target="_blank">HERE Open Location Platform</a>.

## Health Сheck

### Build and Test

| Master                      | Node version       | Status                                                                                                                                                                                       |
| :-------------------------- | :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build/Test/Bundling/Typedoc | Node 12.13.0 (LTS) | <a href="https://travis-ci.com/heremaps/here-olp-sdk-typescript" target="_blank"><img src="https://travis-ci.com/heremaps/here-olp-sdk-typescript.svg?branch=master" alt="Build Status"></a> |

### Test Coverage

<a href="https://codecov.io/gh/heremaps/here-olp-sdk-typescript/" target="_blank"><img src="https://codecov.io/gh/heremaps/here-olp-sdk-typescript/branch/master/graph/badge.svg" alt="Linux code coverage"/></a>


## Why Use

The Open Location Platform (OLP) SDK for TypeScript provides support for the core HERE OLP use cases. The SDK is intended to save your time and effort on using OLP REST APIs. It provides a set of stable APIs that simplify complex OLP operations and keeps up to date with the latest OLP REST API changes.

The OLP SDK for TypeScrypt is a modern, lightweight, and modular SDK with minimal dependencies targeted towards a wide range of hardware platforms from embedded devices to desktops.

This SDK lets you:

- Authenticate to HERE OLP using client credentials
- Read catalog and partition metadata
- Retrieve data from versioned and volatile layers of OLP catalogs

Additionally, the SDK includes classes for work with geospatial tiling schemes that are used by most OLP catalog layers.

## About This Repository

The OLP SDK for TypeScript repository is a monorepo that contains the core components of the OLP SDK organized in the NPM workspace.

All components can be used stand-alone and are in the <a href="https://github.com/heremaps/here-olp-sdk-typescript/tree/master/%40here" target="_blank">@here</a> subdirectory.

## Installation

You can install the SDK modules using npm or add compiled bundles to an HTML page.

To install the SDK modules using npm, run the following commands:

```sh
npm install @here/olp-sdk-authentication
npm install @here/olp-sdk-dataservice-read
npm install @here/olp-sdk-dataservice-api
```

To use the compiled bundles from the CDN, add the following files to an HTML page:

```
https://unpkg.com/@here/olp-sdk-authentication/bundle.umd.min.js
https://unpkg.com/@here/olp-sdk-dataservice-api/bundle.umd.min.js
https://unpkg.com/@here/olp-sdk-dataservice-read/bundle.umd.min.js
https://unpkg.com/@here/olp-sdk-fetch/bundle.umd.min.js
```

To learn how to use the HERE OLP SDK for TypeScript, see the <a href="https://github.com/heremaps/here-olp-sdk-typescript/blob/master/docs/GettingStartedGuide.md" target="_blank">Getting Started Guide</a>.

## Development

### Dependencies

The HERE OLP SDK for TypeScript has the following dependencies:

- npm 6.0.0+ (for installation instructions, see <a href="https://www.npmjs.com/" target="_blank">npm</a>)
- Node.js 10+ (for installation instructions, see <a href="http://nodejs.org" target="_blank">Node.js</a>)
- Lerna.js 3+ (for installation instructions, see <a href="http://lerna.js.org" target="_blank">Lerna.js</a>)
- TypeDoc 0.15+ (for installation instructions, see <a href="http://typedoc.org" target="_blank">TypeDoc</a>)

> **Note:** As an alternative to npm, you can also use Yarn 1+ (for installation instructions, see <a href="http://yarnpkg.com" target="_blank">Yarn</a>).

#### Download Dependencies

To bootstrap the packages in the current Lerna repository, install all interdependent packages, and link any cross-dependencies, run the following command:

```sh
yarn install && yarn bootstrap
```

### Build the SDK

To build TypeScript source code into JavaScript code, run the following command:

```sh
npm run build
```

### Test the SDK

You can test the build results using unit and integration tests.

To test the build results using unit tests, run the following command:

```sh
npm run test
```

To test the build results using integration tests, run the following command:

```sh
npm run integration-test
```

### Test Coverage

To run unit tests and generate test coverage reports, run the following command:

```sh
npm run coverage
```

### Generate Documentation with TypeDoc

To generate documentation for all modules and classes, run the following command:

```sh
npm run typedoc
```

The **dist/doc** folder is generated with documentation from the annotated source code.

### Use the Bundle Functionality

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

For license details, see the <a href="https://github.com/heremaps/here-olp-sdk-typescript/blob/master/LICENSE" target="_blank">LICENSE</a> file in the root of this project.
