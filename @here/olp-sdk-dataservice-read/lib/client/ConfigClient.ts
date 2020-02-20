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

import { ConfigApi } from "@here/olp-sdk-dataservice-api";
import { CatalogsRequest, OlpClientSettings, RequestFactory } from "..";

/**
 * A client for the OLP Config Service.
 */
export class ConfigClient {
    private readonly apiVersion = "v1";
    /**
     * Constructs a new client for the data store to work with data
     * about catalogs configurations in the store.
     *
     * @param settings The [[OlpClientSettings]] instance.
     * @return The [[ConfigClient]] instance.
     */
    constructor(private readonly settings: OlpClientSettings) {}

    /**
     * Asynchronously retrieves a list of catalogs to which you have access.
     *
     * @param request The [[CatalogsRequest]] instance.
     * @return The list of catalogs to which you have access.
     *
     * If the schema is set, you get the catalogs with layers filtered by the specified layer schema HERE Resource Name (HRN).
     * If the schema is not set, the filter returns all of the catalogs to which you have access.
     */
    public async getCatalogs(
        request?: CatalogsRequest
    ): Promise<ConfigApi.CatalogsListResult> {
        const requestBuilder = await RequestFactory.create(
            "config",
            this.apiVersion,
            this.settings
        ).catch(error => Promise.reject(error));

        const params: {
            verbose?: string;
            schemaHrn?: string;
            billingTag?: string;
        } = {};

        if (request) {
            params.billingTag = request.getBillingTag();

            if (request.getSchema()) {
                params.verbose = "true";
                params.schemaHrn = request.getSchema();
            }
        }

        return ConfigApi.getCatalogs(requestBuilder, params);
    }
}
