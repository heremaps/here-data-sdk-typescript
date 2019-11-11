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

import { LookupApi } from "@here/olp-sdk-dataservice-api";
import {
    ApiCacheRepository,
    ApiName,
    DataStoreRequestBuilder,
    getEnvLookUpUrl,
    HRN,
    OlpClientSettings
} from "@here/olp-sdk-dataservice-read";

/**
 * The helper utils for making Request object with base urls to the services from
 * lookup api, token callback and download manager.
 *
 * Also can be used for getting base url to the service from lookup api.
 */
export class RequestFactory {
    /**
     * Factory method for building [[DataStoreRequestBuilder]]
     * @param serviceName The name of the service in API
     * @param serviceVersion The version of the service
     * @param settings Instance of [[OlpClientSettings]]
     * @param hrn Optional [[HRN]] for the catalog
     * @param abortSignal A signal object that allows you to communicate with a request (such as a Fetch)
     * and abort it if required via an AbortController object
     *  @see https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal
     *
     * @returns The [[Promise]] with constructed [[DataStoreRequestBuilder]]
     */
    public static async create(
        serviceName: ApiName,
        serviceVersion: string,
        settings: OlpClientSettings,
        hrn?: HRN,
        abortSignal?: AbortSignal
    ): Promise<DataStoreRequestBuilder> {
        return RequestFactory.getBaseUrl(
            serviceName,
            serviceVersion,
            settings,
            hrn
        )
            .then(async (baseUrl: string) =>
                baseUrl
                    ? Promise.resolve(
                          new DataStoreRequestBuilder(
                              settings.downloadManager,
                              baseUrl,
                              settings.token,
                              abortSignal
                          )
                      )
                    : Promise.reject(
                          `Error getting base url to the service: ${serviceName}`
                      )
            )
            .catch(error =>
                Promise.reject(
                    `Error building Request for service: ${serviceName}.\n${error}`
                )
            );
    }

    /**
     * Getts base url to the API service with caching support.
     *
     * @param serviceName The name of the service in API
     * @param serviceVersion The version of the service
     * @param settings Instance of [[OlpClientSettings]]
     * @param hrn Optional [[HRN]] for the catalog
     *
     * @returns The [[Promise]] with the base url to the service
     */
    public static async getBaseUrl(
        serviceName: ApiName,
        serviceVersion: string,
        settings: OlpClientSettings,
        hrn?: HRN
    ): Promise<string> {
        const apiCache = new ApiCacheRepository(settings.cache, hrn);
        const baseUrl = apiCache.get(serviceName, serviceVersion);
        if (baseUrl) {
            return Promise.resolve(baseUrl);
        }

        const lookUpUrl = getEnvLookUpUrl(settings.environment);
        const lookUpApiRequest = new DataStoreRequestBuilder(
            settings.downloadManager,
            lookUpUrl,
            settings.token
        );

        const apiService = hrn ? LookupApi.resourceAPI : LookupApi.platformAPI;
        const params: {
            api: string;
            version: string;
            hrn: string;
            region?: string | undefined;
        } = {
            api: serviceName,
            version: serviceVersion,
            hrn: ""
        };

        if (hrn) {
            params.hrn = hrn.toString();
        }

        return apiService(lookUpApiRequest, params)
            .then(
                async (
                    result: LookupApi.API[] | LookupApi.ApiNotFoundError
                ) => {
                    if (result instanceof Array && result[0].baseURL) {
                        apiCache.put(
                            serviceName,
                            serviceVersion,
                            result[0].baseURL
                        );
                        return Promise.resolve(result[0].baseURL);
                    }

                    if (!(result instanceof Array) && result.status === 404) {
                        return Promise.reject(
                            `Getting API error: ${result.title}`
                        );
                    }

                    return Promise.reject(
                        `Getting API ${serviceName} unknown error`
                    );
                }
            )
            .catch((error: string) =>
                Promise.reject(`Getting API ${serviceName} error: ${error}`)
            );
    }
}
