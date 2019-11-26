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

import { HRN, QuadTreeIndexRequest } from "../../lib";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("QuadTreeIndexRequest", () => {
    const billingTag = "billingTag";
    const mockedHRN = HRN.fromString("hrn:here:data:::mocked-hrn");
    const mockedLayerId = "mocked-layed-id";
    const mockedVersion = 42;
    const mockedLayerType = "volatile";
    const mockedDepth = 3;
    const mockedQuadKey = {
        row: 1,
        column: 2,
        level: 3
    };

    it("Should initialize", () => {
        const quadTreeRequest = new QuadTreeIndexRequest(
            mockedHRN,
            mockedLayerId,
            mockedLayerType
        );

        assert.isDefined(quadTreeRequest);
        expect(quadTreeRequest).be.instanceOf(QuadTreeIndexRequest);
        expect(quadTreeRequest.getCatalogHrn()).to.be.equal(mockedHRN);
        expect(quadTreeRequest.getLayerId()).to.be.equal(mockedLayerId);
        expect(quadTreeRequest.getLayerType()).to.be.equal(mockedLayerType);
    });

    it("Should set parameters", () => {
        const quadTreeRequest = new QuadTreeIndexRequest(
            mockedHRN,
            mockedLayerId,
            mockedLayerType
        );
        const quadTreeRequestWithVersion = quadTreeRequest.withVersion(mockedVersion);
        const quadTreeRequestWithQuadKey = quadTreeRequest.withQuadKey(mockedQuadKey);
        const quadTreeRequestWithBillTag = quadTreeRequest.withBillingTag(billingTag);

        expect(quadTreeRequestWithVersion.getVersion()).to.be.equal(mockedVersion);
        expect(quadTreeRequestWithQuadKey.getQuadKey()).to.be.equal(mockedQuadKey);
        expect(quadTreeRequestWithBillTag.getBillingTag()).to.be.equal(billingTag);
    });

    it("Should get parameters with chain", () => {
        const quadTreeRequest = new QuadTreeIndexRequest(
                mockedHRN,
                mockedLayerId,
                mockedLayerType
            )
            .withVersion(mockedVersion)
            .withQuadKey(mockedQuadKey)
            .withBillingTag(billingTag);

        expect(quadTreeRequest.getVersion()).to.be.equal(mockedVersion);
        expect(quadTreeRequest.getQuadKey()).to.be.equal(mockedQuadKey);
        expect(quadTreeRequest.getBillingTag()).to.be.equal(billingTag);
    });
});
