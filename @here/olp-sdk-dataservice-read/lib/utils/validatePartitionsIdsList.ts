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
 * Validates a list of partitions IDs.
 *
 * It must be between 1&ndash;100 items.
 *
 * @param list The lists of strings that represent the partitions IDs.
 * @returns The list of strings if it's valid. Otherwise, throws an error.
 */
export function validatePartitionsIdsList(list: string[]): string[] {
    const LIST_MAX_LENGTH = 100;
    const length = list.length;

    if (length < 1 || length > LIST_MAX_LENGTH) {
        throw new Error("The partition ids quantity must be between 1 - 100");
    }
    return list;
}
