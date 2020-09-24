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

import { LIB_VERSION } from "@here/olp-sdk-core/lib.version";

/**
 * The string for adding to the requests as query parameter.
 */
export const SENT_WITH_PARAM = `sentWith=OLP-TS-SDK-${LIB_VERSION}`;

/**
 * Adds sentWith param to the url.
 * @param url the string, representing the url
 * @returns the string, representing updated URL
 */
export function addSentWithParam(url: string): string {
    return url.split("?").length === 1
        ? `${url}?${SENT_WITH_PARAM}`
        : `${url}&${SENT_WITH_PARAM}`;
}
