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

import {
  ArtifactObj,
  ArtifactFile,
  DeleteArtifactResponseObj,
  DeleteFileResponseObj,
  DeleteSchemaResponseObj,
  SchemaObj,
  GetArtifactResponseObj,
  GetSchemaResponseObj,
  ListSchemasResponseObj,
  PagedQuery,
  Principal,
  RegisterArtifactRequest,
  RegisterArtifactResponse,
  SchemaValidationResults,
  UpdatePermissionRequest,
  UpdatePermissionResponse,
  Variant
} from "@here/olp-sdk-dataservice-api/lib/artifact-api";
import { ArtifactApi } from "@here/olp-sdk-dataservice-api";

import { mockedRequestBuilder } from "./MockedRequestBuilder";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("ArtifactApi", function() {
  it("Artifact with all required params", function() {
    const params: ArtifactObj = {
      artifactId: "test",
      created: "",
      groupId: "test",
      hrn: "test",
      updated: "",
      version: "test"
    };

    assert.isDefined(params);
  });

  it("ArtifactFile with all required params", function() {
    const params: ArtifactFile = {};

    assert.isDefined(params);
  });

  it("ArtifactFile with all required and optional params", function() {
    const params: ArtifactFile = {
      name: "test"
    };

    assert.isDefined(params);
  });

  it("DeleteArtifactResponse with all required params", function() {
    const params: DeleteArtifactResponseObj = {};

    assert.isDefined(params);
  });

  it("DeleteArtifactResponse with all required and optional params", function() {
    const params: DeleteArtifactResponseObj = {
      artifact: {
        artifactId: "test",
        created: "",
        groupId: "test",
        hrn: "test",
        updated: "",
        version: "test"
      },
      files: ["test"]
    };

    assert.isDefined(params);
  });

  it("DeleteFileResponse with all required params", function() {
    const params: DeleteFileResponseObj = {};

    assert.isDefined(params);
  });

  it("DeleteFileResponse with all required and optional params", function() {
    const params: DeleteFileResponseObj = {
      artifact: {
        artifactId: "test",
        created: "",
        groupId: "test",
        hrn: "test",
        updated: "",
        version: "test"
      },
      file: "test"
    };

    assert.isDefined(params);
  });

  it("DeleteSchemaResponse with all required params", function() {
    const params: DeleteSchemaResponseObj = {};

    assert.isDefined(params);
  });

  it("DeleteSchemaResponse with all required and optional params", function() {
    const params: DeleteSchemaResponseObj = {
      artifacts: [
        {
          artifactId: "test",
          created: "",
          groupId: "test",
          hrn: "test",
          updated: "",
          version: "test"
        }
      ],
      schema: {
        artifactId: "test",
        created: "",
        groupId: "test",
        hrn: "test",
        name: "test",
        summary: "test",
        updated: "",
        version: "test"
      }
    };

    assert.isDefined(params);
  });

  it("DeleteSchemaResponse with all required params", function() {
    const params: DeleteSchemaResponseObj = {};

    assert.isDefined(params);
  });

  it("DeleteSchemaResponse with all required and optional params", function() {
    const params: DeleteSchemaResponseObj = {
      artifacts: [
        {
          artifactId: "test",
          created: "",
          groupId: "test",
          hrn: "test",
          updated: "",
          version: "test"
        }
      ],
      schema: {
        artifactId: "test",
        created: "",
        groupId: "test",
        hrn: "test",
        name: "test",
        summary: "test",
        updated: "",
        version: "test"
      }
    };

    assert.isDefined(params);
  });

  it("Schema with all required params", function() {
    const params: SchemaObj = {
      artifactId: "test",
      created: "",
      groupId: "test",
      hrn: "test",
      name: "test",
      updated: "",
      version: "test"
    };

    assert.isDefined(params);
  });

  it("Schema with all required and optional params", function() {
    const params: SchemaObj = {
      artifactId: "test",
      created: "",
      groupId: "test",
      hrn: "test",
      name: "test",
      summary: "test",
      updated: "",
      version: "test"
    };

    assert.isDefined(params);
  });

  it("GetArtifactResponse with all required params", function() {
    const params: GetArtifactResponseObj = {};

    assert.isDefined(params);
  });

  it("GetArtifactResponse with all required and optional params", function() {
    const params: GetArtifactResponseObj = {
      artifact: {
        artifactId: "test",
        created: "",
        groupId: "test",
        hrn: "test",
        updated: "",
        version: "test"
      },
      files: [
        {
          name: "test"
        }
      ]
    };

    assert.isDefined(params);
  });

  it("GetSchemaResponse with all required params", function() {
    const params: GetSchemaResponseObj = {};

    assert.isDefined(params);
  });

  it("GetSchemaResponse with all required and optional params", function() {
    const params: GetSchemaResponseObj = {
      artifacts: [
        {
          artifactId: "test",
          created: "",
          groupId: "test",
          hrn: "test",
          updated: "",
          version: "test"
        }
      ],
      schema: {
        artifactId: "test",
        created: "",
        groupId: "test",
        hrn: "test",
        name: "test",
        updated: "",
        version: "test"
      },
      schemaValidationResults: [],
      variants: [
        {
          id: "test",
          url: "test"
        }
      ]
    };

    assert.isDefined(params);
  });

  it("ListSchemasResponse with all required params", function() {
    const params: ListSchemasResponseObj = {};

    assert.isDefined(params);
  });

  it("ListSchemasResponse with all required and optional params", function() {
    const params: ListSchemasResponseObj = {
      items: [
        {
          artifactId: "test",
          created: "",
          groupId: "test",
          hrn: "test",
          name: "test",
          updated: "",
          version: "test"
        }
      ],
      next: "test",
      page: {
        order: "ASC",
        sort: "test"
      }
    };

    assert.isDefined(params);
  });

  it("PagedQuery with all required params", function() {
    const params: PagedQuery = {
      order: "ASC",
      sort: "test"
    };

    assert.isDefined(params);
  });

  it("PagedQuery with all required and optional params", function() {
    const params: PagedQuery = {
      from: "test",
      limit: 1,
      order: "ASC",
      sort: "test"
    };

    assert.isDefined(params);
  });

  it("Principal with all required params", function() {
    const params: Principal = {
      type: "User",
      token: "test"
    };

    assert.isDefined(params);
  });

  it("RegisterArtifactRequest with all required params", function() {
    const params: RegisterArtifactRequest = {};

    assert.isDefined(params);
  });

  it("RegisterArtifactRequest with all required and optional params", function() {
    const params: RegisterArtifactRequest = {
      userId: "test"
    };

    assert.isDefined(params);
  });

  it("RegisterArtifactResponse with all required params", function() {
    const params: RegisterArtifactResponse = {};

    assert.isDefined(params);
  });

  it("RegisterArtifactResponse with all required and optional params", function() {
    const params: RegisterArtifactResponse = {
      artifactId: "test",
      created: true,
      groupId: "test",
      hrnPrefix: "test"
    };

    assert.isDefined(params);
  });

  it("SchemaValidationResults with all required params", function() {
    const params: SchemaValidationResults = {
      module: "test"
    };

    assert.isDefined(params);
  });

  it("SchemaValidationResults with all required and optional params", function() {
    const params: SchemaValidationResults = {
      backwardsCompatibility: true,
      fileExtension: true,
      googleStyle: true,
      majorVersionInPackage: true,
      module: "test",
      packageConsistency: true
    };

    assert.isDefined(params);
  });

  it("UpdatePermissionRequest with all required params", function() {
    const params: UpdatePermissionRequest = {
      principal: {
        type: "User",
        token: "test"
      },
      permissions: ["READ"]
    };

    assert.isDefined(params);
  });

  it("UpdatePermissionRequest with all required and optional params", function() {
    const params: UpdatePermissionRequest = {
      principal: {
        type: "User",
        token: "test"
      },
      permissions: ["READ"],
      permitted: true
    };

    assert.isDefined(params);
  });

  it("UpdatePermissionResponse with all required params", function() {
    const params: UpdatePermissionResponse = {};

    assert.isDefined(params);
  });

  it("UpdatePermissionResponse with all required and optional params", function() {
    const params: UpdatePermissionResponse = {
      principal: {
        type: "User",
        token: "test"
      },
      permissions: ["READ"],
      permitted: true
    };

    assert.isDefined(params);
  });

  it("Variant with all required params", function() {
    const params: Variant = {
      id: "test",
      url: "test"
    };

    assert.isDefined(params);
  });

  it("Test deleteArtifactUsingDELETE method with all required params", async function() {
    const params = {
      artifactHrn: "mocked-artifactHrn"
    };

    const result = await ArtifactApi.deleteArtifactUsingDELETE(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test deleteFileUsingDELETE method with all required params", async function() {
    const params = {
      artifactHrn: "mocked-artifactHrn",
      fileName: "mocked-fileName"
    };

    const result = await ArtifactApi.deleteFileUsingDELETE(
      mockedRequestBuilder,
      params
    );
  });

  it("Test getArtifactFileUsingGET method with all required params", async function() {
    const params = {
      artifactHrn: "mocked-artifactHrn",
      fileName: "mocked-fileName"
    };

    const result = await ArtifactApi.getArtifactFileUsingGET(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test getArtifactUsingGET method with all required params", async function() {
    const params = {
      artifactHrn: "mocked-artifactHrn",
      fileName: "mocked-fileName"
    };

    const result = await ArtifactApi.getArtifactUsingGET(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test putArtifactFileUsingPUT method with all required params", async function() {
    const params = {
      artifactHrn: "mocked-artifactHrn",
      fileName: "mocked-fileName",
      file: "mocked-file"
    };

    const result = await ArtifactApi.putArtifactFileUsingPUT(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test registerArtifactUsingPUT method with all required params", async function() {
    const params = {
      groupId: "mocked-groupId",
      artifactId: "mocked-artifactId"
    };

    const result = await ArtifactApi.registerArtifactUsingPUT(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test registerArtifactUsingPUT method with all required and optional params", async function() {
    const params = {
      groupId: "mocked-groupId",
      artifactId: "mocked-artifactId",
      registerRequest: "mocked-registerRequest" as any
    };

    const result = await ArtifactApi.registerArtifactUsingPUT(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test deleteSchemaUsingDELETE method with all required params", async function() {
    const params = {
      schemaHrn: "mocked-schemaHrn"
    };

    const result = await ArtifactApi.deleteSchemaUsingDELETE(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test getDocumentUsingGET method with all required params", async function() {
    const params = {
      schemaHrn: "mocked-schemaHrn",
      file: "mocked-file"
    };

    const result = await ArtifactApi.getDocumentUsingGET(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test getSchemaUsingGET( method with all required params", async function() {
    const params = {
      schemaHrn: "mocked-schemaHrn"
    };

    const result = await ArtifactApi.getSchemaUsingGET(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test listUsingGET method with all required params", async function() {
    const params = {};

    const result = await ArtifactApi.listUsingGET(mockedRequestBuilder, params);

    expect(result).to.be.equal("success");
  });

  it("Test listUsingGET method with all required and optional params", async function() {
    const params = {
      sort: "mocked-sort",
      order: "mocked-order" as any,
      from: "mocked-from",
      limit: "mocked-limit" as any
    };

    const result = await ArtifactApi.listUsingGET(mockedRequestBuilder, params);

    expect(result).to.be.equal("success");
  });

  it("Test updateSchemaPermissionUsingPOST method with all required params", async function() {
    const params = {
      schemaHrn: "mocked-schemaHrn"
    };

    const result = await ArtifactApi.updateSchemaPermissionUsingPOST(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test updateSchemaPermissionUsingPOST method with all required and optional params", async function() {
    const params = {
      schemaHrn: "mocked-schemaHrn",
      updatePermissionRequest: "mocked-updatePermissionRequest" as any
    };

    const result = await ArtifactApi.updateSchemaPermissionUsingPOST(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });
});
