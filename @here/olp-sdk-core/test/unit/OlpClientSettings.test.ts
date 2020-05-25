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
import * as lib from "@here/olp-sdk-core";

chai.use(sinonChai);
const expect = chai.expect;

class MockedKeyValueCache {
    private readonly cache: Map<string, string>;
    constructor() {
        this.cache = new Map();
        this.cache.set("test-cached-item-key", "test-cached-value");
    }

    get(key: string) {
        return this.cache.get(key);
    }
}

class MockedDataStoreDownloadManager {
    public async download(url: string, init?: RequestInit) {
        return Promise.resolve("test-download-manager-downloaded-result");
    }
}

class MockedCustomDataStoreDownloadManager {
    public async download(url: string, init?: RequestInit) {
        return Promise.resolve(
            new Response("test-custom-download-manager-downloaded-result")
        );
    }
}

describe("OlpClientSettings", () => {
    let KeyValueCacheStub: sinon.SinonStub;
    let DataStoreDownloadManagerStub: sinon.SinonStub;

    let sandbox: sinon.SinonSandbox;

    before(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    beforeEach(() => {
        KeyValueCacheStub = sandbox.stub(lib, "KeyValueCache");
        KeyValueCacheStub.callsFake((cache, hrn) => new MockedKeyValueCache());

        DataStoreDownloadManagerStub = sandbox.stub(
            lib,
            "DataStoreDownloadManager"
        );
        DataStoreDownloadManagerStub.callsFake(
            (cache, hrn) => new MockedDataStoreDownloadManager()
        );
    });

    it("Should be configured with correct params and default download manager", async () => {
        const settings = new lib.OlpClientSettings({
            environment: "test-env",
            getToken: () => Promise.resolve("test-token")
        });

        expect(settings.cache.get("test-cached-item-key")).equal(
            "test-cached-value"
        );
        expect(settings.environment).equal("test-env");

        const downloadedResult = await settings.downloadManager.download(
            "fake-url"
        );
        expect(downloadedResult).equal(
            "test-download-manager-downloaded-result"
        );

        const tokenStr = await settings.token();
        expect(tokenStr).equal("test-token");
    });

    it("Should be configured with correct params and custom download manager", async () => {
        const settings = new lib.OlpClientSettings({
            environment: "test-env",
            getToken: () => Promise.resolve("test-token"),
            dm: new MockedCustomDataStoreDownloadManager()
        });

        const downloadedResult = await settings.downloadManager.download(
            "fake-url"
        );
        expect(await downloadedResult.text()).equal(
            "test-custom-download-manager-downloaded-result"
        );
    });
});
