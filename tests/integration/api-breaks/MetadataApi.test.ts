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
import {
  LayerVersion,
  LayerVersions,
  Partition,
  Partitions,
  VersionDependency,
  VersionInfo,
  VersionInfos,
  VersionResponse
} from "@here/olp-sdk-dataservice-api/lib/metadata-api";
import { mockedRequestBuilder } from "./MockedRequestBuilder";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("MetadataApi", function() {
  it("LayerVersion with all required params", function() {
    const params: LayerVersion = {
      layer: "test",
      version: 1,
      timestamp: 1
    };

    assert.isDefined(params);
  });

  it("LayerVersion with all required and optional params", function() {
    const params: LayerVersion = {
      layer: "test",
      version: 1,
      timestamp: 1
    };

    assert.isDefined(params);
  });

  it("LayerVersions with all required params", function() {
    const params: LayerVersions = {
      layerVersions: [
        {
          layer: "test",
          version: 1,
          timestamp: 1
        }
      ],
      version: 1
    };

    assert.isDefined(params);
  });

  it("LayerVersions with all required and optional params", function() {
    const params: LayerVersions = {
      layerVersions: [
        {
          layer: "test",
          version: 1,
          timestamp: 1
        }
      ],
      version: 1
    };

    assert.isDefined(params);
  });

  it("Partition with all required params", function() {
    const params: Partition = {
      dataHandle: "test",
      partition: "test",
      version: 1
    };

    assert.isDefined(params);
  });

  it("Partition with all required and optional params", function() {
    const params: Partition = {
      checksum: "test",
      compressedDataSize: 1,
      dataHandle: "test",
      dataSize: 1,
      partition: "test",
      version: 1
    };

    assert.isDefined(params);
  });

  it("Partitions with all required params", function() {
    const params: Partitions = {
      partitions: [
        {
          checksum: "test",
          compressedDataSize: 1,
          dataHandle: "test",
          dataSize: 1,
          partition: "test",
          version: 1
        }
      ]
    };

    assert.isDefined(params);
  });

  it("Partitions with all required and optional params", function() {
    const params: Partitions = {
      partitions: [
        {
          checksum: "test",
          compressedDataSize: 1,
          dataHandle: "test",
          dataSize: 1,
          partition: "test",
          version: 1
        }
      ],
      next: "test"
    };

    assert.isDefined(params);
  });

  it("VersionDependency with all required params", function() {
    const params: VersionDependency = {
      direct: true,
      hrn: "test",
      version: 1
    };

    assert.isDefined(params);
  });

  it("VersionDependency with all required and optional params", function() {
    const params: VersionDependency = {
      direct: true,
      hrn: "test",
      version: 1
    };

    assert.isDefined(params);
  });

  it("VersionInfo with all required params", function() {
    const params: VersionInfo = {
      dependencies: [
        {
          direct: true,
          hrn: "test",
          version: 1
        }
      ],
      partitionCounts: { ["test"]: 1 },
      timestamp: 1,
      version: 1
    };

    assert.isDefined(params);
  });

  it("VersionInfo with all required and optional params", function() {
    const params: VersionInfo = {
      dependencies: [
        {
          direct: true,
          hrn: "test",
          version: 1
        }
      ],
      partitionCounts: { ["test"]: 1 },
      timestamp: 1,
      version: 1
    };

    assert.isDefined(params);
  });

  it("VersionInfos with all required params", function() {
    const params: VersionInfos = {
      versions: [
        {
          dependencies: [
            {
              direct: true,
              hrn: "test",
              version: 1
            }
          ],
          partitionCounts: { ["test"]: 1 },
          timestamp: 1,
          version: 1
        }
      ]
    };

    assert.isDefined(params);
  });

  it("VersionInfos with all required and optional params", function() {
    const params: VersionInfos = {
      versions: [
        {
          dependencies: [
            {
              direct: true,
              hrn: "test",
              version: 1
            }
          ],
          partitionCounts: { ["test"]: 1 },
          timestamp: 1,
          version: 1
        }
      ]
    };

    assert.isDefined(params);
  });

  it("VersionResponse with all required params", function() {
    const params: VersionResponse = {
      version: 1
    };

    assert.isDefined(params);
  });

  it("VersionResponse with all required and optional params", function() {
    const params: VersionResponse = {
      version: 1
    };

    assert.isDefined(params);
  });

  it("Test getChanges method with all required params", async function() {
    const params = {
      layerId: "test"
    };

    const result = await MetadataApi.getChanges(mockedRequestBuilder, params);

    expect(result).to.be.equal("success");
  });

  it("Test getChanges method with all required and optional params", async function() {
    const params = {
      layerId: "test",
      startVersion: 1,
      endVersion: 1,
      sinceTime: 1,
      additionalFields: ["test"],
      range: "test",
      billingTag: "test"
    };

    const result = await MetadataApi.getChanges(mockedRequestBuilder, params);

    expect(result).to.be.equal("success");
  });

  it("Test getLayerVersions method with all required params", async function() {
    const params = {
      version: 1
    };

    const result = await MetadataApi.getLayerVersions(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test getLayerVersions method with all required and optional params", async function() {
    const params = {
      version: 1,
      billingTag: "test"
    };

    const result = await MetadataApi.getLayerVersions(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test getPartitions method with all required params", async function() {
    const params = {
      layerId: "test"
    };

    const result = await MetadataApi.getPartitions(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test getPartitions method with all required and optional params", async function() {
    const params = {
      layerId: "test",
      version: 1,
      additionalFields: ["test"],
      range: "test",
      billingTag: "test"
    };

    const result = await MetadataApi.getPartitions(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test latestVersion method with all required params", async function() {
    const params = {
      startVersion: 1
    };

    const result = await MetadataApi.latestVersion(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test latestVersion method with all required and optional params", async function() {
    const params = {
      startVersion: 1,
      billingTag: "test"
    };

    const result = await MetadataApi.latestVersion(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test listVersions method with all required params", async function() {
    const params = {
      startVersion: 1,
      endVersion: 1
    };

    const result = await MetadataApi.listVersions(mockedRequestBuilder, params);

    expect(result).to.be.equal("success");
  });

  it("Test listVersions method with all required and optional params", async function() {
    const params = {
      startVersion: 1,
      endVersion: 1,
      billingTag: "test"
    };

    const result = await MetadataApi.listVersions(mockedRequestBuilder, params);

    expect(result).to.be.equal("success");
  });

  it("Test minimumVersion method with all required params", async function() {
    const params = {};

    const result = await MetadataApi.minimumVersion(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test minimumVersion method with all required and optional params", async function() {
    const params = {
      billingTag: "test"
    };

    const result = await MetadataApi.minimumVersion(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });
});
