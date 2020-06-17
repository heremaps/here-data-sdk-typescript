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

// tslint:disable:no-bitwise
// tslint:disable: no-magic-numbers

/**
 * @brief Lets you generate uuid code
 */
export class Uuid {
    /**
     * Creates an UUID
     */
    public static create(): string {
        return [
            Uuid.generate(2),
            Uuid.generate(1),
            Uuid.generate(1),
            Uuid.generate(1),
            Uuid.generate(3)
        ].join("-");
    }

    private static generate(count: number) {
        let result = "";
        for (let i = 0; i < count; i++) {
            result += (((1 + Math.random()) * 0x10000) | 0)
                .toString(16)
                .substring(1);
        }
        return result;
    }
}
