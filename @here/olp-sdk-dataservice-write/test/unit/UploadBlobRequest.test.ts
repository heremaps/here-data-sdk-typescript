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
import { UploadBlobRequest } from "@here/olp-sdk-dataservice-write";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("UploadBlobRequest", function() {
    it("Should initialize", function() {
        const request = new UploadBlobRequest();

        assert.isDefined(request);
        expect(request).be.instanceOf(UploadBlobRequest);
    });

    it("Should set and get parameters", function() {
        const mockedLayerId = "mocked-layer-id";
        const mockedBillingTag = "mocked-billing-tag";
        const mockedContentType = "plain/text";
        const mockedData = Buffer.alloc(10);
        const mockedDatahandle = "mocked-datahandle";
        const mockedContentEncoding = "gzip";

        const request = new UploadBlobRequest()
            .withDataHandle(mockedDatahandle)
            .withLayerId(mockedLayerId)
            .withData(mockedData)
            .withContentType(mockedContentType)
            .withContentEncoding(mockedContentEncoding)
            .withBillingTag(mockedBillingTag);

        expect(request.getDataHandle()).to.be.equal(mockedDatahandle);
        expect(request.getLayerId()).to.be.equal(mockedLayerId);
        expect(request.getData()).to.be.equal(mockedData);
        expect(request.getContentType()).to.be.equal(mockedContentType);
        expect(request.getContentEncoding()).to.be.equal(mockedContentEncoding);
        expect(request.getBillingTag()).to.be.equal(mockedBillingTag);
    });
});
