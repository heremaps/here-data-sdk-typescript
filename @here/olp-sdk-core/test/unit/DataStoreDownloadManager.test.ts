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
import { DataStoreDownloadManager } from "@here/olp-sdk-core";

chai.use(sinonChai);
const assert = chai.assert;
const expect = chai.expect;

describe("DataStoreDownloadManager", function() {
    const fakeDataUrl = `https://download.example.url`;

    function createMockDownloadResponse() {
        const mock = {
            type: "aaa",
            status: 200,
            statusText: "success",
            ok: true,
            headers: [],
            arrayBuffer: sinon.stub(),
            json: sinon.stub(),
            text: sinon.stub()
        };
        return mock;
    }

    it("#download handles successful download response", async function() {
        // Arrange
        const mock = createMockDownloadResponse();
        const fetchStub = sinon.stub().resolves(mock);
        const downloadMgr = new DataStoreDownloadManager(fetchStub, 5);

        // Act
        const response = await downloadMgr.download(fakeDataUrl);

        // Assert
        assert.isTrue(fetchStub.calledOnce);
        assert.isTrue(fetchStub.getCall(0).args[0] === fakeDataUrl);
        assert.deepEqual(response.statusText, "success");
    });

    it("#download handles HTTP 503 status response max retries", async function() {
        // Arrange
        const mock = createMockDownloadResponse();
        mock.status = 503;
        mock.ok = false;
        mock.statusText = "Service unavailable!";
        mock.json.resolves({ statusText: "Service unavailable!" });
        const fetchStub = sinon.stub().resolves(mock);
        const downloadMgr = new DataStoreDownloadManager(fetchStub, 3);

        // Act
        const downloadResponse = await downloadMgr
            .download(fakeDataUrl)
            .catch(error => {
                // Assert
                assert(fetchStub.called);

                // callCount should be 4. (1 first call + 3 retries)
                assert(fetchStub.callCount === 4);
                assert(fetchStub.getCall(0).args[0] === fakeDataUrl);
                assert.equal(error.status, 503);
                assert.equal(error.message, "Service unavailable!");
            });
    });

    /*
     * Note, DataStoreDownloadManager limits the number of html headers sent to MAX_PARALLEL_DOWNLOADS, but
     * will allow more then MAX_PARALLEL_DOWNLOADS of parallel download under the hood.
     */
    it("#download performs download with maxParallelDownloads exceeded", async function() {
        // Arrange
        const MAX_PARALLEL_DOWNLOADS = 16;
        const CALLS_NUMBER = 32;

        const mock = createMockDownloadResponse();
        mock.json.resolves({ version: "4" });
        const fetchStub = sinon.stub().resolves(mock);
        const downloadMgr = new DataStoreDownloadManager(fetchStub, 5);

        // Act
        const downloadResponses = new Array<Promise<Response>>();
        for (let i = 0; i < CALLS_NUMBER; i++) {
            downloadResponses[i] = downloadMgr.download(fakeDataUrl);
        }

        await Promise.all(
            downloadResponses.map(downloadRespPromise => {
                return downloadRespPromise.then(downloadResp => {
                    return downloadResp.arrayBuffer();
                });
            })
        );

        // Assert
        assert(fetchStub.callCount === CALLS_NUMBER);
        assert(
            fetchStub.getCall(MAX_PARALLEL_DOWNLOADS - 1).args[0] ===
                fakeDataUrl
        );
    });

    it("Aborting request", async function() {
        const mockedFetch = async (
            input: RequestInfo,
            init?: any
        ): Promise<Response> => {
            return !init.signal.aborted
                ? Promise.resolve(new Response())
                : Promise.reject(`aborted`);
        };
        const dm = new DataStoreDownloadManager(mockedFetch, 1);
        const abortController = new AbortController();

        abortController.abort();
        await dm
            .download(fakeDataUrl, { signal: abortController.signal })
            .catch(error => {
                return assert.equal(error, "aborted");
            });
    });
});
