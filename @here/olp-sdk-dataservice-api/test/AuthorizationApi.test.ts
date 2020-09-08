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
});
