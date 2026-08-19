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
import { VersionedLayerClient } from "@here/olp-sdk-dataservice-write";
import { HRN, OlpClientSettings } from "@here/olp-sdk-core";
import { FetchMock } from "../FetchMock";

describe("Versioned Layer Client for write", function () {
    let fetchMock: FetchMock;
    let fetchStub: any;
    let settings: OlpClientSettings;

    settings = new OlpClientSettings({
        environment: "here",
        getToken: () => Promise.resolve("mocked-token")
    });
    const catalogHrn = HRN.fromString("hrn:here:data:::mocked-hrn");

    const headers = new Headers();
    headers.append("cache-control", "max-age=3600");

    beforeAll(function () {});

    afterEach(function () {
        vi.restoreAllMocks();
    });

    beforeEach(function () {
        fetchMock = new FetchMock();
        fetchStub = vi.spyOn(global as any, "fetch");
        fetchStub.mockImplementation(fetchMock.fetch());

        settings = new OlpClientSettings({
            environment: "here",
            getToken: () => Promise.resolve("mocked-token")
        });
    });

    it("Should initialize", function () {
        const client = new VersionedLayerClient({
            catalogHrn,
            settings
        });

        assert.isDefined(client);
        expect(client).be.instanceOf(VersionedLayerClient);
    });

    it.skip("Should fetch the latest version of catalog", async function () {
        const mockedResponses = new Map();

        // Set the response from lookup api with the info about Metadata service.
        mockedResponses.set(
            `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::mocked-hrn/apis`,
            new Response(
                JSON.stringify([
                    {
                        api: "metadata",
                        version: "v1",
                        baseURL:
                            "https://metadata.data.api.platform.here.com/metadata/v1",
                        parameters: {
                            additionalProp1: "string",
                            additionalProp2: "string",
                            additionalProp3: "string"
                        }
                    }
                ]),
                { headers }
            )
        );

        const mockedVersion = {
            version: 123
        };

        mockedResponses.set(
            `https://metadata.data.api.platform.here.com/metadata/v1/versions/latest?startVersion=-1`,
            new Response(JSON.stringify(mockedVersion), { headers })
        );

        // Setup the fetch to use mocked responses.
        fetchMock.withMockedResponses(mockedResponses);

        const client = new VersionedLayerClient({
            catalogHrn,
            settings
        });
        let versionResponse = await client.getBaseVersion();

        assert.isDefined(versionResponse);

        expect(versionResponse).to.be.equal(123);

        /**
         * Should be two calls:
         *  1 - lookup
         *  2 - metadata
         */
        expect(fetchStub.mock.calls.length).to.be.equal(2);
    });
});
