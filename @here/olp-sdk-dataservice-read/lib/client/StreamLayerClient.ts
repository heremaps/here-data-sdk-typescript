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
    PollRequest,
    RequestFactory,
    SubscribeRequest
} from "..";

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
    private xCorrelationId?: string;
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

    /**
     * Enables message consumption from a specific stream layer. Use the base path returned from the API Lookup service.
     * For mode = parallel, one unit of parallelism currently equals 1 MBps inbound or 2 MBps outbound,
     * whichever is greater, rounded up to the nearest integer.
     * The number of subscriptions within the same group cannot exceed the parallelism allowed.
     * For more details see
     * [Get Data from a Stream Layer](https://developer.here.com/olp/documentation/data-api/data_dev_guide/rest/getting-data-stream.html)
     *
     * @param request The [[SubscribeRequest]] instance of the configured request parameters.
     * @param abortSignal A signal object that allows you to communicate with a request (such as the `fetch` request)
     * and, if required, abort it using the `AbortController` object.
     *
     * For more information, see the [`AbortController` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
     *
     * @returns Subscription Id
     */
    public async subscribe(
        request: SubscribeRequest,
        abortSignal?: AbortSignal
    ): Promise<string> {
        const builder = await this.getRequestBuilder(
            "stream",
            this.catalogHrn,
            abortSignal
        ).catch(error => Promise.reject(error));

        const subscription = await StreamApi.subscribe(builder, {
            layerId: this.layerId,
            mode: request.getMode(),
            consumerId: request.getConsumerId(),
            subscriptionId: request.getSubscriptionId(),
            subscriptionProperties: request.getSubscriptionProperties()
        })
            .then(async response => {
                this.xCorrelationId =
                    response.headers.get("X-Correlation-Id") || undefined;
                return response.json();
            })
            .catch(err => Promise.reject(err));

        return subscription
            ? Promise.resolve(subscription)
            : Promise.reject(new Error("Subscribe error"));
    }

    /**
     * Consumes data from a layer. Returns messages from a stream layer.
     * If the data size is less than 1 MB, the data field will be populated.
     * If the data size is greater than 1 MB, a data handle will be returned pointing to the object stored in the Blob store.
     *
     * @param request The [[PollRequest]] instance of the configured request parameters.
     * @param abortSignal A signal object that allows you to communicate with a request (such as the `fetch` request)
     * and, if required, abort it using the `AbortController` object.
     *
     * For more information, see the [`AbortController` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
     *
     * @returns Messages [[StreamApi.Messages]] from a stream layer
     */
    public async poll(
        request: PollRequest,
        abortSignal?: AbortSignal
    ): Promise<StreamApi.Message[]> {
        const builder = await this.getRequestBuilder(
            "stream",
            this.catalogHrn,
            abortSignal
        ).catch(error => Promise.reject(error));

        const consumeData = await StreamApi.consumeData(builder, {
            layerId: this.layerId,
            mode: request.getMode(),
            subscriptionId: request.getSubscriptionId(),
            xCorrelationId: this.xCorrelationId
        })
            .then(async response => {
                this.xCorrelationId =
                    response.headers.get("X-Correlation-Id") ||
                    this.xCorrelationId;
                return Promise.resolve(response.json());
            })
            .catch(error => Promise.reject(error));

        const offsets = consumeData.messages.reduce((acc: any, x: any) => {
            acc.push(x.offset);
            return acc;
        }, []);

        const offsetsCommited = await this.commitOffsets({
            offsets
        }).catch(error => Promise.reject(error));

        if (offsetsCommited) {
            return Promise.resolve(consumeData.messages);
        } else {
            return Promise.reject(
                new Error(
                    "Poll: commit offsets unsuccessful, error=Offset is not commited"
                )
            );
        }
    }

    /**
     *
     * @param offsets commit the offset of the last message read from each partition
     * so that your application can resume reading new messages from the correct partition
     * @param offsets offsets to commit
     *
     * @returns OK, offsets committed
     */
    private async commitOffsets(offsets: StreamApi.CommitOffsetsRequest) {
        const builder = await this.getRequestBuilder(
            "stream",
            this.catalogHrn
        ).catch(error => Promise.reject(error));

        return StreamApi.commitOffsets(builder, {
            commitOffsets: offsets,
            layerId: this.layerId,
            xCorrelationId: this.xCorrelationId
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
