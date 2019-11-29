# Getting Started Guide

The Open Location Platform (OLP) SDK for TypeScript includes the core components to access the OLP APIs from any web-based application.

In this guide, learn how to authenticate to and start working with the HERE OLP using the OLP SDK for TypeScript.

- [OLP Prerequisite Knowledge](#prerequisite)
- [Get Credentials](#credentials)
- [Available Components](#components)
- [Examples](#examples)

## <a name="prerequisite"></a> OLP Prerequisite Knowledge

To use the HERE Open Location Platform (OLP) SDK for TypeScript, you need to understand the following concepts related to OLP:

- [Catalogs](https://developer.here.com/olp/documentation/data-user-guide/portal/layers/catalogs.html)
- [Layers](https://developer.here.com/olp/documentation/data-user-guide/portal/layers/layers.html)
- [Partitions](https://developer.here.com/olp/documentation/data-user-guide/portal/layers/partitions.html)
- [HERE Resource Names (HRNs)](https://developer.here.com/olp/documentation/data-user-guide/shared_content/topics/olp/concepts/hrn.html)

For more details, see the [HERE OLP Data User Guide](https://developer.here.com/olp/documentation/data-user-guide/index.html).

## <a name="credentials"></a> Get Credentials

To create catalog or service requests to the [HERE Open Location Platform](https://platform.here.com), you need to have the OLP authentication and authorization credentials.

The following two authentication approaches are available within your application:

1. Using your **platform credentials** that are available on the platform portal by means of the HERE OLP SDK for TypeScript authentication library.

> **Note**: To obtain your **platform credentials**, create an application on the [Apps & Keys](https://platform.here.com/profile/apps-and-keys) page. When the application is created, to download the credentials, click **Create A Key**. For more information on how to get platform credentials, see the [Manage Apps](https://developer.here.com/olp/documentation/access-control/user-guide/topics/manage-apps.html) section of the [Teams and Permissions User Guide](https://developer.here.com/olp/documentation/access-control/user-guide/index.html).

2. Using your **access key id** and **access key secret** that you can find on the [Apps & Keys](https://platform.here.com/profile/apps-and-keys) page. For more details on how to create your authentication and authorization client for retrieving HERE tokens, see the [Authentication and Authorization Developer's Guide](https://developer.here.com/olp/documentation/access_control/topics/introduction.html).

After you set up the credentials, you can use them to access the HERE OLP SDK libraries.

## <a name="components"></a> Available Components

The OLP SDK for TypeScript package contains four independent modules that focus on a specific set of responsibilities:

- `olp-sdk-authentication`: gets OAuth2 bearer tokens used to confirm OLP requests.
- `olp-sdk-dataservice-api`: retrieves data from OLP.
- `olp-sdk-dataservice-read`: retrieves layer and partition data from OLP catalogs.
- `olp-sdk-fetch`: adds a subset of the fetch API for Node.js.

## <a name="examples"></a> Examples

The [Versioned Layer Read example](./examples/nodejs-read-versioned-layer.md) shows how to retrieve layer metadata, partition metadata, and partition data from a versioned layer using the OLP SDK for TypeScript.

The [Volatile Layer Read example](./examples/nodejs-read-volatile-layer.md) shows how to retrieve layer metadata, partition metadata, and partition data from a volatile layer using the OLP SDK for TypeScript.