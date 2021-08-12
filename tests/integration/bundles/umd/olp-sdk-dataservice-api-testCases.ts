/*
 * Copyright (C) 2019 HERE Europe B.V.
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
  ArtifactApi,
  ConfigApi,
  BlobApi,
  CoverageApi,
  IndexApi,
  LookupApi,
  MetadataApi,
  QueryApi,
  VolatileBlobApi
} from "@here/olp-sdk-dataservice-api";

import assert = require("assert");

export const OlpSdkDataserviceApiTestCases: {
  it: string;
  callback: () => void;
}[] = [
  {
    it: "ArtifactApi should be defined",
    callback: function() {
      assert(ArtifactApi !== undefined);
      assert(ArtifactApi.deleteArtifactUsingDELETE !== undefined);
      assert(ArtifactApi.deleteFileUsingDELETE !== undefined);
      assert(ArtifactApi.deleteSchemaUsingDELETE !== undefined);
      assert(ArtifactApi.getArtifactFileUsingGET !== undefined);
      assert(ArtifactApi.getArtifactUsingGET !== undefined);
      assert(ArtifactApi.getDocumentUsingGET !== undefined);
      assert(ArtifactApi.getSchemaUsingGET !== undefined);
      assert(ArtifactApi.listUsingGET !== undefined);
      assert(ArtifactApi.putArtifactFileUsingPUT !== undefined);
      assert(ArtifactApi.registerArtifactUsingPUT !== undefined);
      assert(ArtifactApi.updateSchemaPermissionUsingPOST !== undefined);
    }
  },
  {
    it: "ConfigApi should be defined",
    callback: function() {
      assert(ConfigApi !== undefined);
      assert(ConfigApi.catalogExists !== undefined);
      assert(ConfigApi.createCatalog !== undefined);
      assert(ConfigApi.deleteCatalog !== undefined);
      assert(ConfigApi.deleteLayer !== undefined);
      assert(ConfigApi.getCatalog !== undefined);
      assert(ConfigApi.getCatalogStatus !== undefined);
      assert(ConfigApi.getCatalogs !== undefined);
      assert(ConfigApi.patchCatalog !== undefined);
      assert(ConfigApi.patchLayer !== undefined);
      assert(ConfigApi.updateCatalog !== undefined);
    }
  },
  {
    it: "BlobApi should be defined",
    callback: function() {
      assert(BlobApi !== undefined);
      assert(BlobApi.cancelMultipartUpload !== undefined);
      assert(BlobApi.deleteBlob !== undefined);
      assert(BlobApi.getBlob !== undefined);
      assert(BlobApi.getMultipartUploadStatus !== undefined);
      assert(BlobApi.startMultipartUpload !== undefined);
    }
  },
  {
    it: "CoverageApi should be defined",
    callback: function() {
      assert(CoverageApi !== undefined);
      assert(CoverageApi.getDataCoverageAdminAreas !== undefined);
      assert(CoverageApi.getDataCoverageSizeMap !== undefined);
      assert(CoverageApi.getDataCoverageSummary !== undefined);
      assert(CoverageApi.getDataCoverageTile !== undefined);
      assert(CoverageApi.getDataCoverageTimeMap !== undefined);
    }
  },
  {
    it: "IndexApi should be defined",
    callback: function() {
      assert(IndexApi !== undefined);
      assert(IndexApi.insertIndexes !== undefined);
      assert(IndexApi.performQuery !== undefined);
      assert(IndexApi.performUpdate !== undefined);
    }
  },
  {
    it: "LookupApi should be defined",
    callback: function() {
      assert(LookupApi !== undefined);
      assert(LookupApi.platformAPI !== undefined);
      assert(LookupApi.resourceAPI !== undefined);
    }
  },
  {
    it: "MetadataApi should be defined",
    callback: function() {
      assert(MetadataApi !== undefined);
      assert(MetadataApi.getChanges !== undefined);
      assert(MetadataApi.getLayerVersions !== undefined);
      assert(MetadataApi.getPartitions !== undefined);
      assert(MetadataApi.latestVersion !== undefined);
      assert(MetadataApi.listVersions !== undefined);
      assert(MetadataApi.minimumVersion !== undefined);
    }
  },
  {
    it: "QueryApi should be defined",
    callback: function() {
      assert(QueryApi.getChangesById !== undefined);
      assert(QueryApi.getPartitionsById !== undefined);
      assert(QueryApi.quadTreeIndex !== undefined);
      assert(QueryApi.quadTreeIndexVolatile !== undefined);
    }
  },
  {
    it: "VolatileBlobApi should be defined",
    callback: function() {
      assert(VolatileBlobApi !== undefined);
      assert(VolatileBlobApi.checkHandleExists !== undefined);
      assert(VolatileBlobApi.deleteVolatileBlob !== undefined);
      assert(VolatileBlobApi.getVolatileBlob !== undefined);
      assert(VolatileBlobApi.putVolatileBlob !== undefined);
    }
  }
];
