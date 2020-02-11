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

import * as dataServiceRead from "../../lib";
import { StreamApi } from "@here/olp-sdk-dataservice-api";
import { SubscribeRequest } from "../../lib";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("StreamLayerClient", () => {
    let sandbox: sinon.SinonSandbox;
    let getBaseUrlRequestStub: sinon.SinonStub;
    let subscribeStub: sinon.SinonStub;
    let streamLayerClient: dataServiceRead.StreamLayerClient;
    const mockedHRN = dataServiceRead.HRN.fromString(
        "hrn:here:data:::mocked-hrn"
    );
    const mockedLayerId = "mocked-layed-id";
    const fakeURL = "http://fake-base.url";

    before(() => {
        sandbox = sinon.createSandbox();
        let settings = sandbox.createStubInstance(
            dataServiceRead.OlpClientSettings
        );
        const params = {
            catalogHrn: mockedHRN,
            layerId: mockedLayerId,
            settings: (settings as unknown) as dataServiceRead.OlpClientSettings
        };
        streamLayerClient = new dataServiceRead.StreamLayerClient(params);
    });

    beforeEach(() => {
        subscribeStub = sandbox.stub(StreamApi, "subscribe");
        getBaseUrlRequestStub = sandbox.stub(
            dataServiceRead.RequestFactory,
            "getBaseUrl"
        );
        getBaseUrlRequestStub.callsFake(() => Promise.resolve(fakeURL));
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("Shoud be initialised", async () => {
        assert.isDefined(streamLayerClient);
        expect(streamLayerClient).be.instanceOf(
            dataServiceRead.StreamLayerClient
        );
        assert.equal(streamLayerClient.layerId, mockedLayerId);
        assert.equal(streamLayerClient.catalogHrn, mockedHRN);
        expect(streamLayerClient.settings).be.instanceOf(
            dataServiceRead.OlpClientSettings
        );
    });

    it("Should subscribe method post data and return url and id", async () => {
        const mockResponse = {
            nodeBaseURL: "https://mock-url/hrn/id",
            subscriptionId: "-9141392.f96875c-9422-4df4-b5ff-41a4f459"
        };
        subscribeStub.callsFake(
            (
                builder: any,
                params: any
            ): Promise<StreamApi.ConsumerSubscribeResponse> => {
                return Promise.resolve(mockResponse);
            }
        );

        const request = new SubscribeRequest();
        const subscription = await streamLayerClient.subscribe(request);

        assert.isDefined(subscription);
        expect(subscription.nodeBaseURL).to.be.equal(mockResponse.nodeBaseURL);
        expect(subscription.subscriptionId).to.be.equal(
            mockResponse.subscriptionId
        );
    });

    it("Should be aborted fetching by abort signal", async () => {
        const mockResponse = {
            nodeBaseURL: "https://mock-url/hrn/id",
            subscriptionId: "-9141392.f96875c-9422-4df4-b5ff-41a4f459"
        };

        subscribeStub.callsFake(
            (
                builder: any,
                params: any
            ): Promise<StreamApi.ConsumerSubscribeResponse> => {
                return builder.abortSignal.aborted
                    ? Promise.reject("AbortError")
                    : Promise.resolve(mockResponse);
            }
        );

        const request = new SubscribeRequest();
        const abortController = new AbortController();

        streamLayerClient
            .subscribe(
                (request as unknown) as dataServiceRead.SubscribeRequest,
                abortController.signal
            )
            .then()
            .catch((err: any) => {
                assert.strictEqual(err, "AbortError");
                assert.isTrue(abortController.signal.aborted);
            });

        abortController.abort();
    });

    it("Should baseUrl error be handled", async () => {
        const mockedErrorResponse = "Bad response";
        const request = new SubscribeRequest();

        getBaseUrlRequestStub.callsFake(() =>
            Promise.reject({
                status: 400,
                statusText: "Bad response"
            })
        );

        const subscription = await streamLayerClient
            .subscribe(request)
            .catch(error => {
                assert.isDefined(error);
                assert.equal(mockedErrorResponse, error.statusText);
            });
    });
});
