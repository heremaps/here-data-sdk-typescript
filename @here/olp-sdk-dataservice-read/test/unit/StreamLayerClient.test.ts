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

import sinon = require("sinon");
import * as chai from "chai";
import sinonChai = require("sinon-chai");

import * as dataServiceRead from "../../lib";
import { settings } from "cluster";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("StreamLayerClient", () => {
    let sandbox: sinon.SinonSandbox;
    let streamLayerClient: dataServiceRead.StreamLayerClient;
    const mockedHRN = dataServiceRead.HRN.fromString(
        "hrn:here:data:::mocked-hrn"
    );
    const mockedLayerId = "mocked-layed-id";

    before(() => {
        sandbox = sinon.createSandbox();
        let settings = sandbox.createStubInstance(
            dataServiceRead.OlpClientSettings
        );
        const params = {
            catalogHrn: mockedHRN,
            layerId: mockedLayerId,
            settings: (settings as unknown) as dataServiceRead.OlpClientSettings
        };
        streamLayerClient = new dataServiceRead.StreamLayerClient(params);
    });

    it("Shoud be initialised", async () => {
        assert.isDefined(streamLayerClient);
        expect(streamLayerClient).be.instanceOf(
            dataServiceRead.StreamLayerClient
        );
        assert.equal(streamLayerClient.layerId, mockedLayerId);
        assert.equal(streamLayerClient.catalogHrn, mockedHRN);
        expect(streamLayerClient.settings).be.instanceOf(
            dataServiceRead.OlpClientSettings
        );
    });
});
