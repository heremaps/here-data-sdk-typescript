/*
 * Copyright (C) 2019-2021 HERE Europe B.V.
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

import { QuadKey } from "@here/olp-sdk-core";

/**
 * @deprecated This function will be removed by 08.2021. 
 * Please use the same method from [[TileKey]] class, imported from `@here/olp-sdk-core` package.
 *
 * Checks if a quadkey is valid.
 *
 * The number of rows and columns must not be greater than the maximum number of rows and columns in the given level.
 * The maximum number of rows and columns in a level is computed as 2 to the power of the level.
 *
 * @note As the JavaScript number type can hold 53 bits in its mantissa, only levels up to 26 can be
 * represented in the number representation returned by [[mortonCodeFromQuadKey]].
 * A level must be positive and can't be greater than 26.
 *
 * @param key The current quadkey.
 * @return True if the quadkey is valid, false otherwise.
 */
export function isValid(key: QuadKey): boolean {
    // tslint:disable-next-line:no-magic-numbers
    if (key.level < 0 || key.level > 26) {
        return false;
    }
    const dimensionAtLevel = Math.pow(2, key.level);
    const rowValid = key.row >= 0 && key.row < dimensionAtLevel;
    const columnValid = key.column >= 0 && key.column < dimensionAtLevel;
    return rowValid && columnValid;
}
