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

import { ArtifactApi } from "@here/olp-sdk-dataservice-api";
import { validateBillingTag } from "..";

/**
 * Prepares information for calls to the platform Artifact Service.
 */
export class SchemaRequest {
    private variant?: ArtifactApi.Variant;
    private billingTag?: string;

    /**
     * Gets the `Variant` object of the schema for the request.
     *
     * @return The `Variant` object of the schema.
     */
    public getVariant(): ArtifactApi.Variant | undefined {
        return this.variant;
    }

    /**
     * Sets a value of a schema HERE Resource Name (HRN) that is used in
     * the `getSchema` and `getSchemaDetails` methods of [[ArtifactClient]].
     *
     * @param variant The `Variant` object of the schema
     * @return The [[SchemaRequest]] instance that you can use to chain methods.
     */
    public withVariant(variant: ArtifactApi.Variant): SchemaRequest {
        this.variant = variant;
        return this;
    }

    /**
     * An optional free-form tag that is used for grouping billing records together.
     *
     * If supplied, it must be 4&ndash;16 characters long and contain only alphanumeric ASCII characters [A-Za-z0-9].
     *
     * @param tag The `BillingTag` string.
     * @return The updated [[SchemaRequest]] instance that you can use to chain methods.
     */
    public withBillingTag(tag: string): SchemaRequest {
        this.billingTag = validateBillingTag(tag);
        return this;
    }

    /**
     * Gets a billing tag to group billing records together.
     *
     * @return The `BillingTag` string.
     */
    public getBillingTag(): string | undefined {
        return this.billingTag;
    }
}
