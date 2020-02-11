/*
 * Copyright (C) 2020 HERE Europe B.V.
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

import { StreamApi } from "@here/olp-sdk-dataservice-api";
import {
    ApiName,
    DataStoreRequestBuilder,
    HRN,
    OlpClientSettings,
    RequestFactory
} from "..";
import { SubscribeRequest } from "./SubscribeRequest";

export interface StreamLayerClientParams {
    // The HERE Resource Name (HRN) of the catalog from which you want to get partitions metadata and data.
    catalogHrn: HRN;
    // The ID of the layer.
    layerId: string;
    // The [[OlpClientSettings]] instance.
    settings: OlpClientSettings;
}

/**
 * Describes a stream layer.
 */
export class StreamLayerClient {
    private readonly apiVersion: string = "v2";
    readonly catalogHrn: HRN;
    readonly layerId: string;
    readonly settings: OlpClientSettings;

    /**
     * Creates the [[StreamLayerClient]] instance.
     *
     * @param params The [[StreamLayerClientParams]] instance.
     * @return The [[StreamLayerClient]] instance.
     */
    constructor(params: StreamLayerClientParams) {
        this.catalogHrn = params.catalogHrn;
        this.layerId = params.layerId;
        this.settings = params.settings;
    }

    public async subscribe(
        request: SubscribeRequest,
        abortSignal?: AbortSignal
    ): Promise<StreamApi.ConsumerSubscribeResponse> {
        const builder = await this.getRequestBuilder(
            "stream",
            this.catalogHrn,
            abortSignal
        ).catch(async error => {
            return Promise.reject(error);
        });

        return StreamApi.subscribe(builder, {
            layerId: this.layerId,
            mode: request.getMode(),
            consumerId: request.getConsumerId(),
            subscriptionId: request.getSubscriptionId(),
            subscriptionProperties: request.getSubscriptionProperties()
        });
    }

    /**
     * Fetch baseUrl and create requestBuilder for sending requests to the API Lookup Service.
     * @param builderType endpoint name is needed to create propriate requestBuilder
     *
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
        );
    }
}
