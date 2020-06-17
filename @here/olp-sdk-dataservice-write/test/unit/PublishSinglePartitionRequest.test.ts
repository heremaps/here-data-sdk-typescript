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

import * as chai from "chai";
import sinonChai = require("sinon-chai");
import { PublishSinglePartitionRequest } from "@here/olp-sdk-dataservice-write";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("PublishSinglePartitionRequest", () => {
    it("Should initialize", () => {
        const request = new PublishSinglePartitionRequest();

        assert.isDefined(request);
        expect(request).be.instanceOf(PublishSinglePartitionRequest);
    });

    it("Should set and get parameters", () => {
        const mockedPublicationId = "publication-id";
        const mockedLayerId = "mocked-layer-id";
        const mockedData = Buffer.from("mocked-data", "utf-8");
        const mockedMetadata = {
            partition: "partition-1",
            checksum: "checksum-1",
            compressedDataSize: 123,
            dataSize: 321,
            data: "data-1",
            dataHandle: "dataHandle-1",
            timestamp: 1234567890
        };
        const mockedBillingTag = "mocked-billing-tag";

        const request = new PublishSinglePartitionRequest()
            .withPublicationId(mockedPublicationId)
            .withLayerId(mockedLayerId)
            .withData(mockedData)
            .withMetaData(mockedMetadata)
            .withBillingTag(mockedBillingTag);

        expect(request.getPublicationId()).to.be.equal(mockedPublicationId);
        expect(request.getLayerId()).to.be.equal(mockedLayerId);
        expect(request.getData()).to.be.equal(mockedData);
        expect(request.getMetadata()).to.be.equal(mockedMetadata);
        expect(request.getBillingTag()).to.be.equal(mockedBillingTag);
    });
});
