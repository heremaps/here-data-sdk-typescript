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

/**
 * Validate billinig tag.
 * It must be between 4 - 16 characters, contain only alpha/numeric ASCII characters [A-Za-z0-9]
 *
 * @param tag string, represents the billing tag.
 * @returns Billing tag back if it's valid, else throws an error.
 */
export function validateBillingTag(tag: string): string {
    const pattern = /^[A-Za-z0-9_-]{4,16}$/;

    if (!pattern.test(tag)) {
        throw new Error(
            "The billing tag must be between 4 - 16 characters, contain only alpha/numeric ASCII characters [A-Za-z0-9]"
        );
    }

    return tag;
}
