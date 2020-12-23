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

import { AuthorizationAPI } from "@here/olp-sdk-dataservice-api";

import { mockedRequestBuilder } from "./MockedRequestBuilder";
import { ProjectPolicyListResponse } from "@here/olp-sdk-dataservice-api/lib/authorization-api-v1.1";

chai.use(sinonChai);

const assert = chai.assert;

describe("Authorization API", function() {
  it("ProjectPolicyListResponse  with all required params", function() {
    const params: ProjectPolicyListResponse = {
      limit: 1,
      total: 2
    };
    assert.isDefined(params);
  });

  it("getEntityGroupMembership", async function() {
    AuthorizationAPI.getEntityGroupMembership(mockedRequestBuilder, {
      member: "",
      realm: ""
    });
  });

  it("getEntityManagedGroups", async function() {
    AuthorizationAPI.getEntityManagedGroups(mockedRequestBuilder, {
      member: "",
      realm: ""
    });
  });

  it("getRealmMember", async function() {
    AuthorizationAPI.getRealmMember(mockedRequestBuilder, {
      member: "",
      realm: ""
    });
  });

  it("getRealmMembers", async function() {
    AuthorizationAPI.getRealmMembers(mockedRequestBuilder, {
      realm: ""
    });
  });

  it("cancelRealmMemberInvite", async function() {
    AuthorizationAPI.cancelRealmMemberInvite(mockedRequestBuilder, {
      invite: "",
      realm: ""
    });
  });

  it("createRealmMemberInvite", async function() {
    AuthorizationAPI.createRealmMemberInvite(mockedRequestBuilder, {
      body: {
        emailAddress: ""
      },
      realm: ""
    });
  });

  it("resendRealmMemberInvite", async function() {
    AuthorizationAPI.resendRealmMemberInvite(mockedRequestBuilder, {
      invite: "",
      realm: ""
    });
  });

  it("searchRealmMemberInvites", async function() {
    AuthorizationAPI.searchRealmMemberInvites(mockedRequestBuilder, {
      realm: ""
    });
  });

  it("addGrant", async function() {
    AuthorizationAPI.addGrant(mockedRequestBuilder, {
      actionId: "",
      entityId: "",
      entityType: "",
      resourceHrn: ""
    });
  });

  it("getGrant", async function() {
    AuthorizationAPI.getGrant(mockedRequestBuilder, {
      actionId: "",
      entityId: "",
      entityType: "",
      resourceHrn: ""
    });
  });

  it("getGrants", async function() {
    AuthorizationAPI.getGrants(mockedRequestBuilder, {
      entityId: "",
      entityType: "",
      resourceHrn: ""
    });
  });

  it("listGrants", async function() {
    AuthorizationAPI.listGrants(mockedRequestBuilder, {
      resourceHrn: ""
    });
  });

  it("removeGrant", async function() {
    AuthorizationAPI.removeGrant(mockedRequestBuilder, {
      actionId: "",
      entityId: "",
      entityType: "",
      resourceHrn: ""
    });
  });

  it("addRoleEntity", async function() {
    AuthorizationAPI.addRoleEntity(mockedRequestBuilder, {
      entity: "",
      role: ""
    });
  });

  it("deleteRoleEntity", async function() {
    AuthorizationAPI.deleteRoleEntity(mockedRequestBuilder, {
      entity: "",
      role: ""
    });
  });

  it("getEntityGroupMembership", async function() {
    AuthorizationAPI.getEntityGroupMembership(mockedRequestBuilder, {
      member: "",
      realm: ""
    });
  });

  it("getMyRoles", async function() {
    AuthorizationAPI.getMyRoles(mockedRequestBuilder);
  });

  it("getRole", async function() {
    AuthorizationAPI.getRole(mockedRequestBuilder, {
      role: ""
    });
  });

  it("getRoleEntities", async function() {
    AuthorizationAPI.getRoleEntities(mockedRequestBuilder, {
      role: ""
    });
  });

  it("getRoleEntity", async function() {
    AuthorizationAPI.getRoleEntity(mockedRequestBuilder, {
      entity: "",
      role: ""
    });
  });

  it("getRolePermission", async function() {
    AuthorizationAPI.getRolePermission(mockedRequestBuilder, {
      permission: "",
      role: ""
    });
  });

  it("getRolePermissions", async function() {
    AuthorizationAPI.getRolePermissions(mockedRequestBuilder, {
      role: ""
    });
  });

  it("getRoles", async function() {
    AuthorizationAPI.getRoles(mockedRequestBuilder);
  });

  it("addGroupMember", async function() {
    AuthorizationAPI.addGroupMember(mockedRequestBuilder, {
      groupId: "",
      member: ""
    });
  });

  it("createGroup", async function() {
    AuthorizationAPI.createGroup(mockedRequestBuilder, {
      body: {
        name: ""
      }
    });
  });

  it("deleteGroup", async function() {
    AuthorizationAPI.deleteGroup(mockedRequestBuilder, {
      groupId: ""
    });
  });

  it("getGroup", async function() {
    AuthorizationAPI.getGroup(mockedRequestBuilder, {
      groupId: ""
    });
  });

  it("getGroupMember", async function() {
    AuthorizationAPI.getGroupMember(mockedRequestBuilder, {
      groupId: "",
      member: ""
    });
  });

  it("getGroupMembers", async function() {
    AuthorizationAPI.getGroupMembers(mockedRequestBuilder, {
      groupId: ""
    });
  });

  it("getGroupRoles", async function() {
    AuthorizationAPI.getGroupRoles(mockedRequestBuilder, {
      groupId: ""
    });
  });

  it("getGroups", async function() {
    AuthorizationAPI.getGroups(mockedRequestBuilder);
  });

  it("getMyGroups", async function() {
    AuthorizationAPI.getMyGroups(mockedRequestBuilder);
  });

  it("leaveGroup", async function() {
    AuthorizationAPI.leaveGroup(mockedRequestBuilder, {
      groupId: ""
    });
  });

  it("removeGroupMember", async function() {
    AuthorizationAPI.removeGroupMember(mockedRequestBuilder, {
      groupId: "",
      member: ""
    });
  });

  it("updateGroup", async function() {
    AuthorizationAPI.updateGroup(mockedRequestBuilder, {
      body: {
        name: ""
      },
      groupId: ""
    });
  });

  it("addProjectMember", async function() {
    AuthorizationAPI.addProjectMember(mockedRequestBuilder, {
      member: "",
      project: ""
    });
  });

  it("addProjectResourceRelation", async function() {
    AuthorizationAPI.addProjectResourceRelation(mockedRequestBuilder, {
      body: {},
      project: "",
      relation: "home",
      resource: "",
      type: "artifact"
    });
  });

  it("checkProjectExistance", async function() {
    AuthorizationAPI.checkProjectExistance(mockedRequestBuilder, {
      project: ""
    });
  });

  it("createProject", async function() {
    AuthorizationAPI.createProject(mockedRequestBuilder, {
      body: {
        id: "",
        name: ""
      }
    });
  });

  it("deleteProject", async function() {
    AuthorizationAPI.deleteProject(mockedRequestBuilder, {
      project: ""
    });
  });

  it("deleteProjectMember", async function() {
    AuthorizationAPI.deleteProjectMember(mockedRequestBuilder, {
      member: "",
      project: ""
    });
  });

  it("deleteProjectResourceReference", async function() {
    AuthorizationAPI.deleteProjectResourceReference(mockedRequestBuilder, {
      body: {},
      project: "",
      relation: "",
      resource: ""
    });
  });

  it("deleteProjectResourceReference", async function() {
    AuthorizationAPI.deleteProjectResourceReference(mockedRequestBuilder, {
      body: {},
      project: "",
      relation: "",
      resource: ""
    });
  });

  it("getAllProjectList", async function() {
    AuthorizationAPI.getAllProjectList(mockedRequestBuilder, {});
  });

  it("getProject", async function() {
    AuthorizationAPI.getProject(mockedRequestBuilder, {
      project: ""
    });
  });

  it("getProjectList", async function() {
    AuthorizationAPI.getProjectList(mockedRequestBuilder, {});
  });

  it("getProjectMember", async function() {
    AuthorizationAPI.getProjectMember(mockedRequestBuilder, {
      member: "",
      project: ""
    });
  });

  it("getProjectResource", async function() {
    AuthorizationAPI.getProjectResource(mockedRequestBuilder, {
      project: "",
      resource: ""
    });
  });

  it("leaveProject", async function() {
    AuthorizationAPI.leaveProject(mockedRequestBuilder, {
      project: ""
    });
  });

  it("listProjectMembers", async function() {
    AuthorizationAPI.listProjectMembers(mockedRequestBuilder, {
      project: ""
    });
  });

  it("listProjectResources", async function() {
    AuthorizationAPI.listProjectResources(mockedRequestBuilder, {
      project: ""
    });
  });

  it("patchProject", async function() {
    AuthorizationAPI.patchProject(mockedRequestBuilder, {
      body: {},
      project: ""
    });
  });

  it("getListOfWaysResourceIsLinkable", async function() {
    AuthorizationAPI.getListOfWaysResourceIsLinkable(mockedRequestBuilder, {
      resource: ""
    });
  });

  it("getResource", async function() {
    AuthorizationAPI.getResource(mockedRequestBuilder, {
      referenceable: true,
      resource: ""
    });
  });

  it("getResourceLinkability", async function() {
    AuthorizationAPI.getResourceLinkability(mockedRequestBuilder, {
      availableToHrn: "",
      resource: ""
    });
  });

  it("getResourceProjects", async function() {
    AuthorizationAPI.getResourceProjects(mockedRequestBuilder, {
      resource: ""
    });
  });

  it("getResources", async function() {
    AuthorizationAPI.getResources(mockedRequestBuilder, {
      type: "artifact"
    });
  });

  it("listRealmResources", async function() {
    AuthorizationAPI.listRealmResources(mockedRequestBuilder, {});
  });

  it("makeResourceLinkable", async function() {
    AuthorizationAPI.makeResourceLinkable(mockedRequestBuilder, {
      body: {
        allowedActions: []
      },
      resource: ""
    });
  });

  it("removeResourceLinkability", async function() {
    AuthorizationAPI.removeResourceLinkability(mockedRequestBuilder, {
      availableToHrn: "",
      resource: ""
    });
  });

  it("updateResourceLinkability", async function() {
    AuthorizationAPI.updateResourceLinkability(mockedRequestBuilder, {
      availableToHrn: "",
      resource: "",
      body: {
        allowedActions: []
      }
    });
  });

  it("attachProjectPolicyToMember", async function() {
    AuthorizationAPI.attachProjectPolicyToMember(mockedRequestBuilder, {
      member: "",
      policy: "",
      project: ""
    });
  });

  it("createProjectPolicy", async function() {
    AuthorizationAPI.createProjectPolicy(mockedRequestBuilder, {
      body: {
        id: "",
        name: "",
        permissions: [
          {
            allowedActions: [""]
          }
        ]
      },
      project: ""
    });
  });

  it("deleteProjectPolicy", async function() {
    AuthorizationAPI.deleteProjectPolicy(mockedRequestBuilder, {
      policy: "",
      project: ""
    });
  });

  it("detachProjectPolicyFromMember", async function() {
    AuthorizationAPI.detachProjectPolicyFromMember(mockedRequestBuilder, {
      member: "",
      policy: "",
      project: ""
    });
  });

  it("getAllProjectMembersWithAttachedPolicy", async function() {
    AuthorizationAPI.getAllProjectMembersWithAttachedPolicy(
      mockedRequestBuilder,
      {
        policy: "",
        project: ""
      }
    );
  });

  it("getAttachedProjectPoliciesForMember", async function() {
    AuthorizationAPI.getAttachedProjectPoliciesForMember(mockedRequestBuilder, {
      member: "",
      project: ""
    });
  });

  it("getAttachedProjectPolicyForMember", async function() {
    AuthorizationAPI.getAttachedProjectPolicyForMember(mockedRequestBuilder, {
      member: "",
      policy: "",
      project: ""
    });
  });

  it("getProjectPolicy", async function() {
    AuthorizationAPI.getProjectPolicy(mockedRequestBuilder, {
      policy: "",
      project: ""
    });
  });

  it("getProjectPolicyList", async function() {
    AuthorizationAPI.getProjectPolicyList(mockedRequestBuilder, {
      project: ""
    });
  });

  it("setAttachedProjectPoliciesToMember", async function() {
    AuthorizationAPI.setAttachedProjectPoliciesToMember(mockedRequestBuilder, {
      body: [],
      member: "",
      project: ""
    });
  });

  it("updateProjectPolicy", async function() {
    AuthorizationAPI.updateProjectPolicy(mockedRequestBuilder, {
      body: {
        id: "",
        name: "",
        permissions: []
      },
      policy: "",
      project: ""
    });
  });

  it("getResourceActionsForProject", async function() {
    AuthorizationAPI.getResourceActionsForProject(mockedRequestBuilder, {
      project: "",
      resource: "",
      type: ""
    });
  });

  it("getResourceTypeActionList", async function() {
    AuthorizationAPI.getResourceTypeActionList(mockedRequestBuilder, {
      resourceType: "artifact",
      type: ""
    });
  });
});
