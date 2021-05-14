/*
 * Copyright (C) 2021 HERE Europe B.V.
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
import sinon = require("sinon");

import { MultiPartUploadWrapper } from "@here/olp-sdk-dataservice-write";
import { OlpClientSettings } from "@here/olp-sdk-core";
import { FetchMock } from "../FetchMock";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("Multipart Upload Integration Test", function() {
  let fetchMock: FetchMock;
  let sandbox: sinon.SinonSandbox;
  let fetchStub: sinon.SinonStub;
  let settings: OlpClientSettings;

  settings = new OlpClientSettings({
    environment: "here",
    getToken: () => Promise.resolve("mocked-token")
  });
  const catalogHrn = "hrn:here:data:::mocked-hrn";
  const layerId = "mocked-layer-id";
  const dataSize = 74 * 1024 * 1024;
  const contentType = "text/plain";
  const data = Buffer.alloc(dataSize, 1);

  const headers = new Headers();
  headers.append("cache-control", "max-age=3600");

  before(function() {
    sandbox = sinon.createSandbox();
  });

  afterEach(function() {
    sandbox.restore();
  });

  beforeEach(function() {
    fetchMock = new FetchMock();
    fetchStub = sandbox.stub(global as any, "fetch");
    fetchStub.callsFake(fetchMock.fetch());

    settings = new OlpClientSettings({
      environment: "here",
      getToken: () => Promise.resolve("mocked-token")
    });
  });

  it("Should initialize", function() {
    const wrapper = new MultiPartUploadWrapper(
      {
        catalogHrn,
        layerId,
        handle: "mocked-dataHandle",
        blobVersion: "v1",
        contentType
      },
      settings
    );

    assert.isDefined(wrapper);
    expect(wrapper).be.instanceOf(MultiPartUploadWrapper);
  });

  it("Should upload to Blob V1", async function() {
    const mockedResponses = new Map();

    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::mocked-hrn/apis`,
      new Response(
        JSON.stringify([
          {
            api: "blob",
            version: "v1",
            baseURL: `https://mocked.api/blobstore/v1`,
            parameters: {}
          }
        ]),
        { headers }
      )
    );

    mockedResponses.set(
      `https://mocked.api/blobstore/v1/layers/mocked-layer-id/data/mocked-dataHandle/multiparts`,
      new Response(
        JSON.stringify({
          links: {
            status: {
              href: `https://mocked.api/multiparts/mocked-blob-token`,
              method: "GET"
            },
            delete: {
              href: `https://mocked.api/multiparts/mocked-blob-token`,
              method: "DELETE"
            },
            uploadPart: {
              href: `https://mocked.api/multiparts/mocked-blob-token/parts`,
              method: "POST"
            },
            complete: {
              href: `https://mocked.api/multiparts/mocked-blob-token`,
              method: "PUT"
            }
          }
        }),
        { headers }
      )
    );

    const partsHeaders = new Headers();
    partsHeaders.append("cache-control", "max-age=3600");
    partsHeaders.append("ETag", `${Math.random() * 10000}`);

    for (let partNumber = 0; partNumber < 16; partNumber++) {
      mockedResponses.set(
        `https://mocked.api/multiparts/mocked-blob-token/parts?partNumber=${partNumber}`,
        new Response(undefined, { headers: partsHeaders })
      );
    }

    mockedResponses.set(
      `https://mocked.api/multiparts/mocked-blob-token`,
      new Response(undefined, { headers })
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const wrapper = new MultiPartUploadWrapper(
      {
        catalogHrn,
        layerId,
        handle: "mocked-dataHandle",
        blobVersion: "v1",
        contentType
      },
      settings
    );

    await wrapper.upload(data);

    /**
     * Should be 18 calls:
     *  1 - lookup
     *  1 - start multipart
     *  15 - upload part
     *  1 - complete multipart
     */
    expect(fetchStub.callCount).to.be.equal(18);
  });

  it("Should upload to Blob V2", async function() {
    const mockedResponses = new Map();

    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::mocked-hrn/apis`,
      new Response(
        JSON.stringify([
          {
            api: "blob",
            version: "v2",
            baseURL: `https://mocked.api/blobstore/v2`,
            parameters: {}
          }
        ]),
        { headers }
      )
    );

    mockedResponses.set(
      `https://mocked.api/blobstore/v2/layers/mocked-layer-id/keys/mocked-key`,
      new Response(
        JSON.stringify({
          multipartToken: "mocked-multipartToken"
        }),
        { headers }
      )
    );

    for (let partNumber = 0; partNumber < 16; partNumber++) {
      mockedResponses.set(
        `https://mocked.api/blobstore/v2/layers/mocked-layer-id/keysMultipart/mocked-multipartToken/parts?partNumber=${partNumber}`,
        new Response(
          JSON.stringify({
            id: `${Math.random() * 10000}`
          }),
          { headers }
        )
      );
    }

    mockedResponses.set(
      `https://mocked.api/blobstore/v2/layers/mocked-layer-id/keysMultipart/mocked-multipartToken`,
      new Response(undefined, { headers })
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const wrapper = new MultiPartUploadWrapper(
      {
        catalogHrn,
        layerId,
        handle: "mocked-key",
        blobVersion: "v2",
        contentType
      },
      settings
    );

    await wrapper.upload(data);

    /**
     * Should be 18 calls:
     *  1 - lookup
     *  1 - start multipart
     *  15 - upload part
     *  1 - complete multipart
     */
    expect(fetchStub.callCount).to.be.equal(18);
  });
});
