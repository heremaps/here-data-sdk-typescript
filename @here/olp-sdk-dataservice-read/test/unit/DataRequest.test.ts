/*
 * Copyright (C) 2019-2021 HERE Europe B.V.
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

import * as chai from "chai";
import sinonChai = require("sinon-chai");

import { DataRequest } from "../../lib";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("DataRequest", function() {
    const billingTag = "billingTag";
    const mockedDataHandle = "43d76b9f-e934-40e5-9ce4-91d88a30f1c6";
    const mockedPartitionId = "123123123";
    const mockedQuadKey = {
        row: 42,
        column: 42,
        level: 42
    };

    it("Should initialize", function() {
        const dataRequest = new DataRequest();

        assert.isDefined(dataRequest);
        expect(dataRequest).be.instanceOf(DataRequest);
    });

    it("Should set parameters", function() {
        const dataRequest = new DataRequest();
        const dataRequestWithCatalogHrn = dataRequest.withDataHandle(
            mockedDataHandle
        );
        const dataRequestWithLayerId = dataRequest.withPartitionId(
            mockedPartitionId
        );
        const dataRequestWithBillTag = dataRequest.withBillingTag(billingTag);

        expect(dataRequestWithCatalogHrn.getDataHandle()).to.be.equal(
            mockedDataHandle
        );
        expect(dataRequestWithLayerId.getPartitionId()).to.be.equal(
            mockedPartitionId
        );
        expect(dataRequestWithBillTag.getBillingTag()).to.be.equal(billingTag);
    });

    it("Should get parameters with chain", function() {
        const dataRequest = new DataRequest()
            .withDataHandle(mockedDataHandle)
            .withPartitionId(mockedPartitionId)
            .withBillingTag(billingTag);

        expect(dataRequest.getDataHandle()).to.be.equal(mockedDataHandle);
        expect(dataRequest.getPartitionId()).to.be.equal(mockedPartitionId);
        expect(dataRequest.getBillingTag()).to.be.equal(billingTag);
    });
});
