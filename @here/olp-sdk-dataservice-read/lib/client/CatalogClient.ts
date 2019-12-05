/*
 * Copyright (C) 2019 HERE Europe B.V.
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

import { ConfigApi, MetadataApi } from "@here/olp-sdk-dataservice-api";
import {
    ApiName,
    CatalogVersionRequest,
    DataStoreRequestBuilder,
    HRN,
    OlpClientSettings,
    RequestFactory
} from "..";
import { CatalogRequest } from "./CatalogRequest";
import { LayerVersionsRequest } from "./LayerVersionsRequest";

/**
 * The `CatalogClient` class is the class to interact with a DataStore catalog.
 */
export class CatalogClient {
    private readonly apiVersion: string = "v1";
    private readonly hrn: string;

    /**
     * Constructs a new `CatalogClient`
     */
    constructor(catalogHrn: HRN, readonly settings: OlpClientSettings) {
        this.hrn = catalogHrn.toString();
    }

    /**
     * Loads and cache the full catalog configuration for the requested catalog.
     * The catalog configuration contains descriptive and structural
     * information such as layer definitions and layer types.
     * @param catalogRequest Instance of the configuret request params [[CatalogRequest]]
     * @param abortSignal A signal object that allows you to communicate with a request (such as a Fetch)
     * and abort it if required via an AbortController object
     *  @see https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal
     *
     * @summary Gets the details of a catalog.
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
        }).catch((err: Response) =>
            Promise.reject(
                `Can't load catalog configuration. HRN: ${this.hrn}, error: ${err}`
            )
        );
    }

    /**
     * Get the latest version of the catalog.
     *
     * @param request Is [[CatalogVersionRequest]] instance and has ((getStartVersion)) method to get startVersion.
     * Catalog start version (exclusive). Default is -1. By convention -1
     * indicates the virtual initial version before the first publication which will have version 0.
     * @param abortSignal A signal object that allows you to communicate with a request (such as a Fetch)
     * and abort it if required via an AbortController object
     *  @see https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal
     * @returns A promise of the http response that contains the payload with latest version.
     */
    public async getLatestVersion(
        request: CatalogVersionRequest,
        abortSignal?: AbortSignal
    ): Promise<number> {
        const startVersion = request.getStartVersion() || -1;
        const builder = await this.getRequestBuilder(
            "metadata",
            HRN.fromString(this.hrn),
            abortSignal
        ).catch(error => Promise.reject(error));
        const latestVersion = await MetadataApi.latestVersion(builder, {
            startVersion,
            billingTag: request.getBillingTag()
        });
        return latestVersion.version;
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

        let latestVersionError: string;
        if (!requestedCatalogVersion) {
            const billingtag = request.getBillingTag();
            const catalogVersionRequest = new CatalogVersionRequest();
            if (billingtag) {
                catalogVersionRequest.withBillingTag(billingtag);
            }
            requestedCatalogVersion = await this.getLatestVersion(
                catalogVersionRequest
            ).catch(err => {
                latestVersionError = err;
                return undefined;
            });

            if (!requestedCatalogVersion) {
                return Promise.reject(`Failed to get latest version`);
            }
        }

        const layerVersions = await MetadataApi.getLayerVersions(builder, {
            version: requestedCatalogVersion,
            billingTag: request.getBillingTag()
        });

        return Promise.resolve(layerVersions.layerVersions);
    }

    /**
     * Get the information about specific catalog versions. Maximum number of versions to be
     * returned per call is 1000 versions. If range is bigger than 1000 versions 400 Bad Request
     * will be returned.
     * @param request Is [[CatalogVersionRequest]] instance and has ((getStartVersion)) and ((getEndVersion)) methods.
     * StartVersion - Catalog start version (exclusive). Default is -1. By convention -1
     * indicates the virtual initial version before the first publication which will have version 0.
     * EndVersion - Catalog end version (inclusive). If not defined, then the latest catalog
     * version will be fethced and used.
     * @param abortSignal A signal object that allows you to communicate with a request (such as a Fetch)
     * and abort it if required via an AbortController object
     *  @see https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal
     * @returns A promise of the http response that contains the payload with versions in requested
     * range.
     */
    public async getVersions(
        request: CatalogVersionRequest,
        abortSignal?: AbortSignal
    ): Promise<MetadataApi.VersionInfos> {
        const startVersion = request.getStartVersion() || -1;
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
     * Fetch baseUrl and create requestBuilder for sending requests to the look-up API
     * @param builderType endpoint name is needed to create propriate requestBuilder
     * @param hrn catalog hrn
     * @param abortSignal A signal object that allows you to communicate with a request (such as a Fetch)
     * and abort it if required via an AbortController object
     *  @see https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal
     * @returns requestBuilder
     */
    private async getRequestBuilder(
        builderType: ApiName,
        hrn?: HRN,
        abortSignal?: AbortSignal
    ): Promise<DataStoreRequestBuilder> {
        return RequestFactory.create(
            builderType,
            this.apiVersion,
            this.settings,
            hrn,
            abortSignal
        ).catch((err: Response) =>
            Promise.reject(
                `Error retrieving from cache builder for resource "${this.hrn}" and api: "${builderType}.\n${err}"`
            )
        );
    }
}
