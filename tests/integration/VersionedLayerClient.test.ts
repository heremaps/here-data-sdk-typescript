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

import * as sinon from "sinon";
import * as chai from "chai";
import sinonChai = require("sinon-chai");
import { VersionedLayerClient, OlpClientSettings, HRN, PartitionsRequest } from "@here/olp-sdk-dataservice-read";
import { fetchMock } from "./fetchMock";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;


describe("VersionedLayerClient", () => {

    let sandbox: sinon.SinonSandbox;
    let fetchStub: sinon.SinonStub;

    before(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    beforeEach(() => {
        fetchStub = sandbox.stub(global as any, "fetch");
        fetchStub.callsFake(fetchMock);
    });

    it("Shoud be initialised with settings", async () => {
        const settings = new OlpClientSettings({
            environment: "here",
            "getToken": () => Promise.resolve("test-token-string")
        });
        const layerClient = new VersionedLayerClient(HRN.fromString("hrn:here:data:::test-hrn"), "test-layed-id", settings);
        assert.isDefined(layerClient);
        expect(layerClient).to.be.instanceOf(VersionedLayerClient);
    });

    it("Shoud be fetched partitions metadata for specific IDs", async () => {
        const settings = new OlpClientSettings({
            environment: "here",
            "getToken": () => Promise.resolve("test-token-string")
        });
        const layerClient = new VersionedLayerClient(HRN.fromString("hrn:here:data:::test-hrn"), "test-layed-id", settings);
        const request = new PartitionsRequest().withPartitionIds(["100", "1000"]);

        const partitions = await layerClient.getPartitions(request);
        assert.isDefined(partitions);

        expect(partitions.partitions[0].dataHandle).to.be.equal("1b2ca68f-d4a0-4379-8120-cd025640510c");
        expect(partitions.partitions[1].dataHandle).to.be.equal("1b2ca68f-d4a0-4379-8120-cd025640578e");
        expect(partitions.partitions[2]).to.be.undefined;
    });

    it("Shoud be fetched partitions all metadata", async () => {
        const settings = new OlpClientSettings({
            environment: "here",
            "getToken": () => Promise.resolve("test-token-string")
        });
        const layerClient = new VersionedLayerClient(HRN.fromString("hrn:here:data:::test-hrn"), "test-layed-id", settings);
        const request = new PartitionsRequest();

        const partitions = await layerClient.getPartitions(request);
        assert.isDefined(partitions);

        expect(partitions.partitions[0].dataHandle).to.be.equal("1b2ca68f-d4a0-4379-8120-cd025640510c");
        expect(partitions.partitions[1].dataHandle).to.be.equal("1b2ca68f-d4a0-4379-8120-cd025640578e");
        expect(partitions.partitions.length).to.be.equal(4);
    });


});

