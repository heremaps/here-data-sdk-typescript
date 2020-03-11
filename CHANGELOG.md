## v1.3.1 (11/03/2020)

**olp-sdk-dataservice-read**

- Fixed API breaks in `VersionedLayerClient` and `VolatileLayerClient`.
- Fixed the incorrectly handled version in `VersionedLayerClient`, `CatalogClient`, and `QueryClient`.
- Fixed the incorrectly handled headers in `DatastoreRequestBuilder`.

## v1.3.0 (05/03/2020)

**Common**

- Updated dependencies.

The following bugs are fixed:
- Version "0" was incorrectly handled. It is now fixed.
- Additional fields were not passed correctly into the request. It is now fixed.

**olp-sdk-fetch**

- Updated `node-fetch` to version 2.6.0.

**olp-sdk-authentication**

- Updated `olp-sdk-fetch` to version 1.3.0.

**olp-sdk-dataservice-api**

- Added functions and models that are generated from the Stream API specification.
- Added the `isHttpError()` method to the `HttpError` class.
- Changed `CoverageAPI`. Now, the `dataLevel` parameter is optional.

**olp-sdk-dataservice-read**

- Added the `VersionedLayerClientParams` interface.
- Deprecated the `VersionedLayerClient` constructor. Instead, use the constructor that creates the `VersionedLayerClient` instance with the help of the `VersionedLayerClientParams` object.
- Added the `VersionedLayerClient` constructor that creates the `VersionedLayerClient` instance using the `VersionedLayerClientParams` object and lock version.
- Deprecated the `DataRequest.getVersion()` method.
- Deprecated the `DataRequest.withVersion()` method.
- Changed the `VersionedLayerClient.getData` and `VersionedLayerClient.getPartitions` methods. Now, they ignore versions from `DataRequest` and `PartitionsRequest` and use versions from the `VersionedLayerClient` instance. If you initialize `VersionedLayerClient` without any version, on the first call, the latest version is fetched from the service and set in the instance.
- Added the `SubscribeRequest` class. This is used by `StreamLayerClient.subscribe()`.
- Deprecated the `StatisticsRequest.withDatalevel()` method with a string parameter and added the `StatisticsRequest.withDatalevel()` method with a number parameter.
- Changed `StatisticsRequest.getDataLevel()`. Now, it returns one of the following values: string, number, or undefined.
- Added `StreamLayerClient` and reading support for streamed data using `StreamLayerClient`. Currently, you can subscribe, unsubscribe, and consume messages from a stream layer in a serial or parallel mode. The `poll` method reads messages from a stream layer and commits successfully consumed messages before handing them over to you. With the `seek` method, you can set to start reading messages from a stream layer at any given position.
- Added the `PollRequest` class. It is used by `StreamLayerClient.poll()`.
- Added the `UnsubscribeRequest` class. It is used by `StreamLayerClient.unsubscribe()`.
- Added the `SeekRequest` class. It is used by `StreamLayerClient.seek()`.
- Deprecated the `VolatileLayerClient`constructor. Instead, use the constructor that creates the `VolatileLayerClient` instance with the help of the `VolatileLayerClientParams` object.
- Added the `VolatileLayerClient` constructor that creates the `VolatileLayerClient` instance using `VolatileLayerClientClientParams` object.
- Deprecated the `IndexLayerClient` constructor. Instead, use the constructor that creates the `IndexLayerClientClient` instance with the help of the `IndexLayerClientClientParams` object.
- Added the `IndexLayerClient` constructor that creates the `IndexLayerClientClient` instance using the `IndexLayerClientClientParams` object.
- Changed the `LookupAPI.getBaseUrl()` method. Now, you can fetch all URLs in one request instead of fetching each URL separately.
- Changed the `ConfigClient.getCatalogs()` method. Now, the `request` parameter is optional.

## v1.2.1 (05/02/2020)

**Common**

* Updated the development dependencies.

**olp-sdk-dataservice-read**

* Fixed the crash in `VersionedLayerClient` and `VolatileLayerClient` that happened when a non-existing tile was requested.

**olp-sdk-authentication**

* Reverted the API break in `AuthCredentials`.


## v1.2.0 (04/02/2020)

**Common**

* Updated the development dependencies.

**olp-sdk-dataservice-read**

* Added the `IndexLayerClient` class that is used to access index layers on OLP. This class implements the `getPartitions` and `getData` methods.
* Added the `HttpError` class that extends the `Error` class and adds a status code to HTTP errors.
* Improved error propagations in all public methods. Now, these methods reject the promises with the `HttpError` instance or `Error` class when errors occur.

**olp-sdk-authentication**

* Added the `HttpError` class that extends the `Error` class and adds a status code to HTTP errors.
* Improved error propagations in all public methods. Now, these methods reject the promises with the `HttpError` instance or `Error` class when errors occur.

* **Breaking Change** Improved the return type of the `getEarliestVersion` method in `CatalogClient`. It is now the same as the return type of the `getLatestVersion` method.
* **Breaking Change** Public methods now reject the promises with the `HttpError` instance or `Error` class instead of strings when errors occur.


## v1.1.0 (11/12/2019)

**Common**

* Updated the development dependencies.

**olp-sdk-dataservice-read**

* Added the `getPartitionsById` method to `QueryClient`. Now, you can fetch metadata from specific partitions using their IDs.
* Updated the `getPartitions` method in `VersionedLayerClient` and `VolatileLayerClient`. Now, you can fetch metadata from specific partitions of a volatile or versioned layer using partitions IDs.
* Updated documentation for the public API.

**olp-sdk-authentication**

* The scope support was added to `UserAuth` through `UserAuthConfig`. You can now access the project bound resources using the `UserAuthConfig` scope field.
* Updated documentation for the public API.


## v1.0.0 (02/12/2019)

**olp-sdk-dataservice-read**

* Added new class `OlpClientSetting` with `KeyValueCache` instance to be used for context.
* Added the `VersionedLayerClient` class that is used to access versioned layers on OLP. This class implements the `getData` and `getPartitions` methods.
* Added the `VolatileLayerClient` class that is used to access volatile layers on OLP. This class implements the `getPartitions` and `getData` methods.
* Added the `ArtifactClient` class that is used to access the artifact service on OLP. This class implements the `getSchemaDetails` and `getSchema` methods.
* Added the `ConfigClient` class that is used to access the configuration service on OLP. This class implements the `getCatalogs` method.
* Added the `QueryClient` class that is used to access the query service on OLP. This class implements the `fetchQuadTreeIndex` method.
* Added a possibility to abort requests using `AbortSignal`.
* Added a possibility to set an optional billing tag in each request.
* Added `QuadKeyUtils` that has a set of utilities and functions intended for work with quadkeys: convert a quadkey to a Morton code, convert a Morton code to a quadkey, and validate a quadkey.
* Added the `RequestFactory` class that is used for look-up requests. This class implements the static `create` method that returns the built `DatastoreDownloadManager` instance with a correct base URL to service, and the `getBaseUrl` method that caches and returns base URLs to services.
* The `CatalogClient` constructor changed. Users must pass now `OlpClientSettings` by value not by reference anymore. Removed `KeyValueCache` as it is now a part of `OlpClientSettings`.

* **Breaking Change** The `getLayer` method was removed from `CatalogClient`. Now, to initialize a deprecated `CatalogLayer`, use the `VersionedLayerClient` or `VolatileLayerClient` classes.
* **Breaking Change** The `getTile` method was removed from `CatalogClient`. Now, to get layer data, use `VersionedLayerClient.getData()` or `VolatileLayerClient.getData()`.
* **Breaking Change** The `getAgregatedTile` method was removed from `CatalogClient`. Now, to get partitions metadata and layer data, use `VersionedLayerClient.getPartitions()` and `VersionedLayerClient.getData()` or `VolatileLayerClient.getPartitions()` and `VolatileLayerClient.getData()`.
* **Breaking Change** The `getSchema` and `getSchemaDetails` methods were removed from `CatalogClient`. Now, to get schemas and schema metadata, use the `ArtifactClient` class.
* **Breaking Change** The `HypeDataProvider` class was removed. Now, catalog and layer clients can be initialized without additional classes.
* **Breaking Change** The `DatastoreClient` class was removed. Now, `CatalogClient` can be initialized without additional classes.
* **Breaking Change** Replaced RequestInit with AbortSignal in all public APIs.

**olp-sdk-dataservice-api**

* Fixed issues with requests to the Blob REST APIs.

**olp-sdk-authentication**

* Added a possibility to read credentials from a file using Node.js.


## v0.9.2-beta (28/10/2019)

* Changed prepare process before publishing.
* Changed configuration to the TypeDoc.
* Fixed tslints.
* Align Version and Volatile Layers with DatastoreApi.

## v0.9.1-beta (17/10/2019)

**olp-sdk-authentication**

* Fixed build process for web.
* **Breaking Change** UserAuthConfig.tokenRequester is required now.

**olp-sdk-dataservice-read**

* Fixed build process for web.
