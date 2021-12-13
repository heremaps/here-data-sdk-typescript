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

import { assert, expect } from "chai";
import { TileRequest, getTile } from "@here/olp-sdk-dataservice-read/lib";
import * as core from "@here/olp-sdk-core";
import { QueryApi } from "@here/olp-sdk-dataservice-api";
import sinon = require("sinon");
import { FetchOptions } from "@here/olp-sdk-core";

describe("getTile", function() {
    const request = new TileRequest();

    let sandbox: sinon.SinonSandbox;
    let quadTreeIndexStub: sinon.SinonStub;
    let olpClientSettingsStub: sinon.SinonStubbedInstance<core.OlpClientSettings>;

    let getBaseUrlRequestStub: sinon.SinonStub;
    const fakeURL = "http://fake-base.url";

    before(function() {
        sandbox = sinon.createSandbox();
    });

    beforeEach(function() {
        olpClientSettingsStub = sandbox.createStubInstance(
            core.OlpClientSettings
        );

        quadTreeIndexStub = sandbox.stub(QueryApi, "quadTreeIndex");

        getBaseUrlRequestStub = sandbox.stub(core.RequestFactory, "getBaseUrl");
        getBaseUrlRequestStub.callsFake(() => Promise.resolve(fakeURL));
    });

    afterEach(function() {
        sandbox.restore();
    });

    it("Should return 204 response if no quadTreeIndex data", async function() {
        const mockedQuadKeyTreeData = {
            subQuads: [],
            parentQuads: []
        };

        quadTreeIndexStub.callsFake(
            (builder: any, params: any): Promise<QueryApi.Index> => {
                return Promise.resolve(mockedQuadKeyTreeData);
            }
        );

        const response = await getTile(
            new TileRequest()
                .withTileKey({ row: 0, column: 0, level: 0 })
                .withFetchOption(FetchOptions.OnlineOnly),
            {
                settings: olpClientSettingsStub as any,
                catalogHrn: core.HRN.fromString("hrn:here:data:::mocked-hrn"),
                layerId: "mocked-layer-id",
                layerType: "versioned",
                catalogVersion: 123
            }
        );

        expect(response.status).eqls(204);
        expect(response.statusText).eqls("No Content");
    });

    it("Should throw an error if not tile key", async function() {
        const tile = await getTile(request, {
            settings: olpClientSettingsStub as any,
            catalogHrn: core.HRN.fromString("hrn:here:data:::mocked-hrn"),
            layerId: "mocked-layer-id",
            layerType: "versioned"
        }).catch(err => err.message);
        assert.isTrue(tile === "Please provide correct QuadKey");
    });
});
