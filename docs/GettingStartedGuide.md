# Getting Started Guide

The HERE Data SDK for TypeScript includes the core components to access the HERE APIs from any web-based application.

In this guide, learn how to authenticate to and start working with the HERE platform using the DATA SDK for TypeScript:

- [Prerequisite Knowledge](#prerequisite)
- [Get Credentials](#credentials)
- [Available Components](#components)
- [Examples](#examples)

## <a name="prerequisite"></a>Prerequisites

To start using the HERE Data SDK for TypeScript, you need a platform user account.

To work with the HERE Data SDK for TypeScript, you also need to understand the following concepts related to the HERE platform:

- [Catalogs](https://developer.here.com/olp/documentation/data-user-guide/portal/layers/catalogs.html)
- [Layers](https://developer.here.com/olp/documentation/data-user-guide/portal/layers/layers.html)
- [Partitions](https://developer.here.com/olp/documentation/data-user-guide/portal/layers/partitions.html)
- [HERE Resource Names (HRNs)](https://developer.here.com/olp/documentation/data-user-guide/shared_content/topics/olp/concepts/hrn.html)

For more details, see the [HERE Data User Guide](https://developer.here.com/olp/documentation/data-user-guide/index.html).

## <a name="credentials"></a> Get Credentials

To work with catalog or service requests to the HERE platform, you need to get authentication and authorization credentials.

You can authenticate to the HERE platform within your application with the platform credentials available on the HERE portal by means of the Data SDK for TypeScript authentication library. For instructions on how to get credentials, see the [related section](https://developer.here.com/olp/documentation/access-control/user-guide/topics/get-credentials.html) in the Terms and Permissions User Guide.

After you set up the credentials, you can use them to access the HERE Data SDK libraries.

## <a name="components"></a> Available Components

The Data SDK for TypeScript package contains two independent modules that focus on a specific set of responsibilities:

- `olp-sdk-authentication` – gets OAuth2 bearer tokens used to confirm platform requests.
- `olp-sdk-core` – contains code that is common for `@here/olp-sdk-dataservice-read`, `@here/olp-sdk-dataservice-api`, and `@here/olp-sdk-authentication`.
- `olp-sdk-dataservice-read` – gets layer and partition data from platform catalogs.
- `olp-sdk-dataservice-write` – writes data to layers.
- `olp-sdk-dataservice-api` – retrieves data from the HERE platform.
- `olp-sdk-fetch` – adds a subset of the fetch API for Node.js.

## Reference Documentation

The API reference documentation for the HERE Data SDK for Typescript is available on our [GitHub Pages](https://heremaps.github.io/here-data-sdk-typescript/).

## <a name="examples"></a> Examples

To better understand the HERE Data SDK for TypeScript, see the examples of how to:

- [Get data from a versioned layer](https://github.com/heremaps/here-data-sdk-typescript/blob/master/docs/examples/nodejs-read-versioned-layer.md)
- [Get data from a volatile layer](https://github.com/heremaps/here-data-sdk-typescript/blob/master/docs/examples/nodejs-read-volatile-layer.md)
- [Get data from an index layer](https://github.com/heremaps/here-data-sdk-typescript/blob/master/docs/examples/nodejs-read-index-layer.md)
- [Get data from a stream layer](https://github.com/heremaps/here-data-sdk-typescript/blob/master/docs/examples/nodejs-read-stream-layer.md)
