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

/**
 * Prepares information for calls to the platform Stream Service.
 */
export class SubscribeRequest {
    private mode?: "serial" | "parallel";
    private subscriptionId?: string;
    private consumerId?: string;
    private subscriptionProperties?: StreamApi.ConsumerProperties;

    /**
     * Gets the subscription mode for the request.
     *
     * @return The subscription mode.
     */
    public getMode(): "serial" | "parallel" | undefined {
        return this.mode;
    }

    /**
     * A setter for the provided subscription mode.
     *
     * @param mode The subscription mode.
     * @returns The [[SubscribeRequest]] instance that you can use to chain methods.
     */
    public withMode(mode: "serial" | "parallel"): SubscribeRequest {
        this.mode = mode;
        return this;
    }

    /**
     * Gets the subscription id for the request.
     *
     * @return The subscription id.
     */
    public getSubscriptionId(): string | undefined {
        return this.subscriptionId;
    }

    /**
     * A setter for the provided subscription id.
     *
     * @param id The subscription id.
     * @returns The [[SubscribeRequest]] instance that you can use to chain methods.
     */
    public withSubscriptionId(id: string): SubscribeRequest {
        this.subscriptionId = id;
        return this;
    }

    /**
     * Gets the consumer id for the request.
     *
     * @return The consumer id.
     */
    public getConsumerId(): string | undefined {
        return this.consumerId;
    }

    /**
     * A setter for the provided consumer id.
     *
     * @param id The consumer id.
     * @returns The [[SubscribeRequest]] instance that you can use to chain methods.
     */
    public withConsumerId(id: string): SubscribeRequest {
        this.consumerId = id;
        return this;
    }

    /**
     * Gets the subscriptionProperties for the request - consumer properties to use for this subscription.
     *
     * @return The subscriptionProperties.
     */
    public getSubscriptionProperties():
        | StreamApi.ConsumerProperties
        | undefined {
        return this.subscriptionProperties;
    }

    /**
     * A setter for the provided subscription properties.
     *
     * @param props The subscriptionProperties - consumer properties to use for this subscription.
     * For more information, see the [subscription properties]
     * (https://developer.here.com/documentation/data-api/data_dev_guide/rest/getting-data-stream.html#subscription-properties)
     * @returns The [[SubscribeRequest]] instance that you can use to chain methods.
     */
    public withSubscriptionProperties(
        props: StreamApi.ConsumerProperties
    ): SubscribeRequest {
        this.subscriptionProperties = props;
        return this;
    }
}
