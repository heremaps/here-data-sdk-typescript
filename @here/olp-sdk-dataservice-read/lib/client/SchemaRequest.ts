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
 * A class that prepare information for calls to the Artifact API.
 */
export class SchemaRequest {
    private variant?: ArtifactApi.Variant;
    private billingTag?: string;

    public getVariant(): ArtifactApi.Variant | undefined {
        return this.variant;
    }

    /**
     * Set value of schema HRN to use in methods getSchema and getSchema from [[ArtifactClient]].
     *
     * @param variant required, ArtifactApi.Variant
     */
    public withVariant(variant: ArtifactApi.Variant): SchemaRequest {
        this.variant = variant;
        return this;
    }

    /**
     * Billing Tag is an optional free-form tag which is used for grouping billing records together.
     * If supplied, it must be between 4 - 16 characters, contain only alpha/numeric ASCII characters [A-Za-z0-9].
     */
    public withBillingTag(tag: string): SchemaRequest {
        this.billingTag = validateBillingTag(tag);
        return this;
    }

    /**
     * Billing Tag for grouping billing records together
     */
    public getBillingTag(): string | undefined {
        return this.billingTag;
    }
}
