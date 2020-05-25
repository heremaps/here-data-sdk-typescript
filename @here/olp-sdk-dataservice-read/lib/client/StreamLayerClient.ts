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

import {
    DataStoreRequestBuilder,
    HRN,
    OlpClientSettings
} from "@here/olp-sdk-core";
import { BlobApi, StreamApi } from "@here/olp-sdk-dataservice-api";
import {
    PollRequest,
    RequestFactory,
    SeekRequest,
    SubscribeRequest,
    UnsubscribeRequest
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

    protected xCorrelationId?: string;
    protected subscribtionNodeBaseUrl?: string;

    protected readonly catalogHrn: HRN;
    protected readonly layerId: string;
    protected readonly settings: OlpClientSettings;

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
        const requestBuilder = await RequestFactory.create(
            "stream",
            this.apiVersion,
            this.settings,
            this.catalogHrn,
            abortSignal
        ).catch(error => Promise.reject(error));

        const subscribtionRequestParams = {
            layerId: this.layerId,
            mode: request.getMode(),
            consumerId: request.getConsumerId(),
            subscriptionId: request.getSubscriptionId(),
            subscriptionProperties: request.getSubscriptionProperties()
        };

        const subscriptionResult = await StreamApi.subscribe(
            requestBuilder,
            subscribtionRequestParams
        )
            .then(
                async (
                    res: Response
                ): Promise<{
                    nodeBaseURL: string;
                    subscriptionId: string;
                    xCorrelationId?: string;
                }> => {
                    const xCorrelationId =
                        res.headers.get("X-Correlation-Id") || undefined;
                    const responseData = await res.json();
                    return Promise.resolve({ xCorrelationId, ...responseData });
                }
            )
            .catch(err => Promise.reject(err));

        // Update xCorrelationId
        this.xCorrelationId = subscriptionResult.xCorrelationId;

        this.subscribtionNodeBaseUrl = subscriptionResult.nodeBaseURL;
        return Promise.resolve(subscriptionResult.subscriptionId);
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
        if (request.getMode() === "parallel" && !request.getSubscriptionId()) {
            return Promise.reject(
                new Error(
                    "Error: for 'parallel' mode 'subscriptionId' is required."
                )
            );
        }

        if (!this.subscribtionNodeBaseUrl) {
            return Promise.reject(
                new Error(
                    `No valid nodeBaseurl provided for the subscribtion id=${request.getSubscriptionId()}, please check your subscribtion`
                )
            );
        }

        const requestBuilder = new DataStoreRequestBuilder(
            this.settings.downloadManager,
            this.subscribtionNodeBaseUrl,
            this.settings.token,
            abortSignal
        );

        const consumeDataParams = {
            layerId: this.layerId,
            mode: request.getMode(),
            subscriptionId: request.getSubscriptionId(),
            xCorrelationId: this.xCorrelationId
        };

        const consumeResponse = await StreamApi.consumeData(
            requestBuilder,
            consumeDataParams
        )
            .then(
                async (
                    response: Response
                ): Promise<{
                    data: StreamApi.Message[];
                    xCorrelationId?: string;
                }> => {
                    const data = await response.json();
                    return Promise.resolve({
                        xCorrelationId:
                            response.headers.get("X-Correlation-Id") ||
                            undefined,
                        data: data && data.messages ? data.messages : []
                    });
                }
            )
            .catch(error => Promise.reject(error));

        // Update xCorrelationId
        this.xCorrelationId = consumeResponse.xCorrelationId;

        // Commit offsets
        const latestOffsets: { [key: string]: number } = consumeResponse.data
            .map(msg => msg.offset)
            .reduce(
                (
                    acc: { [key: string]: number },
                    curr: StreamApi.StreamOffset
                ) => {
                    acc[curr.partition] =
                        acc[curr.partition] > curr.offset
                            ? acc[curr.partition]
                            : curr.offset;
                    return acc;
                },
                {}
            );

        await StreamApi.doCommitOffsets(requestBuilder, {
            commitOffsets: {
                offsets: Object.keys(latestOffsets).map(key => ({
                    partition: +key,
                    offset: latestOffsets[key]
                }))
            },
            subscriptionId: request.getSubscriptionId(),
            mode: request.getMode(),
            layerId: this.layerId,
            xCorrelationId: this.xCorrelationId
        }).catch(async error => {
            console.log(`Commit offsets unsuccessful, error=${error.message}`);
        });

        return Promise.resolve(consumeResponse.data);
    }

    /**
     * Method deletes a subscription to a layer. This operation removes the subscription from the service.
     *
     * @param request The [[UnsubscribeRequest]] instance of the configured request parameters.
     * @param abortSignal A signal object that allows you to communicate with a request (such as the `fetch` request)
     * and, if required, abort it using the `AbortController` object.
     *
     * For more information, see the [`AbortController` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
     */
    public async unsubscribe(
        request: UnsubscribeRequest,
        abortSignal?: AbortSignal
    ): Promise<Response> {
        if (request.getMode() === "parallel" && !request.getSubscriptionId()) {
            return Promise.reject(
                new Error(
                    "Error: for 'parallel' mode 'subscriptionId' is required."
                )
            );
        }

        if (!this.subscribtionNodeBaseUrl) {
            return Promise.reject(
                new Error(
                    `Subscribtion error. No valid nodeBaseurl provided for the subscribtion id=${request.getSubscriptionId()}, please check your subscribtion`
                )
            );
        }

        const requestBuilder = new DataStoreRequestBuilder(
            this.settings.downloadManager,
            this.subscribtionNodeBaseUrl,
            this.settings.token,
            abortSignal
        );

        return StreamApi.deleteSubscription(requestBuilder, {
            layerId: this.layerId,
            mode: request.getMode(),
            subscriptionId: request.getSubscriptionId(),
            xCorrelationId: this.xCorrelationId
        });
    }

    /**
     * Fetches partition data using data handle.
     *
     * @param message The message data of partition metadata.
     * @param abortSignal A signal object that allows you to communicate with a request (such as the `fetch` request)
     * and, if required, abort it using the `AbortController` object.
     *
     * For more information, see the [`AbortController` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
     *
     * @return The data from the requested partition.
     */
    public async getData(
        message: StreamApi.Message,
        abortSignal?: AbortSignal
    ): Promise<Response> {
        if (!message.metaData || !message.metaData.dataHandle) {
            return Promise.reject(
                new Error("No data handle for this partition")
            );
        }

        const requestBuilder = await RequestFactory.create(
            "blob",
            "v1",
            this.settings,
            this.catalogHrn,
            abortSignal
        ).catch(error => Promise.reject(error));

        return BlobApi.getBlob(requestBuilder, {
            dataHandle: message.metaData.dataHandle,
            layerId: this.layerId
        });
    }

    /**
     * Method allows to start reading data from a specified offset.
     * The message pointer can be moved to any offset in the layer (topic).
     * Message consumption will start from that offset. Once you seek to an offset,
     * there is no returning to the initial offset, unless the initial offset is saved.
     *
     * @param request The [[SeekRequest]] instance of the configured request parameters.
     * @param abortSignal A signal object that allows you to communicate with a request (such as the `fetch` request)
     * and, if required, abort it using the `AbortController` object.
     *
     * For more information, see the [`AbortController` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
     *
     * @returns Response with status 200 if success.
     */
    public async seek(
        request: SeekRequest,
        abortSignal?: AbortSignal
    ): Promise<Response> {
        const offsetsObject = request.getSeekOffsets();
        if (
            !offsetsObject ||
            !offsetsObject.offsets ||
            !offsetsObject.offsets.length
        ) {
            return Promise.reject(new Error("Error: offsets are required."));
        }

        if (request.getMode() === "parallel" && !request.getSubscriptionId()) {
            return Promise.reject(
                new Error(
                    "Error: for 'parallel' mode 'subscriptionId' is required."
                )
            );
        }

        if (!this.subscribtionNodeBaseUrl) {
            return Promise.reject(
                new Error(
                    `Subscribtion error. No valid nodeBaseurl provided for the subscribtion id=${request.getSubscriptionId()}, please check your subscribtion`
                )
            );
        }

        const requestBuilder = new DataStoreRequestBuilder(
            this.settings.downloadManager,
            this.subscribtionNodeBaseUrl,
            this.settings.token,
            abortSignal
        );

        return StreamApi.seekToOffset(requestBuilder, {
            layerId: this.layerId,
            seekOffsets: offsetsObject,
            mode: request.getMode(),
            subscriptionId: request.getSubscriptionId(),
            xCorrelationId: this.xCorrelationId
        })
            .then(async response => {
                this.xCorrelationId =
                    response.headers.get("X-Correlation-Id") ||
                    this.xCorrelationId;
                return response;
            })
            .catch(err => Promise.reject(err));
    }
}
