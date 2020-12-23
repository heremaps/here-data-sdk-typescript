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

    AuthorizationAPI.getEntityGroupMembership(mockedRequestBuilder, {
      member: "",
      realm: "",
      count: 4,
      pageToken: ""
    });
  });

  it("getEntityManagedGroups", async function() {
    AuthorizationAPI.getEntityManagedGroups(mockedRequestBuilder, {
      member: "",
      realm: ""
    });
    AuthorizationAPI.getEntityManagedGroups(mockedRequestBuilder, {
      member: "",
      realm: "",
      count: 4,
      pageToken: ""
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
      realm: "",
      count: 4
    });

    AuthorizationAPI.getRealmMembers(mockedRequestBuilder, {
      realm: "",
      count: 4,
      pageToken: "",
      entityType: "",
      q: ""
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

    AuthorizationAPI.searchRealmMemberInvites(mockedRequestBuilder, {
      realm: "",
      count: 4,
      pageToken: "",
      group: ""
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
    AuthorizationAPI.listGrants(mockedRequestBuilder, {
      resourceHrn: "",
      count: 4,
      entityType: "",
      pageToken: ""
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

    AuthorizationAPI.getEntityGroupMembership(mockedRequestBuilder, {
      member: "",
      realm: "",
      count: 4,
      pageToken: ""
    });
  });

  it("getMyRoles", async function() {
    AuthorizationAPI.getMyRoles(mockedRequestBuilder);
    AuthorizationAPI.getMyRoles(mockedRequestBuilder, {
      count: 4,
      pageToken: ""
    });
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

    AuthorizationAPI.getRoleEntities(mockedRequestBuilder, {
      role: "",
      count: 4,
      pageToken: ""
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

    AuthorizationAPI.getRolePermissions(mockedRequestBuilder, {
      role: "",
      count: 4,
      pageToken: ""
    });
  });

  it("getRoles", async function() {
    AuthorizationAPI.getRoles(mockedRequestBuilder);
    AuthorizationAPI.getRoles(mockedRequestBuilder, {
      count: 4,
      pageToken: "",
      resource: "",
      roleName: ""
    });
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

    AuthorizationAPI.getGroupMembers(mockedRequestBuilder, {
      groupId: "",
      count: 4,
      entityType: "",
      pageToken: ""
    });
  });

  it("getGroupRoles", async function() {
    AuthorizationAPI.getGroupRoles(mockedRequestBuilder, {
      groupId: ""
    });

    AuthorizationAPI.getGroupRoles(mockedRequestBuilder, {
      groupId: "",
      count: 4,
      pageToken: ""
    });
  });

  it("getGroups", async function() {
    AuthorizationAPI.getGroups(mockedRequestBuilder);
    AuthorizationAPI.getGroups(mockedRequestBuilder, {
      count: 4,
      pageToken: "",
      q: ""
    });
  });

  it("getMyGroups", async function() {
    AuthorizationAPI.getMyGroups(mockedRequestBuilder);

    AuthorizationAPI.getMyGroups(mockedRequestBuilder, {
      count: 4,
      pageToken: ""
    });
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

    AuthorizationAPI.addProjectMember(mockedRequestBuilder, {
      member: "",
      project: "",
      xCorrelationID: ""
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

    AuthorizationAPI.addProjectResourceRelation(mockedRequestBuilder, {
      body: {},
      project: "",
      relation: "home",
      resource: "",
      type: "artifact",
      xCorrelationID: ""
    });
  });

  it("checkProjectExistance", async function() {
    AuthorizationAPI.checkProjectExistance(mockedRequestBuilder, {
      project: ""
    });

    AuthorizationAPI.checkProjectExistance(mockedRequestBuilder, {
      project: "",
      xCorrelationID: ""
    });
  });

  it("createProject", async function() {
    AuthorizationAPI.createProject(mockedRequestBuilder, {
      body: {
        id: "",
        name: ""
      }
    });

    AuthorizationAPI.createProject(mockedRequestBuilder, {
      body: {
        id: "",
        name: ""
      },
      xCorrelationID: ""
    });
  });

  it("deleteProject", async function() {
    AuthorizationAPI.deleteProject(mockedRequestBuilder, {
      project: ""
    });

    AuthorizationAPI.deleteProject(mockedRequestBuilder, {
      project: "",
      xCorrelationID: ""
    });
  });

  it("deleteProjectMember", async function() {
    AuthorizationAPI.deleteProjectMember(mockedRequestBuilder, {
      member: "",
      project: ""
    });

    AuthorizationAPI.deleteProjectMember(mockedRequestBuilder, {
      member: "",
      project: "",
      xCorrelationID: ""
    });
  });

  it("deleteProjectResourceReference", async function() {
    AuthorizationAPI.deleteProjectResourceReference(mockedRequestBuilder, {
      body: {},
      project: "",
      relation: "",
      resource: ""
    });

    AuthorizationAPI.deleteProjectResourceReference(mockedRequestBuilder, {
      body: {},
      project: "",
      relation: "",
      resource: "",
      xCorrelationID: ""
    });
  });

  it("deleteProjectResourceReference", async function() {
    AuthorizationAPI.deleteProjectResourceReference(mockedRequestBuilder, {
      body: {},
      project: "",
      relation: "",
      resource: ""
    });

    AuthorizationAPI.deleteProjectResourceReference(mockedRequestBuilder, {
      body: {},
      project: "",
      relation: "",
      resource: "",
      xCorrelationID: ""
    });
  });

  it("getAllProjectList", async function() {
    AuthorizationAPI.getAllProjectList(mockedRequestBuilder, {});

    AuthorizationAPI.getAllProjectList(mockedRequestBuilder, {
      limit: 5,
      pageToken: "",
      xCorrelationID: ""
    });
  });

  it("getProject", async function() {
    AuthorizationAPI.getProject(mockedRequestBuilder, {
      project: ""
    });
    AuthorizationAPI.getProject(mockedRequestBuilder, {
      project: "",
      xCorrelationID: ""
    });
  });

  it("getProjectList", async function() {
    AuthorizationAPI.getProjectList(mockedRequestBuilder, {});
    AuthorizationAPI.getProjectList(mockedRequestBuilder, {
      canManage: true,
      isMember: true,
      limit: 4,
      pageToken: "",
      xCorrelationID: ""
    });
  });

  it("getProjectMember", async function() {
    AuthorizationAPI.getProjectMember(mockedRequestBuilder, {
      member: "",
      project: ""
    });
    AuthorizationAPI.getProjectMember(mockedRequestBuilder, {
      member: "",
      project: "",
      xCorrelationID: ""
    });
  });

  it("getProjectResource", async function() {
    AuthorizationAPI.getProjectResource(mockedRequestBuilder, {
      project: "",
      resource: ""
    });
    AuthorizationAPI.getProjectResource(mockedRequestBuilder, {
      project: "",
      resource: "",
      relation: "home",
      xCorrelationID: ""
    });
  });

  it("leaveProject", async function() {
    AuthorizationAPI.leaveProject(mockedRequestBuilder, {
      project: ""
    });

    AuthorizationAPI.leaveProject(mockedRequestBuilder, {
      project: "",
      xCorrelationID: ""
    });
  });

  it("listProjectMembers", async function() {
    AuthorizationAPI.listProjectMembers(mockedRequestBuilder, {
      project: ""
    });

    AuthorizationAPI.listProjectMembers(mockedRequestBuilder, {
      project: "",
      limit: 4,
      onlyIncludeIdentities: true,
      pageToken: "",
      xCorrelationID: ""
    });
  });

  it("listProjectResources", async function() {
    AuthorizationAPI.listProjectResources(mockedRequestBuilder, {
      project: ""
    });

    AuthorizationAPI.listProjectResources(mockedRequestBuilder, {
      project: "",
      limit: 4,
      pageToken: "",
      relation: "home",
      type: "artifact",
      xCorrelationID: ""
    });
  });

  it("patchProject", async function() {
    AuthorizationAPI.patchProject(mockedRequestBuilder, {
      body: {},
      project: ""
    });

    AuthorizationAPI.patchProject(mockedRequestBuilder, {
      body: {},
      project: "",
      xCorrelationID: ""
    });
  });

  it("getListOfWaysResourceIsLinkable", async function() {
    AuthorizationAPI.getListOfWaysResourceIsLinkable(mockedRequestBuilder, {
      resource: ""
    });

    AuthorizationAPI.getListOfWaysResourceIsLinkable(mockedRequestBuilder, {
      resource: "",
      limit: 4,
      pageToken: "",
      xCorrelationID: ""
    });
  });

  it("getResource", async function() {
    AuthorizationAPI.getResource(mockedRequestBuilder, {
      referenceable: true,
      resource: ""
    });

    AuthorizationAPI.getResource(mockedRequestBuilder, {
      referenceable: true,
      resource: "",
      xCorrelationID: ""
    });
  });

  it("getResourceLinkability", async function() {
    AuthorizationAPI.getResourceLinkability(mockedRequestBuilder, {
      availableToHrn: "",
      resource: ""
    });

    AuthorizationAPI.getResourceLinkability(mockedRequestBuilder, {
      availableToHrn: "",
      resource: "",
      xCorrelationID: ""
    });
  });

  it("getResourceProjects", async function() {
    AuthorizationAPI.getResourceProjects(mockedRequestBuilder, {
      resource: ""
    });

    AuthorizationAPI.getResourceProjects(mockedRequestBuilder, {
      resource: "",
      limit: 4,
      pageToken: "",
      relation: "home",
      xCorrelationID: ""
    });
  });

  it("getResources", async function() {
    AuthorizationAPI.getResources(mockedRequestBuilder, {
      type: "artifact"
    });

    AuthorizationAPI.getResources(mockedRequestBuilder, {
      type: "artifact",
      access: "",
      limit: 4,
      linkable: true,
      pageToken: "",
      referenceable: true,
      xCorrelationID: ""
    });
  });

  it("listRealmResources", async function() {
    AuthorizationAPI.listRealmResources(mockedRequestBuilder, {});
    AuthorizationAPI.listRealmResources(mockedRequestBuilder, {
      limit: 4,
      pageToken: "",
      type: "artifact",
      xCorrelationID: ""
    });
  });

  it("makeResourceLinkable", async function() {
    AuthorizationAPI.makeResourceLinkable(mockedRequestBuilder, {
      body: {
        allowedActions: []
      },
      resource: ""
    });

    AuthorizationAPI.makeResourceLinkable(mockedRequestBuilder, {
      body: {
        allowedActions: []
      },
      resource: "",
      xCorrelationID: ""
    });
  });

  it("removeResourceLinkability", async function() {
    AuthorizationAPI.removeResourceLinkability(mockedRequestBuilder, {
      availableToHrn: "",
      resource: ""
    });

    AuthorizationAPI.removeResourceLinkability(mockedRequestBuilder, {
      availableToHrn: "",
      resource: "",
      xCorrelationID: ""
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

    AuthorizationAPI.updateResourceLinkability(mockedRequestBuilder, {
      availableToHrn: "",
      resource: "",
      body: {
        allowedActions: []
      },
      xCorrelationID: ""
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

    AuthorizationAPI.getAllProjectMembersWithAttachedPolicy(
      mockedRequestBuilder,
      {
        policy: "",
        project: "",
        limit: 4,
        pageToken: "",
        xCorrelationID: ""
      }
    );
  });

  it("getAttachedProjectPoliciesForMember", async function() {
    AuthorizationAPI.getAttachedProjectPoliciesForMember(mockedRequestBuilder, {
      member: "",
      project: ""
    });

    AuthorizationAPI.getAttachedProjectPoliciesForMember(mockedRequestBuilder, {
      member: "",
      project: "",
      limit: 4,
      pageToken: "",
      xCorrelationID: ""
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

    AuthorizationAPI.getProjectPolicyList(mockedRequestBuilder, {
      project: "",
      limit: 4,
      pageToken: "",
      projectPolicyType: "",
      xCorrelationID: ""
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

    AuthorizationAPI.getResourceActionsForProject(mockedRequestBuilder, {
      project: "",
      resource: "",
      type: "",
      xCorrelationID: ""
    });
  });

  it("getResourceTypeActionList", async function() {
    AuthorizationAPI.getResourceTypeActionList(mockedRequestBuilder, {
      resourceType: "artifact",
      type: ""
    });

    AuthorizationAPI.getResourceTypeActionList(mockedRequestBuilder, {
      resourceType: "artifact",
      type: "",
      xCorrelationID: ""
    });
  });
});
