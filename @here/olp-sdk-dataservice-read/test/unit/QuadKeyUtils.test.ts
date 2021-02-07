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

import { assert } from "chai";
import * as utils from "../../lib/utils/QuadKeyUtils";

describe("QuadKeyUtils", function() {
    it("Tile is not valid if the row/column is out of bounds", function() {
        const invalid_tile_1 = { row: 5, column: 1, level: 1 };
        assert.isFalse(utils.isValid(invalid_tile_1));

        const invalid_tile_2 = { row: -5, column: 1, level: 1 };
        assert.isFalse(utils.isValid(invalid_tile_2));

        const invalid_tile_3 = { row: 1, column: 5, level: 1 };
        assert.isFalse(utils.isValid(invalid_tile_3));

        const invalid_tile_4 = { row: 1, column: -5, level: 1 };
        assert.isFalse(utils.isValid(invalid_tile_4));
    });

    it("Tile is not valid if the level is out of bounds", function() {
        const invalid_tile_1 = { row: 0, column: 0, level: -1 };
        assert.isFalse(utils.isValid(invalid_tile_1));

        const invalid_tile_2 = { row: 0, column: 0, level: 100 };
        assert.isFalse(utils.isValid(invalid_tile_2));
    });
});
