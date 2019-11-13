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

import sinon = require("sinon");
import * as chai from "chai";
import sinonChai = require("sinon-chai");

import * as dataServiceRead from "@here/olp-sdk-dataservice-read";
import { MetadataApi } from "@here/olp-sdk-dataservice-api";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("volatileLayerClient", () => {
    let sandbox: sinon.SinonSandbox;
    let getPartitionsStub: sinon.SinonStub;
    let getBaseUrlRequestStub: sinon.SinonStub;
    let volatileLayerClient: dataServiceRead.VolatileLayerClient;
    const mockedHRN = dataServiceRead.HRN.fromString(
        "hrn:here:data:::live-weather-na"
    );
    const mockedLayerId = "mocked-layed-id";
    const fakeURL = "http://fake-base.url";

    before(() => {
        sandbox = sinon.createSandbox();
        let settings = sinon.createStubInstance(
            dataServiceRead.OlpClientSettings
        );
        volatileLayerClient = new dataServiceRead.VolatileLayerClient(
            mockedHRN,
            mockedLayerId,
            (settings as unknown) as dataServiceRead.OlpClientSettings
        );
    });

    beforeEach(() => {
        getPartitionsStub = sandbox.stub(MetadataApi, "getPartitions");
        getBaseUrlRequestStub = sandbox.stub(
            dataServiceRead.RequestFactory,
            "getBaseUrl"
        );
        getBaseUrlRequestStub.callsFake(() => Promise.resolve(fakeURL));
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("Shoud be initialised", async () => {
        assert.isDefined(volatileLayerClient);
    });

    it("Should method getPartitions provide data", async () => {
        const mockedPartitions = {
            partitions: [
                {
                    version: 1,
                    partition: "42",
                    dataHandle: "3C3BE24A341D82321A9BA9075A7EF498.123"
                },
                {
                    version: 42,
                    partition: "42",
                    dataHandle: "3C3BE24A341D82321A9BA9075A7EF498.123"
                }
            ]
        };
        getPartitionsStub.callsFake(
            (builder: any, params: any): Promise<MetadataApi.Partitions> => {
                return Promise.resolve(mockedPartitions);
            }
        );
        
        const partitionsRequest = new dataServiceRead.PartitionsRequest();
        const partitions = await volatileLayerClient.getPartitions(partitionsRequest);

        assert.isDefined(partitions);
        expect(partitions).to.be.equal(mockedPartitions);
    });

});
