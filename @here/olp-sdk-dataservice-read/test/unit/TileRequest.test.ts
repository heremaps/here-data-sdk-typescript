/*
 * Copyright (C) 2020-2021 HERE Europe B.V.
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
import { FetchOptions } from "@here/olp-sdk-core";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("TileRequest", function() {
    const mockedQuadKey = {
        row: 1,
        column: 2,
        level: 3
    };

    const mockedBillingTag = "billing-tag";

    const request = new dataServiceRead.TileRequest();

    it("Should initialize", function() {
        assert.isDefined(request);
        expect(request).be.instanceOf(dataServiceRead.TileRequest);
    });

    it("Should get parameters with chain", async function() {
        request
            .withTileKey(mockedQuadKey)
            .withBillingTag(mockedBillingTag)
            .withFetchOption(FetchOptions.OnlineOnly);

        expect(request.getTileKey()).to.be.equal(mockedQuadKey);
        expect(request.getFetchOption()).to.be.equal(FetchOptions.OnlineOnly);
        expect(request.getBillingTag()).to.be.equal(mockedBillingTag);
    });
});
