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

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("TileRequest", () => {
    const mockedHRN = dataServiceRead.HRN.fromString(
        "hrn:here:data:::mocked-hrn"
    );
    const mockedLayerId = "mocked-layed-id";
    const mockedQuadKey = {
        row: 1,
        column: 2,
        level: 3
    };

    const mockedBillingTag = "billing-tag";

    const mockedSettings: dataServiceRead.OlpClientSettings = new dataServiceRead.OlpClientSettings(
        {
            environment: "test-env",
            getToken: () => Promise.resolve("test-token")
        }
    );

    const tileRequestParams: dataServiceRead.TileRequestParams = {
        catalogHrn: mockedHRN,
        layerId: mockedLayerId,
        layerType: "versioned",
        settings: mockedSettings,
        catalogVersion: 12
    };

    const request = new dataServiceRead.TileRequest(tileRequestParams);

    it("Should initialize", () => {
        assert.isDefined(request);
        expect(request).be.instanceOf(dataServiceRead.TileRequest);
    });

    it("Should get parameters with chain", async () => {
        request
            .withTileKey(mockedQuadKey)
            .withBillingTag(mockedBillingTag)
            .withFetchOption(dataServiceRead.FetchOptions.OnlineOnly);

        expect(request.getTileKey()).to.be.equal(mockedQuadKey);
        expect(request.getFetchOption()).to.be.equal(
            dataServiceRead.FetchOptions.OnlineOnly
        );
        expect(request.getBillingTag()).to.be.equal(mockedBillingTag);
        expect(request.getParams()).to.be.equal(tileRequestParams);
        expect(await request.getCatalogVersion()).to.be.equal(12);
    });
});
