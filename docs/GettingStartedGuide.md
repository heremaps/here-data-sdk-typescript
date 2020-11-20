# Getting Started Guide

HERE Data SDK for TypeScript includes the core components to access the HERE APIs from any web-based application.

In this guide, learn how to authenticate to and start working with the HERE platform using the Data SDK:

- [Prerequisite knowledge](#prerequisite)
- [Concepts](#concepts)
- [Get credentials](#credentials)
- [Available components](#components)
- [Examples](#examples)

## <a name="prerequisite"></a>Prerequisites

To start using Data SDK for TypeScript, you need a platform user account.

Working with the Data SDK requires knowledge of the following subjects:

- Basic understanding of the core [HERE platform concepts](#concepts).
- Basic proficiency with TypeScript.

## Concepts

To use Data SDK for TypeScript, you need to understand the following concepts related to the HERE platform:

* [Catalogs](https://developer.here.com/olp/documentation/data-user-guide/portal/layers/catalogs.html)
* [Layers](https://developer.here.com/olp/documentation/data-user-guide/portal/layers/layers.html)
* [Partitions](https://developer.here.com/olp/documentation/data-user-guide/portal/layers/partitions.html)
* [HERE Resource Names (HRNs)](https://developer.here.com/olp/documentation/data-user-guide/shared_content/topics/olp/concepts/hrn.html)

For more details, see the [Data User Guide](https://developer.here.com/olp/documentation/data-user-guide/index.html).

## <a name="credentials"></a> Get credentials

To work with catalog or service requests to the HERE platform, you need to get authentication and authorization credentials.

You can authenticate to the HERE platform within your application with the platform credentials available on the HERE portal by means of the Data SDK authentication library. For the available authentication options, see the [Identity & Access Management Developer Guide](https://developer.here.com/documentation/identity-access-management/dev_guide/index.html).

After you set up the credentials, you can use them to access the Data SDK libraries.

## <a name="components"></a> Available components

The Data SDK package contains іумукфд independent modules that focus on a specific set of responsibilities:

- `olp-sdk-authentication` – gets OAuth2 bearer tokens used to confirm platform requests.
- `olp-sdk-core` – contains code that is common for `@here/olp-sdk-dataservice-read`, `@here/olp-sdk-dataservice-api`, and `@here/olp-sdk-authentication`.
- `olp-sdk-dataservice-read` – gets layer and partition data from platform catalogs.
- `olp-sdk-dataservice-write` – writes data to layers.
- `olp-sdk-dataservice-api` – retrieves data from the HERE platform.
- `olp-sdk-fetch` – adds a subset of the fetch API for Node.js.

## Reference documentation

The API reference documentation for the Data SDK is available on our <a href="https://heremaps.github.io/here-data-sdk-typescript/", tarhet="_blank">GitHub Pages</a>.

## <a name="examples"></a> Examples

To better understand HERE Data SDK for TypeScript, see the examples of how to:

- <a href="https://github.com/heremaps/here-data-sdk-typescript/tree/master/docs/examples/partitions-downloader" target="_blank">Download data</a>
- <a href="https://github.com/heremaps/here-data-sdk-typescript/tree/master/docs/examples/here-data-sdk-example" target="_blank">Use the React app and Here Data SDK for Typescript in browser</a>
- <a href="https://github.com/heremaps/here-data-sdk-typescript/blob/master/docs/examples/nodejs-read-versioned-layer.md" target="_blank">Get data from a versioned layer</a>
- <a href="https://github.com/heremaps/here-data-sdk-typescript/blob/master/docs/examples/nodejs-read-volatile-layer.md" target="_blank">Get data from a volatile layer</a>
- <a href="https://github.com/heremaps/here-data-sdk-typescript/blob/master/docs/examples/nodejs-read-index-layer.md" target="_blank">Get data from an index layer</a>
- <a href="https://github.com/heremaps/here-data-sdk-typescript/blob/master/docs/examples/nodejs-read-stream-layer.md" target="_blank">Get data from a stream layer</a>
