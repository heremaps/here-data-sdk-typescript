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

import {
  ArtifactClient,
  OlpClientSettings
} from "@here/olp-sdk-dataservice-read";
import * as dataServiceRead from "@here/olp-sdk-dataservice-read";
import * as dataServiceApi from "@here/olp-sdk-dataservice-api";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("ArtifactClient", () => {
  class ArtifactClientTest extends ArtifactClient {
    constructor(settings: OlpClientSettings) {
      super(settings);
    }

    public async getSchemaDetails(
      schemaDetailsRequest: dataServiceRead.SchemaDetailsRequest
    ): Promise<dataServiceApi.ArtifactApi.GetSchemaResponse> {
      return {
        variants: [
          {
            id: "test",
            url: "test"
          }
        ]
      };
    }

    public async getSchema(
      schemaRequest: dataServiceRead.SchemaRequest
    ): Promise<ArrayBuffer> {
      return new ArrayBuffer(162);
    }
  }

  let settings = new OlpClientSettings({
    environment: "here",
    getToken: () => Promise.resolve("mocked-token")
  });

  it("Shoud be initialized with arguments", async () => {
    const artifactClient = new ArtifactClient(settings);
    assert.isDefined(artifactClient);

    expect(artifactClient).to.be.instanceOf(ArtifactClient);
    assert.isDefined(artifactClient.getSchemaDetails);
    assert.isDefined(artifactClient.getSchema);
  });

  it("Test getSchemaDetails method with schemaDetailsRequest", async () => {
    const artifactClient = new ArtifactClientTest(settings);

    const response = await artifactClient.getSchemaDetails(
      new dataServiceRead.SchemaDetailsRequest()
    );
    assert.isDefined(response);
  });

  it("Test getSchema method with schemaRequest", async () => {
    const artifactClient = new ArtifactClientTest(settings);

    const response = await artifactClient.getSchema(
      new dataServiceRead.SchemaRequest()
    );
    assert.isDefined(response);
  });
});
