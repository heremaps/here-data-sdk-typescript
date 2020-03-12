/*
 * Copyright (C) 2019-2020 HERE Europe B.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 * License-Filename: LICENSE
 */

import {
    ConfigApi,
    HttpError,
    MetadataApi
} from "@here/olp-sdk-dataservice-api";
import {
    ApiName,
    CatalogVersionRequest,
    DataStoreRequestBuilder,
    HRN,
    OlpClientSettings
} from "..";
import { CatalogRequest } from "./CatalogRequest";
import { LayerVersionsRequest } from "./LayerVersionsRequest";

/**
 * Interacts with the DataStore catalog.
 */
export class CatalogClient {
    private readonly apiVersion: string = "v1";
    private readonly hrn: string;

    /**
     * Constructs the [[CatalogClient]] instance.
     *
     * @param catalogHrn The HERE Resource Name (HRN) of the catalog.
     * @param settings The [[OlpClientSettings]] instance.
     * @return The [[CatalogClient]] instance.
     */
    constructor(catalogHrn: HRN, readonly settings: OlpClientSettings) {
        this.hrn = catalogHrn.toString();
    }

    /**
     * Loads and caches the full catalog configuration for the requested catalog.
     * The catalog configuration contains descriptive and structural
     * information such as layer definitions and layer types.
     *
     * @summary Gets details about the requested catalog.
     *
     * @param request The [[CatalogRequest]] instance that contains the configured request parameters.
     * @param abortSignal A signal object that allows you to communicate with a request (such as the `fetch` request)
     * and, if required, abort it using the `AbortController` object.
     *
     * For more information, see the [`AbortController` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
     *
     * @return The catalog metadata.
     */
    public async getCatalog(
        request: CatalogRequest,
        abortSignal?: AbortSignal
    ): Promise<ConfigApi.Catalog> {
        const builder = await this.getRequestBuilder(
            "config",
            undefined,
            abortSignal
        );

        return ConfigApi.getCatalog(builder, {
            catalogHrn: this.hrn,
            billingTag: request.getBillingTag()
        }).catch(err => Promise.reject(err));
    }

    /**
     * Returns minimum version for the given catalog. If the catalog doesn't contain any versions error will be returned.
     * @param request Is [[CatalogVersionRequest]] instance and has ((getBillingTag)) method.
     * @param abortSignal A signal object that allows you to communicate with a request (such as a Fetch)
     * and abort it if required via an AbortController object.
     *  @see https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal
     *  @returns A promise of the http response that contains the pminimum version for the given catalog.
     */
    public async getEarliestVersion(
        request: CatalogVersionRequest,
        abortSignal?: AbortSignal
    ): Promise<number> {
        const builder = await this.getRequestBuilder(
            "metadata",
            HRN.fromString(this.hrn),
            abortSignal
        ).catch(error => Promise.reject(error));

        const earliestVersion = await MetadataApi.minimumVersion(builder, {
            billingTag: request.getBillingTag()
        }).catch(err => Promise.reject(err));

        return Promise.resolve(earliestVersion.version);
    }

    /**
     * Returns information about layer versions for the catalog version. It will return array with
     * all catalog layers and latest version for each layer or return error if the catalog does not
     * have any versions or if the version passed in the query parameter does not exist. If a layer
     * does not have any data for the requested version it is excluded from the response.
     *
     * @param request Is [[LayerVersionsRequest]] instance and has ((getVersion)) method.
     * Version - catalog version to get all related layers versions. If not defined, then the version will be the latest catalog version.
     * @param abortSignal A signal object that allows you to communicate with a request (such as a Fetch)
     * and abort it if required via an AbortController object.
     * @returns A promise of the http response that contains an array with all catalog layers and latest version for each layer.
     */
    public async getLayerVersions(
        request: LayerVersionsRequest,
        abortSignal?: AbortSignal
    ): Promise<MetadataApi.LayerVersion[]> {
        const builder = await this.getRequestBuilder(
            "metadata",
            HRN.fromString(this.hrn),
            abortSignal
        ).catch(error => Promise.reject(error));
        let requestedCatalogVersion = request.getVersion();

        if (requestedCatalogVersion === undefined) {
            const billingtag = request.getBillingTag();
            const catalogVersionRequest = new CatalogVersionRequest();
            if (billingtag) {
                catalogVersionRequest.withBillingTag(billingtag);
            }
            requestedCatalogVersion = await this.getLatestVersion(
                catalogVersionRequest
            ).catch(async error => Promise.reject(error));
        }

        const layerVersions = await MetadataApi.getLayerVersions(builder, {
            version: requestedCatalogVersion,
            billingTag: request.getBillingTag()
        }).catch(async error => Promise.reject(new Error(error)));

        return Promise.resolve(layerVersions.layerVersions);
    }

    /**
     * Gets the latest version of a catalog.
     *
     * @param request The [[CatalogVersionRequest]] instance with the `getStartVersion` method used to get
     * the catalog start version (exclusive).
     *
     * The default value is -1. By convention -1
     * indicates the virtual initial version before the first publication that has version 0.
     * @param abortSignal A signal object that allows you to communicate with a request (such as the `fetch` request)
     * and, if required, abort it using the `AbortController` object.
     *
     * For more information, see the [`AbortController` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
     *
     * @returns A promise of the HTTP response that contains the payload with the latest version.
     */
    public async getLatestVersion(
        request: CatalogVersionRequest,
        abortSignal?: AbortSignal
    ): Promise<number> {
        let startVersion = request.getStartVersion();

        if (startVersion === undefined) {
            startVersion = -1;
        }

        const builder = await this.getRequestBuilder(
            "metadata",
            HRN.fromString(this.hrn),
            abortSignal
        ).catch(error => Promise.reject(error));

        const latestVersion = await MetadataApi.latestVersion(builder, {
            startVersion,
            billingTag: request.getBillingTag()
        }).catch(err => Promise.reject(err));
        return Promise.resolve(latestVersion.version);
    }

    /**
     * Gets information about specific catalog versions. The maximum number of versions to be
     * returned per call is 1000 versions. If the range is bigger than 1000 versions, you get the 400 Bad Request error.
     *
     * @param request The [[CatalogVersionRequest]] instance with the `getStartVersion` and `getEndVersion` methods.
     * * `StartVersion` - a catalog start version (exclusive). Default is -1. By convention -1
     * indicates the virtual initial version before the first publication that has version 0.
     * * `EndVersion` - a catalog end version (inclusive). If not defined, then the latest catalog
     * version is fethced and used.
     * @param abortSignal A signal object that allows you to communicate with a request (such as the `fetch` request)
     * and, if required, abort it using the `AbortController` object.
     *
     * For more information, see the [`AbortController` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
     *
     * @returns A promise of the HTTP response that contains the payload with versions in the requested
     * range.
     */
    public async getVersions(
        request: CatalogVersionRequest,
        abortSignal?: AbortSignal
    ): Promise<MetadataApi.VersionInfos> {
        let startVersion = request.getStartVersion();

        if (startVersion === undefined) {
            startVersion = -1;
        }

        let endVersion = request.getEndVersion();
        if (endVersion === undefined) {
            endVersion = await this.getLatestVersion(request);
        }

        const builder = await this.getRequestBuilder(
            "metadata",
            HRN.fromString(this.hrn),
            abortSignal
        ).catch(error => Promise.reject(error));
        return MetadataApi.listVersions(builder, {
            startVersion,
            endVersion,
            billingTag: request.getBillingTag()
        });
    }

    /**
     * Fetches `baseUrl` and creates `requestBuilder` for sending requests to the API Lookup Service.
     * @param builderType The endpoint name that is needed to create apropriate `requestBuilder`.
     * @param hrn The catalog HERE Resource Name (HRN).
     * @param abortSignal A signal object that allows you to communicate with a request (such as the `fetch` request)
     * and, if required, abort it using the `AbortController` object.
     *
     * For more information, see the [`AbortController` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
     *
     * @returns `requestBuilder`
     */
    private async getRequestBuilder(
        builderType: ApiName,
        hrn?: HRN,
        abortSignal?: AbortSignal
    ): Promise<DataStoreRequestBuilder> {
        return this.settings.requestBuilderFactory
            .getRequestBuilder(builderType, this.apiVersion, hrn, abortSignal)
            .catch((err: Response) =>
                Promise.reject(
                    `Error retrieving from cache builder for resource "${this.hrn}" and api: "${builderType}.\n${err}"`
                )
            );
    }
}
