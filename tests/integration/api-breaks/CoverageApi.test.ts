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

import { CoverageApi } from "@here/olp-sdk-dataservice-api";
import {
  BoundingBox,
  CatalogAdminAreas,
  LayerBoundingBox,
  LayerLevelSummary,
  LayerSummary
} from "@here/olp-sdk-dataservice-api/lib/coverage-api";
import { mockedRequestBuilder } from "./MockedRequestBuilder";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("CoverageApi", function() {
  it("BoundingBox with all required params", function() {
    const params: BoundingBox = {};

    assert.isDefined(params);
  });

  it("BoundingBox with all optional params", function() {
    const params: BoundingBox = {
      east: "test",
      north: "test",
      south: "test",
      west: "test"
    };

    assert.isDefined(params);
  });

  it("CatalogAdminAreas with all required params", function() {
    const params: CatalogAdminAreas = {};

    assert.isDefined(params);
  });

  it("CatalogAdminAreas with all optional params", function() {
    const params: CatalogAdminAreas = {
      cities: ["test"],
      counties: ["test"],
      countries: ["test"],
      states: ["test"]
    };

    assert.isDefined(params);
  });

  it("LayerBoundingBox  with all required params", function() {
    const params: LayerBoundingBox = {
      east: 1,
      south: 1,
      north: 1,
      west: 1
    };

    assert.isDefined(params);
  });

  it("LayerLevelSummary with all required params", function() {
    const params: LayerLevelSummary = {
      boundingBox: {
        east: 1,
        south: 1,
        north: 1,
        west: 1
      },
      size: 1,
      processedTimestamp: 1,
      centroid: 1,
      minPartitionSize: 1,
      maxPartitionSize: 1,
      version: 1,
      totalPartitions: 1
    };

    assert.isDefined(params);
  });

  it("LayerSummary with all required params", function() {
    const params: LayerSummary = {
      catalogHRN: "test-hrn",
      layer: "test",
      levelSummary: {
        1: {
          boundingBox: {
            east: 1,
            south: 1,
            north: 1,
            west: 1
          },
          size: 1,
          processedTimestamp: 1,
          centroid: 1,
          minPartitionSize: 1,
          maxPartitionSize: 1,
          version: 1,
          totalPartitions: 1
        }
      }
    };

    assert.isDefined(params);
  });

  it("Test getDataCoverageAdminAreas method with all required params", async function() {
    const params = {
      layerId: "mocked-layerId",
      datalevel: "mocked-datalevel"
    };

    const result = await CoverageApi.getDataCoverageAdminAreas(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test getDataCoverageSizeMap method with all required params", async function() {
    const params = {
      layerId: "mocked-layerId"
    };

    const result = await CoverageApi.getDataCoverageSizeMap(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test getDataCoverageSizeMap method with all required and optional params", async function() {
    const params = {
      layerId: "mocked-layerId",
      datalevel: 12
    };

    const result = await CoverageApi.getDataCoverageSizeMap(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test getDataCoverageSummary method with all required params", async function() {
    const params = {
      layerId: "mocked-layerId"
    };

    const result = await CoverageApi.getDataCoverageSummary(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test getDataCoverageTile method with all required params", async function() {
    const params = {
      layerId: "mocked-layerId"
    };

    const result = await CoverageApi.getDataCoverageTile(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test getDataCoverageTile method with all required and optional params", async function() {
    const params = {
      layerId: "mocked-layerId",
      datalevel: 12
    };

    const result = await CoverageApi.getDataCoverageTile(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test getDataCoverageTimeMap method with all required params", async function() {
    const params = {
      layerId: "mocked-layerId",
      catalogHRN: "mocked-catalogHRN"
    };

    const result = await CoverageApi.getDataCoverageTimeMap(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test getDataCoverageTimeMap method with all required and optional params", async function() {
    const params = {
      layerId: "mocked-layerId",
      datalevel: 12,
      catalogHRN: "mocked-catalogHRN"
    };

    const result = await CoverageApi.getDataCoverageTimeMap(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });
});
