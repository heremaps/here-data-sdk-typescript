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

import { assert } from "chai";
import { requestToken, Token, UserAuth } from "../index";

import fetchMock = require("fetch-mock");
import { loadCredentialsFromFile } from "../lib/loadCredentialsFromFile";

const REPLY_TIMEOUT_MS = 600;
const MOCK_CREATED_TIME = 1550777140;
const MOCK_UPDATED_TIME = 1550777141;

describe("oauth-request", () => {
    // requires CONSUMER_KEY and SECRET_KEY env variables, disabled by default
    xit("requestTokenOnline", async () => {
        let consumerKey = "";
        let secretKey = "";

        assert.doesNotThrow(() => {
            consumerKey = process.env.CONSUMER_KEY as string;
            secretKey = process.env.SECRET_KEY as string;
        });
        assert.isDefined(consumerKey);
        assert.isDefined(secretKey);
        assert.isNotEmpty(consumerKey);
        assert.isNotEmpty(secretKey);

        const reply = await requestToken({
            url: "https://stg.account.api.here.com/oauth2/token",
            consumerKey,
            secretKey
        });

        assert.strictEqual(reply.tokenType, "bearer");
        assert.isAbove(reply.expiresIn, REPLY_TIMEOUT_MS);
        assert.isNotEmpty(reply.accessToken);
    });
});

describe("oauth-request-offline", () => {
    const mock_token = "eyJhbGciOiJSUzUxMiIsImN0eSI6IkpXVCIsIm";
    const mock_id = "Tt7wZRTAar";
    const mock_secret = "khcy1LMBtMZsRVn1-dn7riw9x8";

    beforeEach(() => {
        fetchMock.config.overwriteRoutes = true;
        fetchMock.post("https://account.api.here.com/oauth2/token", {
            accessToken: mock_token,
            tokenType: "bearer",
            expiresIn: 3599
        });
    });

    afterEach(() => {
        fetchMock.reset();
    });

    it("requestToken", async () => {
        const consumerKey = "key";
        const secretKey = "secret";

        const reply = await requestToken({
            url: "https://account.api.here.com/oauth2/token",
            consumerKey,
            secretKey
        });

        assert.strictEqual(reply.tokenType, "bearer");
        assert.isAbove(reply.expiresIn, REPLY_TIMEOUT_MS);
        assert.isNotEmpty(reply.accessToken);
    });

    it("getTokenAuthModeFile", async () => {
        let token: string | null = null;
        const credentialsFilePath = "./test/test-credentials.properties";
        const credentials = loadCredentialsFromFile(credentialsFilePath);

        const userAuth = new UserAuth({credentials, tokenRequester: requestToken});

        try {
            token = await userAuth.getToken();
            assert.isNotEmpty(token);
            assert.equal(mock_token, token);
        } catch (err) {
            console.error("Token not retrieved:", err);
            assert.fail();
        }
    });

    it("getTokenAuthModeForm", async () => {
        let token: string | null = null;

        const userAuth = new UserAuth({
            credentials: {
                accessKeyId: mock_id,
                accessKeySecret: mock_secret
            },
            tokenRequester: requestToken
        });

        try {

            token = await userAuth.getToken();
            assert.isNotEmpty(token);
            assert.equal(mock_token, token);
        } catch (err) {
            console.error("Token not retrieved:", err);
            assert.fail();
        }
    });

    it("validateAccessToken", async () => {
        const userAuth = new UserAuth({
            credentials: {
                accessKeyId: mock_id,
                accessKeySecret: mock_secret
            },
            tokenRequester: requestToken
        });

        fetchMock.post("https://account.api.here.com/verify/accessToken", {
            ok: true,
            statusText: "valid"
        });

        try {
            const reply = await userAuth.validateAccessToken(mock_token);
            assert.isTrue(reply);
        } catch (err) {
            console.error("Token not validated:", err);
            assert.fail();
        }
    });
});

describe("oauth-request-lookupapi", () => {
    const mock_token = "eyJhbGciOiJSUzUxMiIsImN0eSI6IkpXVCIsIm";
    const mock_id = "Tt7wZRTAar";
    const mock_secret = "khcy1LMBtMZsRVn1-dn7riw9x8";

    beforeEach(() => {
        fetchMock.config.overwriteRoutes = true;
        fetchMock.post("https://account.api.here.com/oauth2/token", {
            accessToken: mock_token,
            tokenType: "bearer",
            expiresIn: 3599
        });
    });

    afterEach(() => {
        fetchMock.reset();
    });

    it("getUserInfo-ProdEnv", async () => {
        const userAuth = new UserAuth({
            env: "here",
            credentials: {
                accessKeyId: mock_id,
                accessKeySecret: mock_secret
            },
            tokenRequester: requestToken
        });

        fetchMock.get("https://account.api.here.com/user/me", {
            userId: "userId",
            realm: "realm",
            firstname: "firstname",
            lastname: "lastname",
            email: "email",
            dob: "dob",
            language: "language",
            countryCode: "countryCode",
            emailVerified: true,
            marketingEnabled: true,
            createdTime: 1550777140,
            updatedTime: 1550777141,
            state: "state"
        });

        try {
            const reply = await userAuth.getUserInfo(mock_token);
            assert.isNotEmpty(reply);
            assert.equal("userId", reply.userId);
            assert.equal("realm", reply.realm);
            assert.equal("firstname", reply.firstname);
            assert.equal("lastname", reply.lastname);
            assert.equal("email", reply.email);
            assert.equal("dob", reply.dob);
            assert.equal("language", reply.language);
            assert.equal("countryCode", reply.countryCode);
            assert.isTrue(reply.emailVerified);
            assert.isTrue(reply.marketingEnabled);
            assert.equal(MOCK_CREATED_TIME, reply.createdTime);
            assert.equal(MOCK_UPDATED_TIME, reply.updatedTime);
            assert.equal("state", reply.state);
        } catch (err) {
            console.error("User info not retrieved:", err);
            assert.fail();
        }
    });

    it("getUserInfo-DevEnv", async () => {
        const userAuth = new UserAuth({
            env: "here-dev",
            credentials: {
                accessKeyId: mock_id,
                accessKeySecret: mock_secret
            },
            tokenRequester: requestToken
        });

        fetchMock.get("https://stg.account.api.here.com/user/me", {
            userId: "userId",
            realm: "realm",
            firstname: "firstname",
            lastname: "lastname",
            email: "email",
            dob: "dob",
            language: "language",
            countryCode: "countryCode",
            emailVerified: true,
            marketingEnabled: true,
            createdTime: 1550777140,
            updatedTime: 1550777141,
            state: "state"
        });

        try {
            const reply = await userAuth.getUserInfo(mock_token);
            assert.isNotEmpty(reply);
            assert.equal("userId", reply.userId);
            assert.equal("realm", reply.realm);
            assert.equal("firstname", reply.firstname);
            assert.equal("lastname", reply.lastname);
            assert.equal("email", reply.email);
            assert.equal("dob", reply.dob);
            assert.equal("language", reply.language);
            assert.equal("countryCode", reply.countryCode);
            assert.isTrue(reply.emailVerified);
            assert.isTrue(reply.marketingEnabled);
            assert.equal(MOCK_CREATED_TIME, reply.createdTime);
            assert.equal(MOCK_UPDATED_TIME, reply.updatedTime);
            assert.equal("state", reply.state);
        } catch (err) {
            console.error("User info not retrieved:", err);
            assert.fail();
        }
    });

    it("getUserInfo-CnEnv", async () => {
        const userAuth = new UserAuth({
            env: "here-cn",
            credentials: {
                accessKeyId: mock_id,
                accessKeySecret: mock_secret
            },
            tokenRequester: requestToken
        });

        fetchMock.get("https://elb.cn-northwest-1.account.hereapi.cn/user/me", {
            userId: "userId",
            realm: "realm",
            firstname: "firstname",
            lastname: "lastname",
            email: "email",
            dob: "dob",
            language: "language",
            countryCode: "countryCode",
            emailVerified: true,
            marketingEnabled: true,
            createdTime: 1550777140,
            updatedTime: 1550777141,
            state: "state"
        });

        try {
            const reply = await userAuth.getUserInfo(mock_token);
            assert.isNotEmpty(reply);
            assert.equal("userId", reply.userId);
            assert.equal("realm", reply.realm);
            assert.equal("firstname", reply.firstname);
            assert.equal("lastname", reply.lastname);
            assert.equal("email", reply.email);
            assert.equal("dob", reply.dob);
            assert.equal("language", reply.language);
            assert.equal("countryCode", reply.countryCode);
            assert.isTrue(reply.emailVerified);
            assert.isTrue(reply.marketingEnabled);
            assert.equal(MOCK_CREATED_TIME, reply.createdTime);
            assert.equal(MOCK_UPDATED_TIME, reply.updatedTime);
            assert.equal("state", reply.state);
        } catch (err) {
            console.error("User info not retrieved:", err);
            assert.fail();
        }
    });

    it("getUserInfo-CnDevEnv", async () => {
        const userAuth = new UserAuth({
            env: "here-cn-dev",
            credentials: {
                accessKeyId: mock_id,
                accessKeySecret: mock_secret
            },
            tokenRequester: requestToken
        });

        fetchMock.get(
            "https://elb.cn-northwest-1.account.sit.hereapi.cn/user/me",
            {
                userId: "userId",
                realm: "realm",
                firstname: "firstname",
                lastname: "lastname",
                email: "email",
                dob: "dob",
                language: "language",
                countryCode: "countryCode",
                emailVerified: true,
                marketingEnabled: true,
                createdTime: 1550777140,
                updatedTime: 1550777141,
                state: "state"
            }
        );

        try {
            const reply = await userAuth.getUserInfo(mock_token);
            assert.isNotEmpty(reply);
            assert.equal("userId", reply.userId);
            assert.equal("realm", reply.realm);
            assert.equal("firstname", reply.firstname);
            assert.equal("lastname", reply.lastname);
            assert.equal("email", reply.email);
            assert.equal("dob", reply.dob);
            assert.equal("language", reply.language);
            assert.equal("countryCode", reply.countryCode);
            assert.isTrue(reply.emailVerified);
            assert.isTrue(reply.marketingEnabled);
            assert.equal(MOCK_CREATED_TIME, reply.createdTime);
            assert.equal(MOCK_UPDATED_TIME, reply.updatedTime);
            assert.equal("state", reply.state);
        } catch (err) {
            console.error("User info not retrieved:", err);
            assert.fail();
        }
    });

    it("getUserInfo-CustomUrl", async () => {
        const userAuth = new UserAuth({
            customUrl: "http://localhost/",
            credentials: {
                accessKeyId: mock_id,
                accessKeySecret: mock_secret
            },
            tokenRequester: requestToken
        });

        fetchMock.get("http://localhost/user/me", {
            userId: "userId",
            realm: "realm",
            firstname: "firstname",
            lastname: "lastname",
            email: "email",
            dob: "dob",
            language: "language",
            countryCode: "countryCode",
            emailVerified: true,
            marketingEnabled: true,
            createdTime: 1550777140,
            updatedTime: 1550777141,
            state: "state"
        });

        try {
            const reply = await userAuth.getUserInfo(mock_token);
            assert.isNotEmpty(reply);
            assert.equal("userId", reply.userId);
            assert.equal("realm", reply.realm);
            assert.equal("firstname", reply.firstname);
            assert.equal("lastname", reply.lastname);
            assert.equal("email", reply.email);
            assert.equal("dob", reply.dob);
            assert.equal("language", reply.language);
            assert.equal("countryCode", reply.countryCode);
            assert.isTrue(reply.emailVerified);
            assert.isTrue(reply.marketingEnabled);
            assert.equal(MOCK_CREATED_TIME, reply.createdTime);
            assert.equal(MOCK_UPDATED_TIME, reply.updatedTime);
            assert.equal("state", reply.state);
        } catch (err) {
            console.error("User info not retrieved:", err);
            assert.fail();
        }
    });

    it("getUserInfo-default", async () => {
        const userAuth = new UserAuth({
            credentials: {
                accessKeyId: mock_id,
                accessKeySecret: mock_secret
            },
            tokenRequester: requestToken
        });

        fetchMock.get("https://account.api.here.com/user/me", {
            userId: "userId",
            realm: "realm",
            firstname: "firstname",
            lastname: "lastname",
            email: "email",
            dob: "dob",
            language: "language",
            countryCode: "countryCode",
            emailVerified: true,
            marketingEnabled: true,
            createdTime: 1550777140,
            updatedTime: 1550777141,
            state: "state"
        });

        try {
            const reply = await userAuth.getUserInfo(mock_token);
            assert.isNotEmpty(reply);
            assert.equal("userId", reply.userId);
            assert.equal("realm", reply.realm);
            assert.equal("firstname", reply.firstname);
            assert.equal("lastname", reply.lastname);
            assert.equal("email", reply.email);
            assert.equal("dob", reply.dob);
            assert.equal("language", reply.language);
            assert.equal("countryCode", reply.countryCode);
            assert.isTrue(reply.emailVerified);
            assert.isTrue(reply.marketingEnabled);
            assert.equal(MOCK_CREATED_TIME, reply.createdTime);
            assert.equal(MOCK_UPDATED_TIME, reply.updatedTime);
            assert.equal("state", reply.state);
        } catch (err) {
            console.error("User info not retrieved:", err);
            assert.fail();
        }
    });
});

describe("auth-request-project-scope", () => {
    let token: string | null = null;
    const mockedScope = "mocked-scope";
    const mock_id = "Tt7wZRTAar";
    const mock_secret = "khcy1LMBtMZsRVn1-dn7riw9x8";
    const mockedToken: Token = {
        accessToken: "fake-access-token",
        expiresIn: 42,
        tokenType: "fake"
    };
    const mockedTokenRequester = async (params: any): Promise<Token> => {
        assert.strictEqual(params.scope, mockedScope);
        return Promise.resolve(mockedToken);
    };

    it("Should scope be present on userAuth", async () => {
        const userAuth = new UserAuth({
        env: "here-dev",
        credentials: {
            accessKeyId: mock_id,
            accessKeySecret: mock_secret
        },
            tokenRequester: mockedTokenRequester,
            scope: mockedScope
        });

        try {
            token = await userAuth.getToken();
            assert.isNotEmpty(token);
            assert.equal(mockedToken.accessToken, token);
        } catch (err) {
            console.error("Token not retrieved:", err);
            assert.fail();
        }
    });

});
