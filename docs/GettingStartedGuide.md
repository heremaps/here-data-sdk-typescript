# Getting Started Guide

The Open Location Platform (OLP) SDK for TypeScript includes the core components to access the OLP APIs from any web-based application.

In this guide, learn how to authenticate to and start working with the HERE OLP using the OLP SDK for TypeScript:

- [OLP Prerequisite Knowledge](#prerequisite)
- [Get Credentials](#credentials)
- [Available Components](#components)
- [Examples](#examples)

## <a name="prerequisite"></a>Prerequisites

To start using the HERE Open Location Platform (OLP) SDK for TypeScript, you need an OLP user account.

To work with the HERE OLP SDK for TypeScript, you also need to understand the following concepts related to OLP:

- [Catalogs](https://developer.here.com/olp/documentation/data-user-guide/portal/layers/catalogs.html)
- [Layers](https://developer.here.com/olp/documentation/data-user-guide/portal/layers/layers.html)
- [Partitions](https://developer.here.com/olp/documentation/data-user-guide/portal/layers/partitions.html)
- [HERE Resource Names (HRNs)](https://developer.here.com/olp/documentation/data-user-guide/shared_content/topics/olp/concepts/hrn.html)

For more details, see the [HERE OLP Data User Guide](https://developer.here.com/olp/documentation/data-user-guide/index.html).

## <a name="credentials"></a> Get Credentials

To work with catalog or service requests to the HERE Open Location Platform (OLP), you need to get authentication and authorization credentials.

You can authenticate to OLP within your application with the platform credentials available on the OLP portal by means of the HERE OLP SDK for TypeScript authentication library. For instructions on how to get credentials, see [the related section](https://developer.here.com/olp/documentation/access-control/user-guide/topics/get-credentials.html) in the Terms and Permissions User Guide.

After you set up the credentials, you can use them to access the HERE OLP SDK libraries.

## <a name="components"></a> Available Components

The OLP SDK for TypeScript package contains four independent modules that focus on a specific set of responsibilities:

- `olp-sdk-authentication` &ndash; gets OAuth2 bearer tokens used to confirm OLP requests.
- `olp-sdk-dataservice-read` &ndash; gets layer and partition data from OLP catalogs.
- `olp-sdk-dataservice-api` &ndash; retrieves data from OLP.
- `olp-sdk-fetch` &ndash; adds a subset of the fetch API for Node.js.

## Reference Documentation

The API reference documentation for the HERE OLP SDK for Typescript is available on our [GitHub Pages](https://heremaps.github.io/here-olp-sdk-typescript/).

## <a name="examples"></a> Examples

To better understand the OLP SDK for TypeScript, see the examples of how to:

- [Read from a versioned layer](./examples/nodejs-read-versioned-layer.md) &ndash; shows how to retrieve layer metadata, partition metadata, and partition data from a versioned layer using the OLP SDK for TypeScript.
- [Read from a volatile layer](./examples/nodejs-read-volatile-layer.md) &ndash; shows how to retrieve layer metadata, partition metadata, and partition data from a volatile layer using the OLP SDK for TypeScript.
