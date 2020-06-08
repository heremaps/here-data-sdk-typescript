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
 * @brief CancelBatchRequest is used to cancel a versioned batch operation.
 */
export class CancelBatchRequest {
    private publicationId?: string;
    private billingTag?: string;

    /**
     * @brief set the ID of the publication to cancel.
     * @param id the ID of the publication to cancel.
     * @returns reference to this object
     */
    public withPublicationId(id: string): CancelBatchRequest {
        this.publicationId = id;
        return this;
    }

    /**
     * @param billing_tag An optional free-form tag which is used for grouping
     * billing records together. If supplied, it must be between 4 - 16
     * characters, contain only alpha/numeric ASCII characters [A-Za-z0-9].
     * @note Optional.
     */
    public withBillingTag(tag: string): CancelBatchRequest {
        this.billingTag = tag;
        return this;
    }

    /**
     * @brief get the ID of the publication to cancel.
     * @returns The ID of the publication to cancel, required.
     */
    public getPublicationId(): string | undefined {
        return this.publicationId;
    }

    /**
     * @return Billing Tag previously set or undefined.
     */
    public getBillingTag(): string | undefined {
        return this.billingTag;
    }
}
