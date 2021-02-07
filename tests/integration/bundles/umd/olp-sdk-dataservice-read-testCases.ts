/*
 * Copyright (C) 2019-2021 HERE Europe B.V.
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

import * as Module from "@here/olp-sdk-dataservice-read";

import assert = require("assert");

export const OlpSdkDataserviceReadTestCases: {
  it: string;
  callback: () => void;
}[] = [
  {
    it: "StatisticsRequest should be defined",
    callback: function() {
      assert(Module.StatisticsRequest !== undefined);
    }
  },
  {
    it: "SummaryRequest should be defined",
    callback: function() {
      assert(Module.SummaryRequest !== undefined);
    }
  },
  {
    it: "VersionedLayerClient should be defined",
    callback: function() {
      assert(Module.VersionedLayerClient !== undefined);
    }
  },
  {
    it: "VolatileLayerClient should be defined",
    callback: function() {
      assert(Module.VolatileLayerClient !== undefined);
    }
  },
  {
    it: "isValid should be defined",
    callback: function() {
      assert(Module.isValid !== undefined);
    }
  },
  {
    it: "validateBillingTag should be defined",
    callback: function() {
      assert(Module.validateBillingTag !== undefined);
    }
  },
  {
    it: "validatePartitionsIdsList should be defined",
    callback: function() {
      assert(Module.validatePartitionsIdsList !== undefined);
    }
  },
  {
    it: "ArtifactClient should be defined",
    callback: function() {
      assert(Module.ArtifactClient !== undefined);
    }
  },
  {
    it: "CatalogClient should be defined",
    callback: function() {
      assert(Module.CatalogClient !== undefined);
    }
  },
  {
    it: "CatalogVersionRequest should be defined",
    callback: function() {
      assert(Module.CatalogVersionRequest !== undefined);
    }
  },
  {
    it: "CatalogsRequest should be defined",
    callback: function() {
      assert(Module.CatalogsRequest !== undefined);
    }
  },
  {
    it: "ConfigClient should be defined",
    callback: function() {
      assert(Module.ConfigClient !== undefined);
    }
  },
  {
    it: "CoverageDataType should be defined",
    callback: function() {
      assert(Module.CoverageDataType !== undefined);
    }
  },
  {
    it: "DataRequest should be defined",
    callback: function() {
      assert(Module.DataRequest !== undefined);
    }
  },
  {
    it: "PartitionsRequest should be defined",
    callback: function() {
      assert(Module.PartitionsRequest !== undefined);
    }
  },
  {
    it: "QuadKeyPartitionsRequest should be defined",
    callback: function() {
      assert(Module.QuadKeyPartitionsRequest !== undefined);
    }
  },
  {
    it: "QuadTreeIndexRequest should be defined",
    callback: function() {
      assert(Module.QuadTreeIndexRequest !== undefined);
    }
  },
  {
    it: "QueryClient should be defined",
    callback: function() {
      assert(Module.QueryClient !== undefined);
    }
  },
  {
    it: "SchemaDetailsRequest should be defined",
    callback: function() {
      assert(Module.SchemaDetailsRequest !== undefined);
    }
  }
];
