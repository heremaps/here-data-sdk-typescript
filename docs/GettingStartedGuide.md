# Getting Started Guide

This guide provides an introduction to the process of authentication to [HERE Open Location Platform (OLP)](https://platform.here.com), a configuration of your environment and use of OLP features, including reading and writing data. API libraries enable you to access OLP data store, with support for exploring catalogs, resolving tiles, downloading layers and ingesting data to/from OLP.

OLP SDK for TypeScript includes core components for accessing OLP APIs from any web-based application. Starting points to begin using the OLP SDK for TypeScript:

- [OLP Prerequisite Knowledge](#prerequisite)
- [Getting Credentials](#credentials)
- [Available Components](#components)
- [Context and CatalogClient](#catalog-client)
- [VersionedLayerClient example](#examples)

## <a name="prerequisite"></a> OLP Prerequisite Knowledge

The use of HERE OLP SDK requires a basic understanding of the following OLP-related concepts:

- [OLP Catalog](https://developer.here.com/olp/documentation/data-user-guide/portal/layers/catalogs.html)
- [OLP Layers](https://developer.here.com/olp/documentation/data-user-guide/portal/layers/layers.html)
- [OLP Partitions](https://developer.here.com/olp/documentation/data-user-guide/portal/layers/partitions.html)
- [HERE Resource Name (HRN)](https://developer.here.com/olp/documentation/data-user-guide/shared_content/topics/olp/concepts/hrn.html)

For more details, see [HERE OLP Data User Guide](https://developer.here.com/olp/documentation/data-user-guide/index.html).

## <a name="credentials"></a> Getting Credentials

Before any catalog or service request to the [HERE Open Location Platform](https://platform.here.com), you must obtain the OLP authentication and authorization credentials.

The following two authentication approaches are available within your application:

1. Using your **platform credentials**, available from the platform portal in combination with HERE OLP SDK authentication library.

> **Note**: to obtain your **platform credentials**, create a new application through the [Apps & Keys](https://platform.here.com/profile/apps-and-keys) page. After creating your application, click **Create A Key** to download these credentials. For more information on obtaining platform credentials, see [Manage Apps](https://developer.here.com/olp/documentation/access-control/user-guide/topics/manage-apps.html) section of the [Teams and Permissions User Guide](https://developer.here.com/olp/documentation/access-control/user-guide/index.html).

2. Using your **app access key id** and **secret access key**, which you can find on platform's [Apps & Keys](https://platform.here.com/profile/apps-and-keys) page. For more details on how to create your authentication and authorization client for retrieving HERE tokens, see [Authentication and Authorization Developer's Guide](https://developer.here.com/olp/documentation/access_control/topics/introduction.html).

After you set up the credentials, you can use them to access HERE OLP SDK libraries.

## <a name="components"></a> Available Components

HERE OLP SDK consists of specific libraries, each with distinct functionality.

- `olp-sdk-authentification`: API library for getting a HERE OAuth2 token to access OLP.
- `olp-sdk-dataservice-api`: API library to retrieve data from OLP.
- `olp-sdk-dataservice-read`: API library to retrieve Layer and Partition data from OLP catalogs.
- `olp-sdk-fetch`: This module adds a subset of [fetch](https://fetch.spec.whatwg.org/) API for [Node.js](https://nodejs.org/).

## <a name="examples"></a> Examples

[Versioned Layer Read example](./examples/nodejs-read-versioned-layer.md) shows how to retrieve layer metadata, partition metadata, and partition data from versioned layer using OLP SDK for TypeScript.

[Volatile Layer Read example](./examples/nodejs-read-volatile-layer.md) shows how to retrieve layer metadata, partition metadata, and partition data from volatile layer using OLP SDK for TypeScript.

## <a name="catalog-client"></a> CatalogClient

The main entry point to the OLP is `CatalogClient`. This class provides a high-level interface for retrieval of `OLP` catalog data and configuration, and defines the following operations:

- `getLatestVersion`: Fetches the latest version of the catalog
- `getVersions`: Fetches a tile from this layer asynchronously

More details how to use the CatalogClient are placed in the [Catalog usage example](./examples/nodejs-examples.md).