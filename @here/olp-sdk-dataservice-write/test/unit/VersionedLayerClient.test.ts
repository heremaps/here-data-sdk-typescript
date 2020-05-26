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

import { VersionedLayerClient } from "@here/olp-sdk-dataservice-write";
import sinon = require("sinon");
import { MetadataApi } from "@here/olp-sdk-dataservice-api";
import { OlpClientSettings, RequestFactory } from "@here/olp-sdk-core";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;
class MockedHrn {
    constructor(private readonly hrn: string) {}
    toString(): string {
        return this.hrn;
    }
}

describe("VersionedLayerClient write", () => {
    let sandbox: sinon.SinonSandbox;
    let getVersionStub: sinon.SinonStub;
    let getBaseUrlRequestStub: sinon.SinonStub;
    let settings: OlpClientSettings;

    const fakeURL = "http://fake-base.url";
    const catalogHrn = new MockedHrn("hrn:here:data:::mocked-hrn") as any;

    before(() => {
        sandbox = sinon.createSandbox();
    });

    beforeEach(() => {
        settings = sandbox.createStubInstance(OlpClientSettings) as any;

        getVersionStub = sandbox.stub(MetadataApi, "latestVersion");

        getBaseUrlRequestStub = sandbox.stub(RequestFactory, "getBaseUrl");
        getBaseUrlRequestStub.callsFake(() => Promise.resolve(fakeURL));
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("Should initialize", () => {
        const client = new VersionedLayerClient({
            catalogHrn,
            settings
        });

        assert.isDefined(client);
        expect(client).be.instanceOf(VersionedLayerClient);
    });

    it("Should method getBaseVersion provide latest version", async () => {
        const mockedVersion = {
            version: 123
        };

        getVersionStub.callsFake(
            (): Promise<MetadataApi.VersionResponse> => {
                return Promise.resolve(mockedVersion);
            }
        );

        const client = new VersionedLayerClient({
            catalogHrn,
            settings
        });

        const version = await client.getBaseVersion();

        assert.isDefined(version);
        expect(version).to.be.equal(mockedVersion.version);
    });
});
