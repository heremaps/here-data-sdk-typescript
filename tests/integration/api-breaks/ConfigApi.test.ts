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

import { ConfigApi } from "@here/olp-sdk-dataservice-api";
import {
  ParentQuad,
  SubQuad,
  Index,
  Layer,
  StatusLink,
  Catalog,
  CatalogFailureStatus,
  CatalogPendingStatus,
  CatalogSummary,
  CatalogsList,
  CatalogsListResult
} from "@here/olp-sdk-dataservice-api/lib/config-api";
import { mockedRequestBuilder } from "./MockedRequestBuilder";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("ConfigApi", function() {
  it("ParentQuad with all required params", function() {
    const params: ParentQuad = {
      dataHandle: "test",
      partition: "test",
      version: 1
    };

    assert.isDefined(params);
  });

  it("ParentQuad with all required and optional params", function() {
    const params: ParentQuad = {
      additionalMetadata: "test",
      checksum: "test",
      compressedDataSize: 1,
      dataHandle: "test",
      dataSize: 1,
      partition: "test",
      version: 1
    };

    assert.isDefined(params);
  });

  it("SubQuad with all required params", function() {
    const params: SubQuad = {
      dataHandle: "test",
      subQuadKey: "test",
      version: 1
    };

    assert.isDefined(params);
  });

  it("SubQuad with all required and optional params", function() {
    const params: SubQuad = {
      additionalMetadata: "test",
      checksum: "test",
      compressedDataSize: 1,
      dataHandle: "test",
      dataSize: 1,
      subQuadKey: "test",
      version: 1
    };

    assert.isDefined(params);
  });

  it("Index with all required params", function() {
    const params: Index = {
      parentQuads: [
        {
          dataHandle: "test",
          partition: "test",
          version: 1
        }
      ],

      subQuads: [
        {
          dataHandle: "test",
          subQuadKey: "test",
          version: 1
        }
      ]
    };

    assert.isDefined(params);
  });

  it("Layer with all required params", function() {
    const params: Layer = {
      hrn: "test",
      id: "test",
      layerType: "index",
      partitioning: {
        scheme: "generic",
        tileLevels: [1]
      }
    };

    assert.isDefined(params);
  });

  it("Layer with all required and optional params", function() {
    const params: Layer = {
      billingTags: ["test"],
      contentEncoding: "gzip",
      contentType: "test",
      coverage: {
        adminAreas: ["test"]
      },
      creator: {
        id: "test"
      },
      description: "test",
      hrn: "test",
      id: "test",
      layerType: "index",
      name: "test",
      partitioning: {
        scheme: "generic",
        tileLevels: [1]
      },
      schema: {
        hrn: "test"
      },
      streamProperties: {
        dataInThroughputMbps: 1,
        dataOutThroughputMbps: 1
      },
      summary: "test",
      tags: ["test"],
      volume: {
        volumeType: "durable"
      },
      digest: "MD5"
    };

    assert.isDefined(params);
  });

  it("Catalog with all required params", function() {
    const params: Catalog = {
      created: "test",
      description: "test",
      hrn: "test",
      id: "test",
      layers: [
        {
          billingTags: ["test"],
          contentEncoding: "gzip",
          contentType: "test",
          coverage: {
            adminAreas: ["test"]
          },
          creator: {
            id: "test"
          },
          description: "test",
          hrn: "test",
          id: "test",
          layerType: "index",
          name: "test",
          partitioning: {
            scheme: "generic",
            tileLevels: [1]
          },
          schema: {
            hrn: "test"
          },
          streamProperties: {
            dataInThroughputMbps: 1,
            dataOutThroughputMbps: 1
          },
          summary: "test",
          tags: ["test"],
          volume: {
            volumeType: "durable"
          },
          digest: "MD5"
        }
      ],
      name: "test",
      replication: {
        regions: [
          {
            id: "eu-ireland",
            role: "primary"
          }
        ]
      },
      summary: "test",
      tags: ["text"],
      version: 1
    };

    assert.isDefined(params);
  });

  it("Catalog with all required and optional params", function() {
    const params: Catalog = {
      billingTags: ["text"],
      coverage: {
        adminAreas: ["text"]
      },
      created: "test",
      description: "test",
      hrn: "test",
      id: "test",
      layers: [
        {
          billingTags: ["test"],
          contentEncoding: "gzip",
          contentType: "test",
          coverage: {
            adminAreas: ["test"]
          },
          creator: {
            id: "test"
          },
          description: "test",
          hrn: "test",
          id: "test",
          layerType: "index",
          name: "test",
          partitioning: {
            scheme: "generic",
            tileLevels: [1]
          },
          schema: {
            hrn: "test"
          },
          streamProperties: {
            dataInThroughputMbps: 1,
            dataOutThroughputMbps: 1
          },
          summary: "test",
          tags: ["test"],
          volume: {
            volumeType: "durable"
          },
          digest: "MD5"
        }
      ],
      name: "test",
      notifications: {
        enabled: true
      },
      owner: {
        creator: {
          id: "text"
        },
        organisation: {
          id: "text"
        }
      },
      replication: {
        regions: [
          {
            id: "eu-ireland",
            role: "primary"
          }
        ]
      },
      summary: "test",
      tags: ["text"],
      version: 1
    };

    assert.isDefined(params);
  });

  it("CatalogFailureStatus with all required params", function() {
    const params: CatalogFailureStatus = {};
    assert.isDefined(params);
  });

  it("CatalogFailureStatus with all required and optional params", function() {
    const params: CatalogFailureStatus = {
      reason: "test",
      status: "test"
    };
    assert.isDefined(params);
  });

  it("CatalogPendingStatus with all required params", function() {
    const params: CatalogPendingStatus = {};
    assert.isDefined(params);
  });
  it("CatalogPendingStatus with all required and optional params", function() {
    const params: CatalogPendingStatus = {
      status: "test"
    };
    assert.isDefined(params);
  });

  it("CatalogSummary with all required params", function() {
    const params: CatalogSummary = {};
    assert.isDefined(params);
  });
  it("CatalogSummary with all required and optional params", function() {
    const params: CatalogSummary = {
      href: "test",
      hrn: "test",
      title: "test",
      type: "test"
    };
    assert.isDefined(params);
  });

  it("CatalogsList with all required params", function() {
    const params: CatalogsList = {};
    assert.isDefined(params);
  });

  it("CatalogsList with all required and optional params", function() {
    const params: CatalogsList = {
      items: [
        {
          href: "test",
          hrn: "test",
          title: "test",
          type: "test"
        }
      ]
    };
    assert.isDefined(params);
  });

  it("CatalogsListResult with all required params", function() {
    const params: CatalogsListResult = {};
    assert.isDefined(params);
  });

  it("CatalogsListResult with all required and optional params", function() {
    const params: CatalogsListResult = {
      results: {
        items: [
          {
            href: "test",
            hrn: "test",
            title: "test",
            type: "test"
          }
        ]
      }
    };
    assert.isDefined(params);
  });

  it("StatusLink with all required params", function() {
    const params: StatusLink = {};

    assert.isDefined(params);
  });

  it("StatusLink with all required and optional params", function() {
    const params: StatusLink = {
      href: "test",
      title: "test",
      type: "test"
    };

    assert.isDefined(params);
  });

  ////////////////

  it("Test catalogExists method with all required params", async function() {
    const params = {
      catalogHrn: "mocked-catalogHrn"
    };

    const result = await ConfigApi.catalogExists(mockedRequestBuilder, params);

    expect(result).to.be.equal("success");
  });

  it("Test catalogExists method with all required and optional params", async function() {
    const params = {
      catalogHrn: "mocked-catalogHrn",
      billingTag: "mocked-billingTag"
    };

    const result = await ConfigApi.catalogExists(mockedRequestBuilder, params);

    expect(result).to.be.equal("success");
  });

  it("Test createCatalog method with all required params", async function() {
    const params = {
      body: "mocked-body" as any
    };

    const result = await ConfigApi.createCatalog(mockedRequestBuilder, params);

    expect(result).to.be.equal("success");
  });

  it("Test createCatalog method with all required and optional params", async function() {
    const params = {
      body: "mocked-body" as any,
      billingTag: "mocked-billingTag"
    };

    const result = await ConfigApi.createCatalog(mockedRequestBuilder, params);

    expect(result).to.be.equal("success");
  });

  it("Test deleteCatalog method with all required params", async function() {
    const params = {
      catalogHrn: "mocked-catalogHrn"
    };

    const result = await ConfigApi.deleteCatalog(mockedRequestBuilder, params);

    expect(result).to.be.equal("success");
  });

  it("Test deleteCatalog method with all required and optional params", async function() {
    const params = {
      catalogHrn: "mocked-catalogHrn",
      billingTag: "mocked-billingTag"
    };

    const result = await ConfigApi.deleteCatalog(mockedRequestBuilder, params);

    expect(result).to.be.equal("success");
  });

  it("Test deleteLayer method with all required params", async function() {
    const params = {
      catalogHrn: "mocked-catalogHrn",
      layerId: "mocked-layerId"
    };

    const result = await ConfigApi.deleteLayer(mockedRequestBuilder, params);

    expect(result).to.be.equal("success");
  });

  it("Test getCatalog method with all required params", async function() {
    const params = {
      catalogHrn: "mocked-catalogHrn",
      billingTag: "mocked-billingTag"
    };

    const result = await ConfigApi.getCatalog(mockedRequestBuilder, params);

    expect(result).to.be.equal("success");
  });

  it("Test getCatalogStatus method with all required params", async function() {
    const params = {
      token: "mocked-token",
      billingTag: "mocked-billingTag"
    };

    const result = await ConfigApi.getCatalogStatus(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test getCatalogs method with all required params", async function() {
    const params = {};

    const result = await ConfigApi.getCatalogs(mockedRequestBuilder, params);

    expect(result).to.be.equal("success");
  });

  it("Test getCatalogs method with all required and optional params", async function() {
    const params = {
      billingTag: "mocked-billingTag" as any,
      verbose: "mocked-verbose" as any,
      q: "mocked-verbose" as any,
      organisation: "mocked-organisation" as any,
      organisationType: "mocked-organisationType" as any,
      layerType: "mocked-layerType" as any,
      region: "mocked-region" as any,
      schemaHrn: "mocked-schemaHrn" as any,
      resourceType: "mocked-resourceType" as any,
      coverage: "mocked-coverage" as any,
      access: "mocked-access" as any,
      limit: "mocked-limit" as any,
      sortBy: "mocked-sortBy" as any,
      sortOrder: "mocked-sortOrder" as any
    };

    const result = await ConfigApi.getCatalogs(mockedRequestBuilder, params);

    expect(result).to.be.equal("success");
  });

  it("Test patchCatalog method with all required params", async function() {
    const params = {
      catalogHrn: "mocked-catalogHrn",
      body: "mocked-body" as any
    };

    const result = await ConfigApi.patchCatalog(mockedRequestBuilder, params);

    expect(result).to.be.equal("success");
  });

  it("Test patchLayer method with all required params", async function() {
    const params = {
      catalogHrn: "mocked-catalogHrn",
      layerId: "mocked-layerId",
      body: "mocked-body" as any
    };

    const result = await ConfigApi.patchLayer(mockedRequestBuilder, params);

    expect(result).to.be.equal("success");
  });

  it("Test updateCatalog method with all required params", async function() {
    const params = {
      catalogHrn: "mocked-catalogHrn",
      body: "mocked-body" as any
    };

    const result = await ConfigApi.updateCatalog(mockedRequestBuilder, params);

    expect(result).to.be.equal("success");
  });

  it("Test updateCatalog method with all required and optional params", async function() {
    const params = {
      catalogHrn: "mocked-catalogHrn",
      body: "mocked-body" as any,
      billingTag: "mocked-billingTag"
    };

    const result = await ConfigApi.updateCatalog(mockedRequestBuilder, params);

    expect(result).to.be.equal("success");
  });
});
