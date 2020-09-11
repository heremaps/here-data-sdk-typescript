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
});
