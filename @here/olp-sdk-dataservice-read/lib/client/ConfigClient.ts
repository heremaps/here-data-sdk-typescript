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
import {
    CatalogsRequest,
    OlpClientSettings,
    RequestFactory
} from "@here/olp-sdk-dataservice-read";

export class ConfigClient {
    private readonly apiVersion = "v1";
    /**
     * Constructs a new client to the data store to work with data
     * about catalogs configurations in the store.
     *
     * @param settings The instance of [[OlpClientSettings]]
     */
    constructor(private readonly settings: OlpClientSettings) {}

    /**
     * Asynchronously retrieves a list of catalogs that your account has access to.
     * If set the schema, then will return filtered only catalogs (layers) by the specified layer schema HRN.
     * If schema is not setted, then filter will return search for all.
     */
    public async getCatalogs(
        request: CatalogsRequest
    ): Promise<ConfigApi.CatalogsListResult> {
        const requestBuilder = await RequestFactory.create(
            "config",
            this.apiVersion,
            this.settings
        ).catch(error => Promise.reject(error));
        return ConfigApi.getCatalogs(
            requestBuilder,
            request.getSchema()
                ? {
                      verbose: "true",
                      schemaHrn: request.getSchema(),
                      billingTag: request.getBillingTag()
                  }
                : { billingTag: request.getBillingTag() }
        );
    }
}
