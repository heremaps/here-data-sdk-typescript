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

/**
 * @deprecated This file will be removed by 02.2021. Please use the same from  the `@here/olp-sdk-core` package.
 */

import {
    ApiCacheRepository,
    ApiName,
    DataStoreRequestBuilder,
    getEnvLookUpUrl,
    HRN,
    HttpError,
    OlpClientSettings,
    RequestFactory as CoreRequestFactory
} from "@here/olp-sdk-core";
import { LookupApi } from "@here/olp-sdk-dataservice-api";
const MILLISECONDS_IN_SECOND = 1000;

/**
 * @deprecated This class will be removed by 02.2021. Please use the same from  the `@here/olp-sdk-core` package.
 * A helper utils that makes the `Request` object with the base URLs of the API Lookup Service, token callback, and download manager.
 *
 * Also, you can use it to get the base URLs of the API Lookup Service.
 */
export class RequestFactory {
    /**
     * Factory method for building [[DataStoreRequestBuilder]].
     *
     * @param serviceName The name of the service in the API.
     * @param serviceVersion The version of the service.
     * @param settings The [[OlpClientSettings]] instance.
     * @param hrn A HERE Resource Name ([[HRN]]) of the catalog.
     * @param abortSignal A signal object that allows you to communicate with a request (such as the `fetch` request)
     * and, if required, abort it using the `AbortController` object.
     *
     * For more information, see the [`AbortController` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
     *
     * @returns The Promise with constructed [[DataStoreRequestBuilder]].
     */
    public static async create(
        serviceName: ApiName,
        serviceVersion: string,
        settings: OlpClientSettings,
        hrn?: HRN,
        abortSignal?: AbortSignal
    ): Promise<DataStoreRequestBuilder> {
        return CoreRequestFactory.create(
            serviceName,
            serviceVersion,
            settings,
            hrn,
            abortSignal
        );
    }

    /**
     * Gets a base URL of the API service that supports caching.
     *
     * @param serviceName The name of the API service.
     * @param serviceVersion The version of the service.
     * @param settings The [[OlpClientSettings]] instance.
     * @param hrn The [[HRN]] of the catalog.
     *
     * @return The Promise with the base URL of the service.
     */
    public static async getBaseUrl(
        serviceName: ApiName,
        serviceVersion: string,
        settings: OlpClientSettings,
        hrn?: HRN
    ): Promise<string> {
        return CoreRequestFactory.getBaseUrl(
            serviceName,
            serviceVersion,
            settings,
            hrn
        );
    }
}
