# Getting Started Guide

HERE Data SDK for TypeScript includes the core components to access the HERE APIs from any web-based application.

In this guide, learn how to authenticate to and start working with the HERE platform using the Data SDK:

- [Prerequisites](#prerequisites)
- [Concepts](#concepts)
- [Get credentials](#get-credentials)
- [Available components](#available-components)
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
* [HERE Resource Names (HRNs)](https://developer.here.com/documentation/data-user-guide/shared_content/topics/concepts/hrn.html)

For more details, see the [Data User Guide](https://developer.here.com/documentation/data-user-guide/index.html).

## Get credentials

To work with catalog or service requests to the HERE platform, you need to get authentication and authorization credentials.

You can authenticate to the HERE platform within your application with the platform credentials available on the HERE portal by means of the Data SDK authentication library. For the available authentication options, see the [Identity & Access Management Developer Guide](https://developer.here.com/documentation/identity-access-management/dev_guide/index.html).

After you set up the credentials, you can use them to access the Data SDK libraries.

## Available components

The Data SDK package contains іумукфд independent modules that focus on a specific set of responsibilities:

- `olp-sdk-authentication` – gets OAuth2 bearer tokens used to confirm platform requests.
- `olp-sdk-core` – contains code that is common for `@here/olp-sdk-dataservice-read`, `@here/olp-sdk-dataservice-api`, and `@here/olp-sdk-authentication`.
- `olp-sdk-dataservice-read` – gets layer and partition data from platform catalogs.
- `olp-sdk-dataservice-write` – writes data to layers.
- `olp-sdk-dataservice-api` – retrieves data from the HERE platform.
- `olp-sdk-fetch` – adds a subset of the fetch API for Node.js.

## Reference documentation

The API reference documentation for the Data SDK is available on our <a href="https://heremaps.github.io/here-data-sdk-typescript/" target="_blank">GitHub Pages</a>.

## Examples

To better understand HERE Data SDK for TypeScript, see the [Examples section](../examples/README.md).
