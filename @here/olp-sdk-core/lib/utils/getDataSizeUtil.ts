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

const BYTES_IN_NUMBER = 8;
const BYTES_IN_BOOLEAN = 4;

/**
 * Calculate memory size of javascript object, it is not an accurate value
 * @param data. The string or number or boolean or array or object.
 * @returns The size of value in bytes.
 */
export function getDataSize(data: string | number | boolean | object) {
    let bytes = 0;

    function sizeOf(obj: any) {
        if (obj !== null && obj !== undefined) {
            switch (typeof obj) {
                case "number":
                    bytes += BYTES_IN_NUMBER;
                    break;
                case "string":
                    bytes += obj.length * 2;
                    break;
                case "boolean":
                    bytes += BYTES_IN_BOOLEAN;
                    break;
                case "object":
                    const objClass = Object.prototype.toString.call(obj);
                    if (
                        objClass === "[object Object]" ||
                        objClass === "[object Array]"
                    ) {
                        for (const key in obj) {
                            if (!obj.hasOwnProperty(key)) {
                                continue;
                            }
                            sizeOf(obj[key]);
                        }
                    } else {
                        bytes += obj.toString().length * 2;
                    }
                    break;
            }
        }
        return bytes;
    }

    return sizeOf(data);
}
