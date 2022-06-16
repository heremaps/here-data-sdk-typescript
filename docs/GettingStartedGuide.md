# Getting Started Guide

HERE Data SDK for TypeScript includes the core components to access the HERE APIs from any web-based application.

In this guide, learn how to authenticate to and start working with the HERE platform using the Data SDK:

- [Getting Started Guide](#getting-started-guide)
  - [Prerequisites](#prerequisites)
  - [Concepts](#concepts)
  - [Get credentials](#get-credentials)
  - [Available components](#available-components)
  - [Reference documentation](#reference-documentation)
  - [Examples](#examples)

## Prerequisites

To start using Data SDK for TypeScript, you need a platform user account.

Working with the Data SDK requires knowledge of the following subjects:

- Basic understanding of the core [HERE platform concepts](#concepts).
- Basic proficiency with TypeScript.

## Concepts

To use Data SDK for TypeScript, you need to understand the following concepts related to the HERE platform:

* [Catalogs](https://developer.here.com/documentation/data-user-guide/portal/layers/catalogs.html)
* [Layers](https://developer.here.com/documentation/data-user-guide/portal/layers/layers.html)
* [Partitions](https://developer.here.com/documentation/data-user-guide/portal/layers/partitions.html)
* [HERE Resource Names (HRNs)](https://developer.here.com/documentation/data-user-guide/user_guide/portal/layers/hrn.html)

For more details, see the [Data User Guide](https://developer.here.com/documentation/data-user-guide/index.html).

## Get credentials

To work with catalog or service requests to the HERE platform, you need to get authentication and authorization credentials.

You can authenticate to the HERE platform within your application with the platform credentials available on the HERE portal by means of the Data SDK authentication library. For the available authentication options, see the [Identity & Access Management Developer Guide](https://developer.here.com/documentation/identity-access-management/dev_guide/index.html).

After you set up the credentials, you can use them to access the Data SDK libraries.

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

## Available components

The Data SDK package contains several independent modules that focus on a specific set of responsibilities:

- `olp-sdk-authentication` – gets OAuth2 bearer tokens used to confirm platform requests.
- `olp-sdk-core` – contains code that is common for `@here/olp-sdk-dataservice-read`, `@here/olp-sdk-dataservice-api`, and `@here/olp-sdk-authentication`.
- `olp-sdk-dataservice-read` – gets layer and partition data from platform catalogs.
- `olp-sdk-dataservice-write` – writes data to layers.
- `olp-sdk-dataservice-api` – gets data from the HERE platform.
- `olp-sdk-fetch` – adds a subset of the fetch API for Node.js.

## Reference documentation

The API reference documentation for the Data SDK is available on our <a href="https://heremaps.github.io/here-data-sdk-typescript/" target="_blank">GitHub Pages</a>.

## Examples

To better understand HERE Data SDK for TypeScript, see the [Examples section](../examples/README.md).
