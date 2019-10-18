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

import { ArtifactApi, ConfigApi} from "@here/olp-sdk-dataservice-api";
import { ErrorHTTPResponse } from "./CatalogClientCommon";
import { DataStoreContext } from "./DataStoreContext";
import { DataStoreRequestBuilder } from "./DataStoreRequestBuilder";

/**
 * The main class to access a catalog from HERE Data Service.
 *
 * This API supports version 2 of the Data Service REST API.
 */
export class DataStoreClient {
    /**
     * Constructs a new client to the data store to work with data
     * about catalogs, configurations, metadata in the store.
     *
     * @param context The context of the data store with shared and cached data (base urls, for example)
     */
    constructor(private readonly context: DataStoreContext) {}

    /**
     * Get schema details.
     *
     * @param schemaHrn String representing schema HRN.
     * @returns Object with schema details.
     */
    async getSchemaDetails(schemaHrn: string): Promise<ArtifactApi.GetSchemaResponse> {
        const artifactBaseUrl = await this.context.getBaseUrl("artifact");

        return ArtifactApi.getSchemaUsingGET(
            new DataStoreRequestBuilder(
                this.context.dm,
                artifactBaseUrl,
                this.context.getToken
            ),
            { schemaHrn }
        ).catch(() => {
            throw new Error(`Cannot get schema details: ${schemaHrn}`);
        });
    }

    /**
     * Get schema.
     *
     * @param schemaHrn String representing schema HRN.
     * @param schemaRequestInit Optional request options to be passed to fetch when downloading
     * schema.
     * @returns Archive with schema.
     */
    async getSchema(
        schemaHrn: string,
        schemaRequestInit?: RequestInit
    ): Promise<ArrayBuffer> {
        const schemaDetails = await this.getSchemaDetails(schemaHrn);
        const schemaVariant = schemaDetails.variants!.find(
            variant => variant.id === "ds"
        );
        if (schemaVariant === undefined) {
            throw new Error(
                `URL of the schema bundle is not found: ${schemaDetails}`
            );
        }

        const artifactBaseUrl = await this.context.getBaseUrl("artifact");
        const schemaUrl = artifactBaseUrl + schemaVariant.url;

        const requestBuilder = new DataStoreRequestBuilder(
            this.context.dm,
            "",
            this.context.getToken
        );
        const response = await requestBuilder
            .downloadData(schemaUrl, schemaRequestInit)
            .catch(() => {
                throw new Error(`Cannot download Schema bundle: ${schemaHrn}`);
            });

        if (response.status === 200) {
            return response.arrayBuffer();
        } else {
            const messages: { [key: number]: string } = {
                401: "You are not authorized to view the schema",
                403: "Accessing the schema is forbidden",
                404: "The schema was not found",
                500: "Internal server error"
            };
            const message = response.statusText || messages[response.status];

            throw new ErrorHTTPResponse(
                `Artifact Service error: HTTP ${response.status}: ${message}, HRN: ${schemaHrn}`,
                response
            );
        }
    }

    /**
     * Asynchronously retrieves a list of catalogs which contain layer of certain schema that your
     * account has access to.
     *
     * @param schemaHrn Schema HRN of layers to look for.
     * @returns A promise with list of catalogs and their layers.
     */
    async getCatalogsBySchema(schemaHrn: string): Promise<ConfigApi.CatalogsListResult> {
        const configBaseUrl = await this.context.getBaseUrl("config");
        return ConfigApi.getCatalogs(
            new DataStoreRequestBuilder(
                this.context.dm,
                configBaseUrl,
                this.context.getToken
            ),
            {
                verbose: "true",
                schemaHrn
            }
        );
    }
}
