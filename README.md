# HERE Data SDK for TypeScript

HERE Data SDK for TypeScript is a TypeScript client for the <a href="https://platform.here.com" target="_blank">HERE platform</a>.

## Health check

### Build and test

| Master                      | Node version       | Status                                                                                                                                                                                         |
| :-------------------------- | :----------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build/Test/Bundling/Typedoc | Node 16.13.2 (LTS) | <a href="https://app.travis-ci.com/heremaps/here-data-sdk-typescript" target="_blank"><img src="https://app.travis-ci.com/heremaps/here-data-sdk-typescript.svg?branch=master" alt="Build Status"></a> |

### Test coverage

| Platform | Status                                                                                                                                                                                                              |
| :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Linux    | <a href="https://codecov.io/gh/heremaps/here-data-sdk-typescript/" target="_blank"><img src="https://codecov.io/gh/heremaps/here-data-sdk-typescript/branch/master/graph/badge.svg" alt="Linux code coverage"/></a> |

## Why use

HERE Data SDK for TypeScript provides support for the core HERE platform use cases. The Data SDK is intended to save your time and effort on using HERE REST APIs. It provides a set of stable APIs that simplify complex platform operations and keeps up to date with the latest HERE REST API changes.

Data SDK for TypeScrypt is a modern, lightweight, and modular SDK with minimal dependencies targeted towards a wide range of hardware platforms from embedded devices to desktops.

This SDK lets you:

- Authenticate to the HERE platform using client credentials.
- Read catalog and partition metadata.
- Retrieve data from layers.
- Publish data to layers
- Delete data from an object store layer

Additionally, the Data SDK includes classes for work with geospatial tiling schemes that are used by most platform catalog layers.

## Backward compatibility

We try to develop and maintain our API in a way that preserves its compatibility with the existing applications. Changes in Data SDK for TypeScript are greatly influenced by the Data API development. Data API introduces breaking changes 6 months in advance. Therefore, you may need to migrate to a new version of Data SDK for TypeScript every half a year.

For more information on Data API, see its <a href="https://developer.here.com/documentation/data-api/data_dev_guide/index.html" target="_blank">Developer Guide</a> and <a href="https://developer.here.com/documentation/data-api/api-reference.html" target="_blank">API Reference</a>.

When new API is introduced in Data SDK for TypeScript, the old one is not deleted straight away. The standard API deprecation time is 6 months. It gives you time to switch to new code. However, we do not provide ABI backward compatibility.

All of the deprecated methods, functions, and parameters are documented in the Data SDK for TypeScript <a href="https://developer.here.com/documentation/sdk-typescript/api_reference/index.html"  target="_blank">API Reference</a> and <a href="https://github.com/heremaps/here-data-sdk-typescript/blob/master/CHANGELOG.md" target="_blank">changelog</a>.

For more information on Data SDK for TypeScrypt, see our <a href="https://developer.here.com/documentation/sdk-typescript/dev_guide/index.html" target="blank">Developer Guide</a>.

## About this repository

The Data SDK repository is a monorepo that contains the core components of the platform SDK organized in the NPM workspace.

All components can be used stand-alone and are in the <a href="https://github.com/heremaps/here-data-sdk-typescript/tree/master/%40here" target="_blank">@here</a> subdirectory.

## Installation

You can install the Data SDK modules using npm or add compiled bundles to an HTML page.

To install the Data SDK modules using npm, run the following commands:

```sh
npm install @here/olp-sdk-authentication
npm install @here/olp-sdk-core
npm install @here/olp-sdk-dataservice-read
npm install @here/olp-sdk-dataservice-write
npm install @here/olp-sdk-dataservice-api
```

To use the Data SDK with pure JavaScript, inject the compiled bundles from the CDN repository in your HTML application.

```
<script src="https://unpkg.com/@here/olp-sdk-fetch/bundle.umd.min.js"></script> 
<script src="https://unpkg.com/@here/olp-sdk-core/bundle.umd.min.js"></script> 
<script src="https://unpkg.com/@here/olp-sdk-authentication/bundle.umd.min.js"></script> 
<script src="https://unpkg.com/@here/olp-sdk-dataservice-api/bundle.umd.min.js"></script> 
<script src="https://unpkg.com/@here/olp-sdk-dataservice-read/bundle.umd.min.js"></script> 
<script src="https://unpkg.com/@here/olp-sdk-dataservice-write/bundle.umd.min.js"></script> 
```

To learn how to use the Data SDK, see the <a href="https://github.com/heremaps/here-data-sdk-typescript/blob/master/docs/GettingStartedGuide.md" target="_blank">Getting Started Guide</a>, <a href="https://developer.here.com/documentation/sdk-typescript/dev_guide/index.html" target="blank">Developer Guide</a>, and <a href="https://developer.here.com/documentation/sdk-typescript/api_reference/index.html"  target="_blank">API Reference</a>.

## Development

### Dependencies

Data SDK for TypeScript has the following dependencies:

- npm 6.0.0+ (for installation instructions, see <a href="https://www.npmjs.com/" target="_blank">npm</a>)
- Node.js 10+ (for installation instructions, see <a href="http://nodejs.org" target="_blank">Node.js</a>)
- Lerna.js 3+ (for installation instructions, see <a href="http://lerna.js.org" target="_blank">Lerna.js</a>)
- TypeDoc 0.15+ (for installation instructions, see <a href="http://typedoc.org" target="_blank">TypeDoc</a>)

> **Note:** As an alternative to npm, you can also use Yarn 1+ (for installation instructions, see <a href="http://yarnpkg.com" target="_blank">Yarn</a>).

#### Download dependencies

To bootstrap the packages in the current Lerna repository, install all interdependent packages, and link any cross-dependencies, run the following command:

```sh
yarn install && yarn bootstrap
```

### Build the SDK

To build the TypeScript source code into the JavaScript code, run the following command:

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

### Test coverage

To run unit tests and generate test coverage reports, run the following command:

```sh
npm run coverage
```

### Generate documentation with TypeDoc

To generate documentation for all modules and classes, run the following command:

```sh
npm run typedoc
```

The **dist/doc** folder is generated with the documentation from the annotated source code.

### Use the bundle functionality

If you want to have a compiled project, you can use bundle commands. After running each of the following commands, you get the .js bundled files from the root folder for each package:

```sh
@here/olp-sdk-authentication/bundle.umd.min.js
@here/olp-sdk-core/bundle.umd.min.js
@here/olp-sdk-dataservice-read/bundle.umd.min.js
@here/olp-sdk-dataservice-write/bundle.umd.min.js
@here/olp-sdk-dataservice-api/bundle.umd.min.js
@here/olp-sdk-fetch/bundle.umd.min.js
```

To get the bundled .js files with the sourcemaps files for all modules, run the following command:

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

Copyright (C) 2019–2022 HERE Europe B.V.

For license details, see the <a href="https://github.com/heremaps/here-data-sdk-typescript/blob/master/LICENSE" target="_blank">LICENSE</a> file in the root of this project.
