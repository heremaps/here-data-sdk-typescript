# HERE OLP SDK for TypeScript

The HERE OLP SDK for TypeScript is a _work-in-progress_ TypeScript client for [HERE Open Location Platform](https://platform.here.com).

## Why Use

The HERE OLP SDK for TypeScript provides support for core HERE Open Location Platform (OLP) use cases. The SDK is intended to save your time and effort on using OLP REST APIs and provides a set of stable APIs that simplify complex OLP operations and remove the burden of keeping up to date with the latest OLP REST API changes.

It's a modern, lightweight, and modular SDK with minimal dependencies for web developers.

This SDK lets you:

* Authenticate to HERE Open Location Platform (OLP) using client credentials.
* Read catalog and partitions metadata.
* Retrieve data from versioned and volatile layers of OLP catalogs.

## Getting started with SDK

## About This Repository

This repository is a monorepo, containing the core components of OLP SDK, organized in the NPM workspace.

All components can be used stand-alone and are in the @here subdirectory.

## Installation

All SDK modules are installable via NPM:

```sh
npm install @here/olp-sdk-authentication
npm install @here/olp-sdk-dataservice-read
npm install @here/olp-sdk-dataservice-api
```
Please see [GettingStartedGuide.md](docs/GettingStartedGuide.md) for an introduction to the SDK.

## Development

### Dependencies

* npm: 6.0.0+ (Installation instructions, see [npm](https://www.npmjs.com/))
* Node.js 10+ (Installation instructions, see [Node.js](http://nodejs.org))
* Lerna.js 3+ (Installation instructions, see [Lerna.js](http://lerna.js.org))
* TypeDoc 0.15+ (Installation instructions, [TypeDoc](http://typedoc.org))

Please note, alternatively to npm we also support Yarn
* Yarn 1+ (Installation instructions, see [Yarn](http://yarnpkg.com))

#### Download dependencies

To bootstrap the packages in the current Lerna repo, and install all interdependent packages and link any cross-dependencies, run:

```sh
yarn install && yarn bootstrap
```

#### Building the SDK

To build a TypeScript source code into a JavaScript code, run:

```sh
npm run build
```

#### Testing the SDK

To test out built results, run:

```sh
npm run test
```

#### Test coverage

To run unit tests and generate test coverage reports, run:

```sh
npm run coverage
```

#### Generate documentation with TypeDoc

To generate documentation for all modules and classes, run :

```sh
npm run docs
```

#### Usage of Bundle functionality

If you want to have a compiled project, you can use bundle commands. After running each of the following commands, get the js bundled files from the root folder for each package:

```sh
@here/olp-sdk-authentication/dist
@here/olp-sdk-dataservice-read/dist
@here/olp-sdk-dataservice-api/dist
@here/olp-sdk-fetch/dist
```

To get bundled js with sourcemaps files for all modules, run:

```sh
npm run bundle:dev
```

To get minified version for production, run:

```sh
npm run bundle:prod
```

To get bundled and minified js files, run:

```sh
npm run bundle
```

Or use from CDN:

https://unpkg.com/browse/@here/olp-sdk-authentication@0.9.1/dist/olp-sdk-authentication.min.js
https://unpkg.com/browse/@here/olp-sdk-dataservice-api@0.9.1/dist/olp-sdk-dataservice-api.min.js
https://unpkg.com/browse/@here/olp-sdk-dataservice-read@0.9.1/dist/olp-sdk-dataservice-read.min.js
https://unpkg.com/browse/@here/olp-sdk-fetch@0.9.1/dist/olp-sdk-fetch.min.js


## LICENSE

Copyright (C) 2019 HERE Europe B.V.

For license details, see the [LICENSE](LICENSE) file in the root of this project.
