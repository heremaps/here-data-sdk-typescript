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

/**
 * Prepares information for calls to the OLP Stream Service.
 */
export class PollRequest {
    private mode?: "serial" | "parallel";
    private subscriptionId?: string;

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
     * @returns The [[PollRequest]] instance that you can use to chain methods.
     */
    public withMode(mode: "serial" | "parallel"): PollRequest {
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
     * @returns The [[PollRequest]] instance that you can use to chain methods.
     */
    public withSubscriptionId(id: string): PollRequest {
        this.subscriptionId = id;
        return this;
    }
}
