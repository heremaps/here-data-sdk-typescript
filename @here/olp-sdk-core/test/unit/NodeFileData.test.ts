/*
 * Copyright (C) 2021 HERE Europe B.V.
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

import * as sinon from "sinon";
import * as chai from "chai";
import * as fs from "fs";
import sinonChai = require("sinon-chai");
import { NodeFileData } from "../../lib/utils/multipartupload-internal/NodeFileData";

chai.use(sinonChai);
const expect = chai.expect;

describe("NodeFileData", function() {
    let statSyncStub: sinon.SinonStub;
    let createReadStreamStub: sinon.SinonStub;
    const mockedData = Buffer.from("test-data", "utf8");

    beforeEach(() => {
        statSyncStub = sinon.stub(fs, "statSync").returns({ size: 9 } as any);
    });

    afterEach(() => {
        statSyncStub.restore();
        createReadStreamStub.restore();
    });

    it("readBytes", async function() {
        createReadStreamStub = sinon.stub(fs, "createReadStream").returns({
            on: (eventName: "string", cb: (buf?: string | Buffer) => void) => {
                const eventHandlers: { [key: string]: any } = {
                    error: () => "",
                    data: cb.bind(null, mockedData.slice(2, 5)),
                    close: cb
                };

                eventHandlers[eventName]();
            }
        } as any);

        const data = new NodeFileData("fake-filepath");
        const bytes = await data.readBytes(2, 5);

        expect(bytes.byteLength).eqls(3);
        expect(bytes.toString()).eqls("st-");
    });

    it("readBytes throws an error", async function() {
        createReadStreamStub = sinon.stub(fs, "createReadStream").returns({
            on: (eventName: "string", cb: (buf?: string | Buffer) => void) => {
                const eventHandlers: { [key: string]: any } = {
                    error: cb.bind(null, "test error")
                };

                eventHandlers[eventName]();
            }
        } as any);

        const data = new NodeFileData("fake-filepath");
        try {
            await data.readBytes(2, 5);
        } catch (error) {
            expect(error).equals("test error");
        }
    });

    it("size", function() {
        const data = new NodeFileData("fake-filepath");
        expect(data.size()).eqls(9);
    });
});
