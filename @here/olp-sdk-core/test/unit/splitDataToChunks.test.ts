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

// tslint:disable:only-arrow-functions
//    Mocha discourages using arrow functions, see https://mochajs.org/#arrow-functions

import { expect } from "chai";
import { splitDataToChunks } from "@here/olp-sdk-core";

describe("splitDataToChunks", function() {
    it("Should be splitted to 4 chunks", function() {
        const data = Buffer.from("Test txt data");
        const chunkSize = 3;
        const chunks = splitDataToChunks(data, chunkSize) as Buffer[];

        expect(chunks.length).equals(5);
        expect(chunks[0].length).equals(3);
        expect(chunks[1].length).equals(3);
        expect(chunks[2].length).equals(3);
        expect(chunks[3].length).equals(3);
        expect(chunks[4].length).equals(1);
        expect(chunks[5] === undefined).equal(true);

        const joinedBackData = Buffer.concat(chunks).toString();
        expect(joinedBackData).equals("Test txt data");
    });
});
