/*
 * Copyright (C) 2019-2020 HERE Europe B.V.
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

describe("QuadKeyUtils", () => {
    it("Can be constructed from root morton code", () => {
        const tile = utils.quadKeyFromMortonCode("0");
        assert.strictEqual(tile.row, 0, "Row mismatch");
        assert.strictEqual(tile.column, 0, "Column mismatch");
        assert.strictEqual(tile.level, 0, "Level mismatch");
    });

    it("Can be constructed from morton code", () => {
        const tile = utils.quadKeyFromMortonCode("22893");
        assert.strictEqual(tile.row, 38, "Row mismatch");
        assert.strictEqual(tile.column, 91, "Column mismatch");
        assert.strictEqual(tile.level, 7, "Level mismatch");
    });

    it("Check the tile parents", () => {
        const tile = { row: 3, column: 3, level: 2 };
        const parent_1 = utils.computeParentKey(tile, 1);
        assert.strictEqual(parent_1.row, 1, "Row mismatch");
        assert.strictEqual(parent_1.column, 1, "Column mismatch");
        assert.strictEqual(parent_1.level, 1, "Level mismatch");
        const parent_2 = utils.computeParentKey(tile, 2);
        assert.strictEqual(parent_2.row, 0, "Row mismatch");
        assert.strictEqual(parent_2.column, 0, "Column mismatch");
        assert.strictEqual(parent_2.level, 0, "Level mismatch");
        const parent_3 = utils.computeParentKey(tile, 3);
        assert.strictEqual(parent_3.row, 0, "Row mismatch");
        assert.strictEqual(parent_3.column, 0, "Column mismatch");
        assert.strictEqual(parent_3.level, 0, "Level mismatch");
    });

    it("Check the tile parents with delta 4", () => {
        const tile = { row: 3275, column: 8085, level: 13 };
        const parent = utils.computeParentKey(tile, 4);
        assert.strictEqual(parent.row, 204, "Row mismatch");
        assert.strictEqual(parent.column, 505, "Column mismatch");
        assert.strictEqual(parent.level, 9, "Level mismatch");
    });

    it("Subtile can be added to the root tile", () => {
        const rootTile = { row: 1, column: 1, level: 1 };
        const subTile = { row: 38, column: 91, level: 7 };
        const result = utils.addQuadKeys(rootTile, subTile);
        assert.strictEqual(result.row, 166, "Row mismatch");
        assert.strictEqual(result.column, 219, "Column mismatch");
        assert.strictEqual(result.level, 8, "Level mismatch");
    });

    it("Tile is not valid if the row/column is out of bounds", () => {
        const invalid_tile_1 = { row: 5, column: 1, level: 1 };
        assert.isFalse(utils.isValid(invalid_tile_1));

        const invalid_tile_2 = { row: -5, column: 1, level: 1 };
        assert.isFalse(utils.isValid(invalid_tile_2));

        const invalid_tile_3 = { row: 1, column: 5, level: 1 };
        assert.isFalse(utils.isValid(invalid_tile_3));

        const invalid_tile_4 = { row: 1, column: -5, level: 1 };
        assert.isFalse(utils.isValid(invalid_tile_4));
    });

    it("Tile is not valid if the level is out of bounds", () => {
        const invalid_tile_1 = { row: 0, column: 0, level: -1 };
        assert.isFalse(utils.isValid(invalid_tile_1));

        const invalid_tile_2 = { row: 0, column: 0, level: 100 };
        assert.isFalse(utils.isValid(invalid_tile_2));
    });
});
