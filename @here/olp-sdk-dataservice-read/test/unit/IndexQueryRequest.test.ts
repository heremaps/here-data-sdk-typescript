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

import { IndexQueryRequest } from "../../lib";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("IndexQueryRequest", () => {
    const mockedQuery = "ingestionTime>1552341200000;";

    it("Should initialize", () => {
        const indexQueryRequest = new IndexQueryRequest();

        assert.isDefined(indexQueryRequest);
        expect(indexQueryRequest).be.instanceOf(IndexQueryRequest);
    });

    it("Should set parameters", () => {
        const indexQueryRequest = new IndexQueryRequest();
        const indexQueryRequestWithHuge = indexQueryRequest.withHugeResponse(true);
        const indexQueryRequestWithQuery = indexQueryRequest.withQueryString(mockedQuery);

        expect(indexQueryRequestWithHuge.getHugeResponse()).to.be.equal(true);
        expect(indexQueryRequestWithQuery.getQueryString()).to.be.equal(mockedQuery);
    });

    it("Should set parameters with chain", () => {
        const indexQueryRequest = new IndexQueryRequest()
            .withHugeResponse(false)
            .withQueryString(mockedQuery);

        expect(indexQueryRequest.getHugeResponse()).to.be.equal(false);
        expect(indexQueryRequest.getQueryString()).to.be.equal(mockedQuery);
    });
});
