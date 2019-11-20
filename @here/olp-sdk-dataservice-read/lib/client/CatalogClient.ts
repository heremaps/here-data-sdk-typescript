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
} from "@here/olp-sdk-dataservice-read";

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
     *
     * @summary Gets the details of a catalog.
     */
    public async getCatalog(): Promise<ConfigApi.Catalog> {
        const builder = await this.getRequestBuilder("config");

        return ConfigApi.getCatalog(builder, { catalogHrn: this.hrn }).catch(
            (err: Response) =>
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
     * @returns A promise of the http response that contains the payload with latest version.
     */
    public async getLatestVersion(
        request: CatalogVersionRequest
    ): Promise<number> {
        const startVersion = request.getStartVersion() || -1;
        const builder = await this.getRequestBuilder("metadata").catch(error =>
            Promise.reject(error)
        );
        const latestVersion = await MetadataApi.latestVersion(builder, {
            startVersion
        });
        return latestVersion.version;
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
     * @returns A promise of the http response that contains the payload with versions in requested
     * range.
     */
    public async getVersions(
        request: CatalogVersionRequest
    ): Promise<MetadataApi.VersionInfos> {
        const startVersion = request.getStartVersion() || -1;
        let endVersion = request.getEndVersion();
        if (endVersion === undefined) {
            endVersion = await this.getLatestVersion(request);
        }

        const builder = await this.getRequestBuilder("metadata").catch(error =>
            Promise.reject(error)
        );
        return MetadataApi.listVersions(builder, { startVersion, endVersion });
    }

    /**
     * Fetch baseUrl and create requestBuilder for sending requests to the look-up API
     * @param builderType endpoint name is needed to create propriate requestBuilder
     *
     * @returns requestBuilder
     */
    private async getRequestBuilder(
        builderType: ApiName,
        abortSignal?: AbortSignal
    ): Promise<DataStoreRequestBuilder> {
        return RequestFactory.create(
            builderType,
            this.apiVersion,
            this.settings,
            HRN.fromString(this.hrn),
            abortSignal
        ).catch((err: Response) =>
            Promise.reject(
                `Error retrieving from cache builder for resource "${this.hrn}" and api: "${builderType}.\n${err}"`
            )
        );
    }
}
