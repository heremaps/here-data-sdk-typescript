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

import { RequestBuilder, UrlBuilder } from "../lib/RequestBuilder";

chai.use(sinonChai);

const expect = chai.expect;

describe("AuthorizationApi", function() {
    it("getEntityGroupMembership", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: RequestInit) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/realms/mocked-realm/members/mocked-member/groups?pageToken=mocked-page-token&count=5"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.getEntityGroupMembership(
            (builder as unknown) as RequestBuilder,
            {
                realm: "mocked-realm",
                member: "mocked-member",
                count: 5,
                pageToken: "mocked-page-token"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("getEntityManagedGroups", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: RequestInit) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/realms/mocked-realm/members/mocked-member/managedGroups?pageToken=mocked-page-token&count=5"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.getEntityManagedGroups(
            (builder as unknown) as RequestBuilder,
            {
                realm: "mocked-realm",
                member: "mocked-member",
                count: 5,
                pageToken: "mocked-page-token"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("getRealmMember", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: RequestInit) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/realms/mocked-realm/members/mocked-member"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.getRealmMember(
            (builder as unknown) as RequestBuilder,
            {
                realm: "mocked-realm",
                member: "mocked-member"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("getRealmMembers", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: RequestInit) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/realms/mocked-realm/members?pageToken=mocked-page-token&count=5&entityType=mocked-entityType&q=mocked-query&state=mocked-state"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.getRealmMembers(
            (builder as unknown) as RequestBuilder,
            {
                realm: "mocked-realm",
                pageToken: "mocked-page-token",
                count: 5,
                entityType: "mocked-entityType",
                q: "mocked-query",
                state: "mocked-state"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("cancelRealmMemberInvite", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            requestBlob: async (
                urlBuilder: UrlBuilder,
                options: RequestInit
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/realms/mocked-realm/invites/mocked-invite"
                );
                expect(options.method).to.be.equal("DELETE");
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.cancelRealmMemberInvite(
            (builder as unknown) as RequestBuilder,
            {
                realm: "mocked-realm",
                invite: "mocked-invite"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("createRealmMemberInvite", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: RequestInit) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/realms/mocked-realm/invites"
                );
                expect(options.method).to.be.equal("POST");
                expect(options.body).equals(
                    `{"emailAddress":"mocked-mail","firstName":"mocked-firstName","lastName":"mocked-lastName","groupHrns":["mocked-group-1","mocked-group-2"]}`
                );
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.createRealmMemberInvite(
            (builder as unknown) as RequestBuilder,
            {
                realm: "mocked-realm",
                body: {
                    emailAddress: "mocked-mail",
                    firstName: "mocked-firstName",
                    lastName: "mocked-lastName",
                    groupHrns: ["mocked-group-1", "mocked-group-2"]
                }
            }
        );

        expect(result).to.be.equal("success");
    });

    it("resendRealmMemberInvite", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            requestBlob: async (
                urlBuilder: UrlBuilder,
                options: RequestInit
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/realms/mocked-realm/invites/mocked-invite"
                );
                expect(options.method).to.be.equal("POST");
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.resendRealmMemberInvite(
            (builder as unknown) as RequestBuilder,
            {
                realm: "mocked-realm",
                invite: "mocked-invite"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("searchRealmMemberInvites", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: RequestInit) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/realms/mocked-realm/invites?group=mocked-group&pageToken=mocked-page-token&count=5&q=mocked-query"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.searchRealmMemberInvites(
            (builder as unknown) as RequestBuilder,
            {
                realm: "mocked-realm",
                group: "mocked-group",
                pageToken: "mocked-page-token",
                count: 5,
                q: "mocked-query"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("addGrant", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: RequestInit) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/grants/resources/mocked-resourceHrn/entities/mocked-entityId/actions/mocked-actionId?entityType=mocked-entityType"
                );
                expect(options.method).to.be.equal("POST");
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.addGrant(
            (builder as unknown) as RequestBuilder,
            {
                resourceHrn: "mocked-resourceHrn",
                entityId: "mocked-entityId",
                actionId: "mocked-actionId",
                entityType: "mocked-entityType"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("getGrant", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: RequestInit) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/grants/resources/mocked-resourceHrn/entities/mocked-entityId/actions/mocked-actionId?entityType=mocked-entityType"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.getGrant(
            (builder as unknown) as RequestBuilder,
            {
                resourceHrn: "mocked-resourceHrn",
                entityId: "mocked-entityId",
                actionId: "mocked-actionId",
                entityType: "mocked-entityType"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("getGrants", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: RequestInit) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/grants/resources/mocked-resourceHrn/entities/mocked-entityId?entityType=mocked-entityType"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.getGrants(
            (builder as unknown) as RequestBuilder,
            {
                resourceHrn: "mocked-resourceHrn",
                entityId: "mocked-entityId",
                entityType: "mocked-entityType"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("listGrants", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: RequestInit) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/grants/resources/mocked-resourceHrn/entities?entityType=mocked-entityType&pageToken=mocked-pageToken&count=5"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.listGrants(
            (builder as unknown) as RequestBuilder,
            {
                resourceHrn: "mocked-resourceHrn",
                entityType: "mocked-entityType",
                pageToken: "mocked-pageToken",
                count: 5
            }
        );

        expect(result).to.be.equal("success");
    });

    it("removeGrant", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            requestBlob: async (
                urlBuilder: UrlBuilder,
                options: RequestInit
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/grants/resources/mocked-resourceHrn/entities/mocked-entityId/actions/mocked-actionId?entityType=mocked-entityType"
                );
                expect(options.method).to.be.equal("DELETE");
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.removeGrant(
            (builder as unknown) as RequestBuilder,
            {
                resourceHrn: "mocked-resourceHrn",
                entityId: "mocked-entityId",
                actionId: "mocked-actionId",
                entityType: "mocked-entityType"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("addRoleEntity", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            requestBlob: async (
                urlBuilder: UrlBuilder,
                options: RequestInit
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/roles/mocked-role/entities/mocked-entity"
                );
                expect(options.method).to.be.equal("POST");
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.addRoleEntity(
            (builder as unknown) as RequestBuilder,
            {
                role: "mocked-role",
                entity: "mocked-entity"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("deleteRoleEntity", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            requestBlob: async (
                urlBuilder: UrlBuilder,
                options: RequestInit
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/roles/mocked-role/entities/mocked-entity"
                );
                expect(options.method).to.be.equal("DELETE");
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.deleteRoleEntity(
            (builder as unknown) as RequestBuilder,
            {
                role: "mocked-role",
                entity: "mocked-entity"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("getMyRoles", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: RequestInit) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/roles/me?pageToken=mocked-pageToken&count=5"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.getMyRoles(
            (builder as unknown) as RequestBuilder,
            {
                pageToken: "mocked-pageToken",
                count: 5
            }
        );

        expect(result).to.be.equal("success");
    });

    it("getRole", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: RequestInit) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/roles/mocked-role"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.getRole(
            (builder as unknown) as RequestBuilder,
            {
                role: "mocked-role"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("getRoleEntities", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: RequestInit) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/roles/mocked-role/entities?pageToken=mocked-pageToken&count=5"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.getRoleEntities(
            (builder as unknown) as RequestBuilder,
            {
                role: "mocked-role",
                pageToken: "mocked-pageToken",
                count: 5
            }
        );

        expect(result).to.be.equal("success");
    });

    it("getRoleEntity", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: RequestInit) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/roles/mocked-role/entities/mocked-entity"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.getRoleEntity(
            (builder as unknown) as RequestBuilder,
            {
                role: "mocked-role",
                entity: "mocked-entity"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("getRolePermissions", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: RequestInit) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/roles/mocked-role/permissions?pageToken=mocked-pageToken&count=5"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.getRolePermissions(
            (builder as unknown) as RequestBuilder,
            {
                role: "mocked-role",
                pageToken: "mocked-pageToken",
                count: 5
            }
        );

        expect(result).to.be.equal("success");
    });

    it("getRolePermission", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: RequestInit) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/roles/mocked-role/permissions/mocked-permission"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.getRolePermission(
            (builder as unknown) as RequestBuilder,
            {
                role: "mocked-role",
                permission: "mocked-permission"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("getRoles", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: RequestInit) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/roles?pageToken=mocked-pageToken&count=5&roleName=mocked-roleName&resource=mocked-resource"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.getRoles(
            (builder as unknown) as RequestBuilder,
            {
                pageToken: "mocked-pageToken",
                count: 5,
                resource: "mocked-resource",
                roleName: "mocked-roleName"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("addGroupMember", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            requestBlob: async (
                urlBuilder: UrlBuilder,
                options: RequestInit
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/groups/mocked-groupId/members/mocked-member"
                );
                expect(options.method).to.be.equal("POST");
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.addGroupMember(
            (builder as unknown) as RequestBuilder,
            {
                groupId: "mocked-groupId",
                member: "mocked-member"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("createGroup", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: RequestInit) => {
                expect(urlBuilder.url).to.be.equal("http://mocked.url/groups");
                expect(options.method).to.be.equal("POST");
                expect(options.body).to.be.equal(
                    // tslint:disable-next-line: quotemark
                    '{"name":"mocked-group","description":"mocked-desc","hrn":"mocked-hrn","id":"mocked-id","realm":"mocked-realm"}'
                );
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.createGroup(
            (builder as unknown) as RequestBuilder,
            {
                body: {
                    name: "mocked-group",
                    description: "mocked-desc",
                    hrn: "mocked-hrn",
                    id: "mocked-id",
                    realm: "mocked-realm"
                }
            }
        );

        expect(result).to.be.equal("success");
    });

    it("deleteGroup", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            requestBlob: async (
                urlBuilder: UrlBuilder,
                options: RequestInit
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/groups/mocked-groupId"
                );
                expect(options.method).to.be.equal("DELETE");
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.deleteGroup(
            (builder as unknown) as RequestBuilder,
            {
                groupId: "mocked-groupId"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("getGroup", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: RequestInit) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/groups/mocked-groupId"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.getGroup(
            (builder as unknown) as RequestBuilder,
            {
                groupId: "mocked-groupId"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("getGroupMember", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: RequestInit) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/groups/mocked-groupId/members/mocked-member"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.getGroupMember(
            (builder as unknown) as RequestBuilder,
            {
                groupId: "mocked-groupId",
                member: "mocked-member"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("getGroupMembers", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: RequestInit) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/groups/mocked-groupId/members?pageToken=mocked-pageToken&count=5&entityType=mocked-entityType"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.getGroupMembers(
            (builder as unknown) as RequestBuilder,
            {
                groupId: "mocked-groupId",
                pageToken: "mocked-pageToken",
                count: 5,
                entityType: "mocked-entityType"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("getGroupRoles", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: RequestInit) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/groups/mocked-groupId/roles?pageToken=mocked-pageToken&count=5"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.getGroupRoles(
            (builder as unknown) as RequestBuilder,
            {
                groupId: "mocked-groupId",
                pageToken: "mocked-pageToken",
                count: 5
            }
        );

        expect(result).to.be.equal("success");
    });

    it("getGroups", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: RequestInit) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/groups?pageToken=mocked-pageToken&count=5&q=mocked-q"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.getGroups(
            (builder as unknown) as RequestBuilder,
            {
                pageToken: "mocked-pageToken",
                count: 5,
                q: "mocked-q"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("getMyGroups", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: RequestInit) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/groups/me?pageToken=mocked-pageToken&count=5"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.getMyGroups(
            (builder as unknown) as RequestBuilder,
            {
                pageToken: "mocked-pageToken",
                count: 5
            }
        );

        expect(result).to.be.equal("success");
    });

    it("leaveGroup", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            requestBlob: async (
                urlBuilder: UrlBuilder,
                options: RequestInit
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/groups/mocked-groupId/members/me"
                );
                expect(options.method).to.be.equal("DELETE");
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.leaveGroup(
            (builder as unknown) as RequestBuilder,
            {
                groupId: "mocked-groupId"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("removeGroupMember", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            requestBlob: async (
                urlBuilder: UrlBuilder,
                options: RequestInit
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/groups/mocked-groupId/members/mocked-member"
                );
                expect(options.method).to.be.equal("DELETE");
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.removeGroupMember(
            (builder as unknown) as RequestBuilder,
            {
                groupId: "mocked-groupId",
                member: "mocked-member"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("updateGroup", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: RequestInit) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/groups/mocked-groupId"
                );
                expect(options.method).to.be.equal("POST");
                expect(options.body).to.be.equal(
                    // tslint:disable-next-line: quotemark
                    '{"name":"mocked-name","description":"mocked-desc","hrn":"mocked-hrn","id":"mocked-id","realm":"mocked-realm"}'
                );
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.updateGroup(
            (builder as unknown) as RequestBuilder,
            {
                groupId: "mocked-groupId",
                body: {
                    name: "mocked-name",
                    description: "mocked-desc",
                    hrn: "mocked-hrn",
                    id: "mocked-id",
                    realm: "mocked-realm"
                }
            }
        );

        expect(result).to.be.equal("success");
    });

    it("addProjectMember", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            requestBlob: async (
                urlBuilder: UrlBuilder,
                options: RequestInit & any
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/projects/mocked-project/members/mocked-member"
                );
                expect(options.method).to.be.equal("POST");
                expect(options.headers["X-Correlation-ID"]).to.be.equal(
                    "mocked-xCorrelationID"
                );

                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.addProjectMember(
            (builder as unknown) as RequestBuilder,
            {
                project: "mocked-project",
                member: "mocked-member",
                xCorrelationID: "mocked-xCorrelationID"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("addProjectResourceRelation", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (
                urlBuilder: UrlBuilder,
                options: RequestInit & any
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/projects/mocked-project/resources/mocked-resource?relation=home&type=catalog"
                );
                expect(options.method).to.be.equal("POST");

                expect(options.body).to.be.equal(
                    JSON.stringify({ actions: ["mocked-action"] })
                );
                expect(options.headers["X-Correlation-ID"]).to.be.equal(
                    "mocked-xCorrelationID"
                );

                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.addProjectResourceRelation(
            (builder as unknown) as RequestBuilder,
            {
                project: "mocked-project",
                resource: "mocked-resource",
                body: {
                    actions: ["mocked-action"]
                },
                relation: "home",
                type: "catalog",
                xCorrelationID: "mocked-xCorrelationID"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("checkProjectExistance", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            requestBlob: async (
                urlBuilder: UrlBuilder,
                options: RequestInit & any
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/projects/mocked-project"
                );
                expect(options.method).to.be.equal("HEAD");
                expect(options.headers["X-Correlation-ID"]).to.be.equal(
                    "mocked-xCorrelationID"
                );

                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.checkProjectExistance(
            (builder as unknown) as RequestBuilder,
            {
                project: "mocked-project",
                xCorrelationID: "mocked-xCorrelationID"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("createProject", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (
                urlBuilder: UrlBuilder,
                options: RequestInit & any
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/projects"
                );
                expect(options.method).to.be.equal("POST");
                expect(options.body).to.be.equal(
                    JSON.stringify({
                        id: "mocked-project-id",
                        name: "mocked-project-name",
                        description: "mocked-project-description"
                    })
                );
                expect(options.headers["X-Correlation-ID"]).to.be.equal(
                    "mocked-xCorrelationID"
                );

                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.createProject(
            (builder as unknown) as RequestBuilder,
            {
                body: {
                    id: "mocked-project-id",
                    name: "mocked-project-name",
                    description: "mocked-project-description"
                },
                xCorrelationID: "mocked-xCorrelationID"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("deleteProject", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            requestBlob: async (
                urlBuilder: UrlBuilder,
                options: RequestInit & any
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/projects/mocked-project"
                );
                expect(options.method).to.be.equal("DELETE");
                expect(options.headers["X-Correlation-ID"]).to.be.equal(
                    "mocked-xCorrelationID"
                );

                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.deleteProject(
            (builder as unknown) as RequestBuilder,
            {
                project: "mocked-project",
                xCorrelationID: "mocked-xCorrelationID"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("deleteProjectMember", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            requestBlob: async (
                urlBuilder: UrlBuilder,
                options: RequestInit & any
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/projects/mocked-project/members/mocked-member"
                );
                expect(options.method).to.be.equal("DELETE");
                expect(options.headers["X-Correlation-ID"]).to.be.equal(
                    "mocked-xCorrelationID"
                );

                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.deleteProjectMember(
            (builder as unknown) as RequestBuilder,
            {
                project: "mocked-project",
                member: "mocked-member",
                xCorrelationID: "mocked-xCorrelationID"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("deleteProjectResourceReference", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            requestBlob: async (
                urlBuilder: UrlBuilder,
                options: RequestInit & any
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/projects/mocked-project/resources/mocked-resource?relation=mocked-relation"
                );
                expect(options.method).to.be.equal("DELETE");
                expect(options.headers["X-Correlation-ID"]).to.be.equal(
                    "mocked-xCorrelationID"
                );
                expect(options.body).to.be.equal(
                    JSON.stringify({
                        actions: ["mocked-action"]
                    })
                );

                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.deleteProjectResourceReference(
            (builder as unknown) as RequestBuilder,
            {
                project: "mocked-project",
                relation: "mocked-relation",
                resource: "mocked-resource",
                body: {
                    actions: ["mocked-action"]
                },
                xCorrelationID: "mocked-xCorrelationID"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("getAllProjectList", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (
                urlBuilder: UrlBuilder,
                options: RequestInit & any
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/projects?limit=5&pageToken=mocked-page-token"
                );
                expect(options.method).to.be.equal("GET");
                expect(options.headers["X-Correlation-ID"]).to.be.equal(
                    "mocked-xCorrelationID"
                );

                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.getAllProjectList(
            (builder as unknown) as RequestBuilder,
            {
                limit: 5,
                pageToken: "mocked-page-token",
                xCorrelationID: "mocked-xCorrelationID"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("getProject", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (
                urlBuilder: UrlBuilder,
                options: RequestInit & any
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/projects/mocked-project"
                );
                expect(options.method).to.be.equal("GET");
                expect(options.headers["X-Correlation-ID"]).to.be.equal(
                    "mocked-xCorrelationID"
                );

                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.getProject(
            (builder as unknown) as RequestBuilder,
            {
                project: "mocked-project",
                xCorrelationID: "mocked-xCorrelationID"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("getProjectList", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (
                urlBuilder: UrlBuilder,
                options: RequestInit & any
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/projects/me?limit=5&pageToken=mocked-page-token&canManage=true&isMember=true"
                );
                expect(options.method).to.be.equal("GET");
                expect(options.headers["X-Correlation-ID"]).to.be.equal(
                    "mocked-xCorrelationID"
                );

                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.getProjectList(
            (builder as unknown) as RequestBuilder,
            {
                limit: 5,
                pageToken: "mocked-page-token",
                xCorrelationID: "mocked-xCorrelationID",
                canManage: true,
                isMember: true
            }
        );

        expect(result).to.be.equal("success");
    });

    it("getProjectMember", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (
                urlBuilder: UrlBuilder,
                options: RequestInit & any
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/projects/mocked-project/members/mocked-member"
                );
                expect(options.method).to.be.equal("GET");
                expect(options.headers["X-Correlation-ID"]).to.be.equal(
                    "mocked-xCorrelationID"
                );

                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.getProjectMember(
            (builder as unknown) as RequestBuilder,
            {
                project: "mocked-project",
                member: "mocked-member",
                xCorrelationID: "mocked-xCorrelationID"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("getProjectResource", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (
                urlBuilder: UrlBuilder,
                options: RequestInit & any
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/projects/mocked-project/resources/mocked-resource?relation=home"
                );
                expect(options.method).to.be.equal("GET");
                expect(options.headers["X-Correlation-ID"]).to.be.equal(
                    "mocked-xCorrelationID"
                );

                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.getProjectResource(
            (builder as unknown) as RequestBuilder,
            {
                project: "mocked-project",
                resource: "mocked-resource",
                relation: "home",
                xCorrelationID: "mocked-xCorrelationID"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("leaveProject", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            requestBlob: async (
                urlBuilder: UrlBuilder,
                options: RequestInit & any
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/projects/mocked-project/members/me"
                );
                expect(options.method).to.be.equal("DELETE");
                expect(options.headers["X-Correlation-ID"]).to.be.equal(
                    "mocked-xCorrelationID"
                );

                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.leaveProject(
            (builder as unknown) as RequestBuilder,
            {
                project: "mocked-project",
                xCorrelationID: "mocked-xCorrelationID"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("listProjectMembers", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (
                urlBuilder: UrlBuilder,
                options: RequestInit & any
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/projects/mocked-project/members?onlyIncludeIdentities=true&limit=5&pageToken=mocked-page-token"
                );
                expect(options.method).to.be.equal("GET");
                expect(options.headers["X-Correlation-ID"]).to.be.equal(
                    "mocked-xCorrelationID"
                );

                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.listProjectMembers(
            (builder as unknown) as RequestBuilder,
            {
                project: "mocked-project",
                limit: 5,
                onlyIncludeIdentities: true,
                pageToken: "mocked-page-token",
                xCorrelationID: "mocked-xCorrelationID"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("listProjectResources", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (
                urlBuilder: UrlBuilder,
                options: RequestInit & any
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/projects/mocked-project/resources?type=catalog&relation=home&limit=5&pageToken=mocked-page-token"
                );
                expect(options.method).to.be.equal("GET");
                expect(options.headers["X-Correlation-ID"]).to.be.equal(
                    "mocked-xCorrelationID"
                );

                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.listProjectResources(
            (builder as unknown) as RequestBuilder,
            {
                project: "mocked-project",
                limit: 5,
                pageToken: "mocked-page-token",
                relation: "home",
                type: "catalog",
                xCorrelationID: "mocked-xCorrelationID"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("patchProject", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (
                urlBuilder: UrlBuilder,
                options: RequestInit & any
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/projects/mocked-project"
                );
                expect(options.method).to.be.equal("PATCH");
                expect(options.body).to.be.equal(
                    JSON.stringify({
                        description: "mocked-description",
                        name: "mocked-name"
                    })
                );
                expect(options.headers["X-Correlation-ID"]).to.be.equal(
                    "mocked-xCorrelationID"
                );

                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.patchProject(
            (builder as unknown) as RequestBuilder,
            {
                project: "mocked-project",
                body: {
                    description: "mocked-description",
                    name: "mocked-name"
                },
                xCorrelationID: "mocked-xCorrelationID"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("getResource", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (
                urlBuilder: UrlBuilder,
                options: RequestInit & any
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/resources/mocked-resource?referenceable=true"
                );
                expect(options.method).to.be.equal("GET");
                expect(options.headers["X-Correlation-ID"]).to.be.equal(
                    "mocked-xCorrelationID"
                );

                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.getResource(
            (builder as unknown) as RequestBuilder,
            {
                resource: "mocked-resource",
                referenceable: true,
                xCorrelationID: "mocked-xCorrelationID"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("getListOfWaysResourceIsLinkable", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (
                urlBuilder: UrlBuilder,
                options: RequestInit & any
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/resources/mocked-resource/linkable?limit=5&pageToken=mocked-page-token"
                );
                expect(options.method).to.be.equal("GET");
                expect(options.headers["X-Correlation-ID"]).to.be.equal(
                    "mocked-xCorrelationID"
                );

                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.getListOfWaysResourceIsLinkable(
            (builder as unknown) as RequestBuilder,
            {
                resource: "mocked-resource",
                limit: 5,
                pageToken: "mocked-page-token",
                xCorrelationID: "mocked-xCorrelationID"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("getResourceLinkability", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (
                urlBuilder: UrlBuilder,
                options: RequestInit & any
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/resources/mocked-resource/linkable/mocked-availableToHrn"
                );
                expect(options.method).to.be.equal("GET");
                expect(options.headers["X-Correlation-ID"]).to.be.equal(
                    "mocked-xCorrelationID"
                );

                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.getResourceLinkability(
            (builder as unknown) as RequestBuilder,
            {
                resource: "mocked-resource",
                availableToHrn: "mocked-availableToHrn",
                xCorrelationID: "mocked-xCorrelationID"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("getResourceProjects", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (
                urlBuilder: UrlBuilder,
                options: RequestInit & any
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/resources/mocked-resource/projects?limit=5&pageToken=mocked-page-token&relation=home"
                );
                expect(options.method).to.be.equal("GET");
                expect(options.headers["X-Correlation-ID"]).to.be.equal(
                    "mocked-xCorrelationID"
                );

                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.getResourceProjects(
            (builder as unknown) as RequestBuilder,
            {
                resource: "mocked-resource",
                limit: 5,
                pageToken: "mocked-page-token",
                relation: "home",
                xCorrelationID: "mocked-xCorrelationID"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("getResources", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (
                urlBuilder: UrlBuilder,
                options: RequestInit & any
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/resources?limit=5&pageToken=mocked-page-token&type=catalog&access=mocked-access&referenceable=true&linkable=true"
                );
                expect(options.method).to.be.equal("GET");
                expect(options.headers["X-Correlation-ID"]).to.be.equal(
                    "mocked-xCorrelationID"
                );

                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.getResources(
            (builder as unknown) as RequestBuilder,
            {
                type: "catalog",
                limit: 5,
                pageToken: "mocked-page-token",
                access: "mocked-access",
                referenceable: true,
                linkable: true,
                xCorrelationID: "mocked-xCorrelationID"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("listRealmResources", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (
                urlBuilder: UrlBuilder,
                options: RequestInit & any
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/realm/resources?limit=5&pageToken=mocked-page-token&type=catalog"
                );
                expect(options.method).to.be.equal("GET");
                expect(options.headers["X-Correlation-ID"]).to.be.equal(
                    "mocked-xCorrelationID"
                );

                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.listRealmResources(
            (builder as unknown) as RequestBuilder,
            {
                type: "catalog",
                limit: 5,
                pageToken: "mocked-page-token",
                xCorrelationID: "mocked-xCorrelationID"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("makeResourceLinkable", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (
                urlBuilder: UrlBuilder,
                options: RequestInit & any
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/resources/mocked-resource/linkable"
                );
                expect(options.method).to.be.equal("POST");
                expect(options.body).to.be.equal(
                    JSON.stringify({
                        allowedActions: ["mocked-actoin"],
                        projectHrn: "mocked-project-hrn",
                        realmHrn: "mocked-realm-hrn"
                    })
                );
                expect(options.headers["X-Correlation-ID"]).to.be.equal(
                    "mocked-xCorrelationID"
                );

                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.makeResourceLinkable(
            (builder as unknown) as RequestBuilder,
            {
                resource: "mocked-resource",
                body: {
                    allowedActions: ["mocked-actoin"],
                    projectHrn: "mocked-project-hrn",
                    realmHrn: "mocked-realm-hrn"
                },
                xCorrelationID: "mocked-xCorrelationID"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("removeResourceLinkability", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            requestBlob: async (
                urlBuilder: UrlBuilder,
                options: RequestInit & any
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/resources/mocked-resource/linkable/mocked-availableToHrn"
                );
                expect(options.method).to.be.equal("DELETE");
                expect(options.headers["X-Correlation-ID"]).to.be.equal(
                    "mocked-xCorrelationID"
                );

                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.removeResourceLinkability(
            (builder as unknown) as RequestBuilder,
            {
                resource: "mocked-resource",
                availableToHrn: "mocked-availableToHrn",
                xCorrelationID: "mocked-xCorrelationID"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("updateResourceLinkability", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (
                urlBuilder: UrlBuilder,
                options: RequestInit & any
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/resources/mocked-resource/linkable/mocked-availableToHrn"
                );
                expect(options.method).to.be.equal("PUT");
                expect(options.body).to.be.equal(
                    JSON.stringify({
                        allowedActions: ["mocked-actoin"],
                        projectHrn: "mocked-project-hrn",
                        realmHrn: "mocked-realm-hrn"
                    })
                );
                expect(options.headers["X-Correlation-ID"]).to.be.equal(
                    "mocked-xCorrelationID"
                );

                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.updateResourceLinkability(
            (builder as unknown) as RequestBuilder,
            {
                resource: "mocked-resource",
                availableToHrn: "mocked-availableToHrn",
                body: {
                    allowedActions: ["mocked-actoin"],
                    projectHrn: "mocked-project-hrn",
                    realmHrn: "mocked-realm-hrn"
                },
                xCorrelationID: "mocked-xCorrelationID"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("attachProjectPolicyToMember", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            requestBlob: async (
                urlBuilder: UrlBuilder,
                options: RequestInit & any
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/projects/mocked-project/members/mocked-member/policies/mocked-policy"
                );
                expect(options.method).to.be.equal("POST");
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.attachProjectPolicyToMember(
            (builder as unknown) as RequestBuilder,
            {
                project: "mocked-project",
                member: "mocked-member",
                policy: "mocked-policy"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("createProjectPolicy", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (
                urlBuilder: UrlBuilder,
                options: RequestInit & any
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/projects/mocked-project/policies"
                );

                expect(options.body).to.be.equal(
                    JSON.stringify({
                        id: "mocked-id",
                        name: "mocked-name",
                        permissions: [
                            {
                                allowedActions: ["mocked-action"]
                            }
                        ],
                        description: "mocked-description"
                    })
                );
                expect(options.method).to.be.equal("POST");
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.createProjectPolicy(
            (builder as unknown) as RequestBuilder,
            {
                project: "mocked-project",
                body: {
                    id: "mocked-id",
                    name: "mocked-name",
                    permissions: [
                        {
                            allowedActions: ["mocked-action"]
                        }
                    ],
                    description: "mocked-description"
                }
            }
        );

        expect(result).to.be.equal("success");
    });

    it("deleteProjectPolicy", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            requestBlob: async (
                urlBuilder: UrlBuilder,
                options: RequestInit & any
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/projects/mocked-project/policies/mocked-policy"
                );
                expect(options.method).to.be.equal("DELETE");
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.deleteProjectPolicy(
            (builder as unknown) as RequestBuilder,
            {
                project: "mocked-project",
                policy: "mocked-policy"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("detachProjectPolicyFromMember", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            requestBlob: async (
                urlBuilder: UrlBuilder,
                options: RequestInit & any
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/projects/mocked-project/members/mocked-member/policies/mocked-policy"
                );
                expect(options.method).to.be.equal("DELETE");
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.detachProjectPolicyFromMember(
            (builder as unknown) as RequestBuilder,
            {
                project: "mocked-project",
                policy: "mocked-policy",
                member: "mocked-member"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("getAllProjectMembersWithAttachedPolicy", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (
                urlBuilder: UrlBuilder,
                options: RequestInit & any
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/projects/mocked-project/policies/mocked-policy/members?limit=5&pageToken=mocked-page-token"
                );
                expect(options.method).to.be.equal("GET");
                expect(options.headers["X-Correlation-ID"]).to.be.equal(
                    "mocked-xCorelationID"
                );
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.getAllProjectMembersWithAttachedPolicy(
            (builder as unknown) as RequestBuilder,
            {
                project: "mocked-project",
                policy: "mocked-policy",
                xCorrelationID: "mocked-xCorelationID",
                limit: 5,
                pageToken: "mocked-page-token"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("getAttachedProjectPoliciesForMember", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (
                urlBuilder: UrlBuilder,
                options: RequestInit & any
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/projects/mocked-project/members/mocked-member/policies?limit=5&pageToken=mocked-page-token"
                );
                expect(options.method).to.be.equal("GET");
                expect(options.headers["X-Correlation-ID"]).to.be.equal(
                    "mocked-xCorelationID"
                );
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.getAttachedProjectPoliciesForMember(
            (builder as unknown) as RequestBuilder,
            {
                project: "mocked-project",
                member: "mocked-member",
                xCorrelationID: "mocked-xCorelationID",
                limit: 5,
                pageToken: "mocked-page-token"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("getAttachedProjectPolicyForMember", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (
                urlBuilder: UrlBuilder,
                options: RequestInit & any
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/projects/mocked-project/members/mocked-member/policies/mocked-policy"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.getAttachedProjectPolicyForMember(
            (builder as unknown) as RequestBuilder,
            {
                project: "mocked-project",
                member: "mocked-member",
                policy: "mocked-policy"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("getProjectPolicy", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (
                urlBuilder: UrlBuilder,
                options: RequestInit & any
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/projects/mocked-project/policies/mocked-policy"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.getProjectPolicy(
            (builder as unknown) as RequestBuilder,
            {
                project: "mocked-project",
                policy: "mocked-policy"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("getProjectPolicyList", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (
                urlBuilder: UrlBuilder,
                options: RequestInit & any
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/projects/mocked-project/policies?projectPolicyType=mocked-projectPolicyType&limit=5&pageToken=mocked-page-token"
                );
                expect(options.method).to.be.equal("GET");
                expect(options.headers["X-Correlation-ID"]).to.be.equal(
                    "mocked-xCorelationID"
                );
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.getProjectPolicyList(
            (builder as unknown) as RequestBuilder,
            {
                project: "mocked-project",
                projectPolicyType: "mocked-projectPolicyType",
                xCorrelationID: "mocked-xCorelationID",
                limit: 5,
                pageToken: "mocked-page-token"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("setAttachedProjectPoliciesToMember", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (
                urlBuilder: UrlBuilder,
                options: RequestInit & any
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/projects/mocked-project/members/mocked-member/policies"
                );

                expect(options.body).to.be.equal(
                    JSON.stringify([
                        {
                            policy: "mocked-policy"
                        }
                    ])
                );
                expect(options.method).to.be.equal("POST");
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.setAttachedProjectPoliciesToMember(
            (builder as unknown) as RequestBuilder,
            {
                project: "mocked-project",
                member: "mocked-member",
                body: [
                    {
                        policy: "mocked-policy"
                    }
                ]
            }
        );

        expect(result).to.be.equal("success");
    });

    it("updateProjectPolicy", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (
                urlBuilder: UrlBuilder,
                options: RequestInit & any
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/projects/mocked-project/policies/mocked-policy"
                );

                expect(options.body).to.be.equal(
                    JSON.stringify({
                        id: "mocked-id",
                        name: "mocked-name",
                        permissions: [
                            {
                                allowedActions: ["mocked-action"]
                            }
                        ],
                        description: "mocked-description"
                    })
                );
                expect(options.method).to.be.equal("PUT");
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.updateProjectPolicy(
            (builder as unknown) as RequestBuilder,
            {
                project: "mocked-project",
                policy: "mocked-policy",
                body: {
                    id: "mocked-id",
                    name: "mocked-name",
                    permissions: [
                        {
                            allowedActions: ["mocked-action"]
                        }
                    ],
                    description: "mocked-description"
                }
            }
        );

        expect(result).to.be.equal("success");
    });

    it("getResourceActionsForProject", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (
                urlBuilder: UrlBuilder,
                options: RequestInit & any
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/projects/mocked-project/resources/mocked-resource/actions?type=mocked-type"
                );
                expect(options.method).to.be.equal("GET");
                expect(options.headers["X-Correlation-ID"]).to.be.equal(
                    "mocked-xCorelationID"
                );
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.getResourceActionsForProject(
            (builder as unknown) as RequestBuilder,
            {
                project: "mocked-project",
                resource: "mocked-resource",
                xCorrelationID: "mocked-xCorelationID",
                type: "mocked-type"
            }
        );

        expect(result).to.be.equal("success");
    });

    it("getResourceTypeActionList", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (
                urlBuilder: UrlBuilder,
                options: RequestInit & any
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/resourceTypes/artifact/actions?type=mocked-type"
                );
                expect(options.method).to.be.equal("GET");
                expect(options.headers["X-Correlation-ID"]).to.be.equal(
                    "mocked-xCorelationID"
                );
                return Promise.resolve("success");
            }
        };
        const result = await AuthorizationAPI.getResourceTypeActionList(
            (builder as unknown) as RequestBuilder,
            {
                resourceType: "artifact",
                xCorrelationID: "mocked-xCorelationID",
                type: "mocked-type"
            }
        );

        expect(result).to.be.equal("success");
    });
});
