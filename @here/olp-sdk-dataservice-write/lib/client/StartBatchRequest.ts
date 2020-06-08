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

import { PublishApi } from "@here/olp-sdk-dataservice-api";

/**
 * @brief StartBatchRequest is used to start a versioned batch operation.
 */
export class StartBatchRequest {
    private layers?: string[];
    private versionDependencies?: PublishApi.VersionDependency[];
    private billingTag?: string;

    /**
     * @brief set the layers used in this batch operation
     * @param layers layer id's to be used
     * @returns reference to this object
     */
    public withLayers(layers: string[]): StartBatchRequest {
        this.layers = layers;
        return this;
    }

    /**
     * @brief set the version dependencies used in this batch operation
     * @param versionDependencies array of VersionDependencies
     * @returns reference to this object
     */
    public withVersionDependencies(
        versionDependencies: PublishApi.VersionDependency[]
    ): StartBatchRequest {
        this.versionDependencies = versionDependencies;
        return this;
    }

    /**
     * @param billing_tag An optional free-form tag which is used for grouping
     * billing records together. If supplied, it must be between 4 - 16
     * characters, contain only alpha/numeric ASCII characters [A-Za-z0-9].
     * @note Optional.
     */
    public withBillingTag(tag: string): StartBatchRequest {
        this.billingTag = tag;
        return this;
    }

    /**
     * @brief get the layers used in this batch operation
     * @returns array of layers ids or undefined
     */
    public getLayers(): string[] | undefined {
        return this.layers;
    }

    /**
     * @brief gets the VersionDependencies of this batch operation
     * @returns the array of VersionDependencies or undefined
     */
    public getVersionDependencies():
        | PublishApi.VersionDependency[]
        | undefined {
        return this.versionDependencies;
    }

    /**
     * @return Billing Tag previously set or undefined.
     */
    public getBillingTag(): string | undefined {
        return this.billingTag;
    }
}
