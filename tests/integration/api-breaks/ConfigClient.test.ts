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
  ConfigClient,
  OlpClientSettings
} from "@here/olp-sdk-dataservice-read";
import * as dataServiceRead from "@here/olp-sdk-dataservice-read";
import * as dataServiceApi from "@here/olp-sdk-dataservice-api";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("ConfigClient", function() {
  class ConfigClientTest extends ConfigClient {
    constructor(settings: OlpClientSettings) {
      super(settings);
    }

    public async getCatalogs(
      request?: dataServiceRead.CatalogsRequest
    ): Promise<dataServiceApi.ConfigApi.CatalogsListResult> {
      return {};
    }
  }

  let sandbox: sinon.SinonSandbox;
  sandbox = sinon.createSandbox();
  let settings = new OlpClientSettings({
    environment: "here",
    getToken: () => Promise.resolve("mocked-token")
  });

  it("Shoud be initialized with arguments", async function() {
    const configClient = new ConfigClient(settings);
    assert.isDefined(configClient);

    expect(configClient).to.be.instanceOf(ConfigClient);
    assert.isDefined(configClient.getCatalogs);
  });

  it("Test getCatalogs method without params", async function() {
    const configClient = new ConfigClientTest(settings);

    const response = await configClient.getCatalogs();
    assert.isDefined(response);
  });

  it("Test getCatalog method with catalogsRequest", async function() {
    const configClient = new ConfigClientTest(settings);

    const response = await configClient.getCatalogs(
      new dataServiceRead.CatalogsRequest()
    );
    assert.isDefined(response);
  });
});
