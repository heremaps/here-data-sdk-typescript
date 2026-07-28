/*
 * Copyright (C) 2020-2026 HERE Europe B.V.
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

import {
    afterAll,
    afterEach,
    beforeAll,
    beforeEach,
    describe,
    expect,
    it,
    vi,
    assert
} from "vitest";
import * as lib from "@here/olp-sdk-core";
import * as KeyValueCacheModule from "../../lib/cache/KeyValueCache";
import * as DataStoreDownloadManagerModule from "../../lib/utils/DataStoreDownloadManager";

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

describe("OlpClientSettings", function () {
    let KeyValueCacheStub: any;
    let DataStoreDownloadManagerStub: any;

    beforeAll(function () {});

    afterEach(function () {
        vi.restoreAllMocks();
    });

    beforeEach(function () {
        KeyValueCacheStub = vi
            .spyOn(KeyValueCacheModule, "KeyValueCache")
            .mockReturnValue(undefined as any);
        KeyValueCacheStub.mockImplementation(function () {
            return new MockedKeyValueCache();
        });

        DataStoreDownloadManagerStub = vi
            .spyOn(DataStoreDownloadManagerModule, "DataStoreDownloadManager")
            .mockReturnValue(undefined as any);
        DataStoreDownloadManagerStub.mockImplementation(function () {
            return new MockedDataStoreDownloadManager();
        });
    });

    it("Should be configured with correct params and default download manager", async function () {
        const settings = new lib.OlpClientSettings({
            environment: "test-env",
            getToken: () => Promise.resolve("test-token")
        });

        expect(settings.cache.get("test-cached-item-key")).equal(
            "test-cached-value"
        );
        expect(settings.environment).equal("test-env");

        const downloadedResult =
            await settings.downloadManager.download("fake-url");
        expect(downloadedResult).equal(
            "test-download-manager-downloaded-result"
        );

        const tokenStr = await settings.token();
        expect(tokenStr).equal("test-token");
    });

    it("Should be configured with correct params and custom download manager", async function () {
        const settings = new lib.OlpClientSettings({
            environment: "test-env",
            getToken: () => Promise.resolve("test-token"),
            dm: new MockedCustomDataStoreDownloadManager()
        });

        const downloadedResult =
            await settings.downloadManager.download("fake-url");
        expect(await downloadedResult.text()).equal(
            "test-custom-download-manager-downloaded-result"
        );
    });
});
