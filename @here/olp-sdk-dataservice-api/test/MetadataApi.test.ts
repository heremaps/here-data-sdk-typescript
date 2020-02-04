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

import { MetadataApi } from "@here/olp-sdk-dataservice-api";
import { RequestBuilder, UrlBuilder } from "../lib/RequestBuilder";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("MetadataApi", () => {
    it("Should getChanges provide data", async () => {
        const mockedResponse = {
            partitions: [
                {
                    version: 1,
                    partition: "13",
                    dataHandle: "3C3BE24A341D82321A9BA9075A7EF498.123"
                },
                {
                    version: 42,
                    partition: "42",
                    dataHandle: "3C3BE24A341D82321A9BA9075A7EF150.042"
                }
            ]
        };
        const params = {
            layerId: "mocked-id",
            startVersion: 1,
            endVersion: 42,
            range: "mocked-range"
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/layers/mocked-id/changes?startVersion=1&endVersion=42"
                );
                expect(options.method).to.be.equal("GET");
                expect(options.headers["Range"]).to.be.equal(params.range);
                return Promise.resolve(mockedResponse);
            }
        };
        const changes = await MetadataApi.getChanges(
            (builder as unknown) as RequestBuilder,
            params
        );
        assert.equal(changes.partitions.length, 2);
        expect(changes).to.be.equal(mockedResponse);
    });

    it("Should getLayerVersions provide data", async () => {
        const mockedResponse = {
            layerVersions: [
                {
                    version: 1,
                    timestamp: 1231321214134
                },
                {
                    version: 2,
                    timestamp: 1134134534216
                }
            ],
            version: 42
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/layerVersions?version=42"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve(mockedResponse);
            }
        };
        const versions = await MetadataApi.getLayerVersions(
            (builder as unknown) as RequestBuilder,
            {
                version: 42
            }
        );
        assert.equal(versions.layerVersions.length, 2);
        expect(versions.version).to.be.equal(mockedResponse.version);
    });

    it("Should getPartitions provide data", async () => {
        const mockedResponse = {
            partitions: [
                {
                    version: 1,
                    partition: "13",
                    dataHandle: "3C3BE24A341D82321A9BA9075A7EF498.123"
                },
                {
                    version: 42,
                    partition: "42",
                    dataHandle: "3C3BE24A341D82321A9BA9075A7EF150.042"
                }
            ]
        };
        const params = {
            layerId: "mocked-id",
            version: 42,
            range: "mocked-range"
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/layers/mocked-id/partitions?version=42"
                );
                expect(options.method).to.be.equal("GET");
                expect(options.headers["Range"]).to.be.equal(params.range);
                return Promise.resolve(mockedResponse);
            }
        };
        const changes = await MetadataApi.getPartitions(
            (builder as unknown) as RequestBuilder,
            params
        );
        assert.equal(changes.partitions.length, 2);
        expect(changes).to.be.equal(mockedResponse);
    });

    it("Should latestVersion provide data", async () => {
        const mockedStartedVersion = 1;
        const mockedResponse = {
            version: 42
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/versions/latest?startVersion=1"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve(mockedResponse);
            }
        };
        const version = await MetadataApi.latestVersion(
            (builder as unknown) as RequestBuilder,
            {
                startVersion: mockedStartedVersion
            }
        );
        expect(version.version).to.be.equal(mockedResponse.version);
    });

    it("Should listVersions provide data", async () => {
        const mockedStartedVersion = 1;
        const mockedEndVersion = 42;
        const mockedResponse = {
            versions: [
                {
                    version: 1,
                    timestamp: 1231321214134
                },
                {
                    version: 2,
                    timestamp: 1134134534216
                }
            ]
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/versions?startVersion=1&endVersion=42"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve(mockedResponse);
            }
        };
        const versions = await MetadataApi.listVersions(
            (builder as unknown) as RequestBuilder,
            {
                startVersion: mockedStartedVersion,
                endVersion: mockedEndVersion
            }
        );
        assert.equal(versions.versions.length, 2);
        expect(versions).to.be.equal(mockedResponse);
    });

    it("Should minimumVersion provide data", async () => {
        const mockedResponse = {
            version: 42
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/versions/minimum"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve(mockedResponse);
            }
        };
        const version = await MetadataApi.minimumVersion(
            (builder as unknown) as RequestBuilder,
            {}
        );
        expect(version.version).to.be.equal(mockedResponse.version);
    });
});
