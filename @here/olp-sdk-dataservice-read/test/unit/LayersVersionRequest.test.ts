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
import { LayersVersionRequest } from "../../lib";

chai.use(sinonChai);
const assert = chai.assert;
const expect = chai.expect;

describe("LayersVersionRequest", () => {
    const billingTag = "billingTag";
    const mockedVersion1 = 5;
    const mockedVersion2 = 6;

    it("Should initialize", () => {
        const layersVersionRequest = new LayersVersionRequest();

        assert.isDefined(layersVersionRequest);
        expect(layersVersionRequest).be.instanceOf(LayersVersionRequest);
    });

    it("Should set version", () => {
        const layersVersionRequest = new LayersVersionRequest();
        const layersVersionRequestWithVersion = layersVersionRequest.withVersion(
            mockedVersion1
        );
        const layersVersionRequestWithBillTag = layersVersionRequest.withBillingTag(
            billingTag
        );

        expect(layersVersionRequestWithVersion.getVersion()).to.be.equal(
            mockedVersion1
        );
        expect(layersVersionRequestWithBillTag.getBillingTag()).to.be.equal(
            billingTag
        );
    });

    it("Should set version with chain", () => {
        const layersVersionRequest = new LayersVersionRequest()
            .withVersion(mockedVersion1)
            .withVersion(mockedVersion2)
            .withBillingTag(billingTag);

        expect(layersVersionRequest.getVersion()).to.be.equal(mockedVersion2);
        expect(layersVersionRequest.getBillingTag()).to.be.equal(billingTag);
    });
});
