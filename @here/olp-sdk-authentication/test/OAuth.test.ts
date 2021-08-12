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

import * as chai from "chai";
import { requestToken, Token, UserAuth } from "../index";

import { HttpError, SENT_WITH_PARAM } from "@here/olp-sdk-core";
import fetchMock = require("fetch-mock");
import { loadCredentialsFromFile } from "../lib/loadCredentialsFromFile";
import { OAuthArgs } from "../lib/requestToken_common";
import { TokenRequesterFn } from "../lib/UserAuth";

const REPLY_TIMEOUT_MS = 600;
const MOCK_CREATED_TIME = 1550777140;
const MOCK_UPDATED_TIME = 1550777141;

const assert = chai.assert;
const expect = chai.expect;

describe("oauth-request", function() {
    // requires CONSUMER_KEY and SECRET_KEY env variables, disabled by default
    xit("requestTokenOnline", async function() {
        let consumerKey = "";
        let secretKey = "";

        assert.doesNotThrow(function() {
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

describe("oauth-request-offline", function() {
    const mock_token = "eyJhbGciOiJSUzUxMiIsImN0eSI6IkpXVCIsIm";
    const mock_id = "mock-id";
    const mock_scrt = "mock-str";

    beforeEach(function() {
        fetchMock.config.overwriteRoutes = true;
        fetchMock.post(
            "https://account.api.here.com/oauth2/token?" + SENT_WITH_PARAM,
            {
                accessToken: mock_token,
                tokenType: "bearer",
                expiresIn: 3599
            }
        );
    });

    afterEach(function() {
        fetchMock.reset();
    });

    // tslint:disable-next-line: only-arrow-functions
    it("SHA-256 to sign token requests", async function() {
        const result = await requestToken({
            consumerKey: "mocked-key",
            secretKey: "mocked-secret",
            url: "https://account.api.here.com/oauth2/token",
            nonce: "mocked-nonce",
            scope: "mocked-scope",
            timestamp: MOCK_CREATED_TIME
        });

        const options: RequestInit & any = fetchMock.calls()[0][1];
        expect(options.headers.get("Authorization")).to.be.equal(
            `OAuth oauth_consumer_key="mocked-key",oauth_nonce="mocked-nonce",oauth_signature_method="HMAC-SHA256",oauth_timestamp="1550777140",oauth_version="1.0",oauth_signature="PVYijMWSDplONd9abHA8rx3OuHB7NkxfQqE2jw3I%2FE0%3D"`
        );
    });

    it("requestToken", async function() {
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

    it("getTokenAuthModeFile", async function() {
        let token: string | null = null;
        const credentialsFilePath = "./test/test-credentials.properties";
        const credentials = loadCredentialsFromFile(credentialsFilePath);

        const userAuth = new UserAuth({
            credentials,
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

    it("getTokenAuthModeForm", async function() {
        let token: string | null = null;

        const userAuth = new UserAuth({
            credentials: {
                accessKeyId: mock_id,
                accessKeySecret: mock_scrt
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

    it("validateAccessToken", async function() {
        const userAuth = new UserAuth({
            credentials: {
                accessKeyId: mock_id,
                accessKeySecret: mock_scrt
            },
            tokenRequester: requestToken
        });

        fetchMock.post(
            "https://account.api.here.com/verify/accessToken?" +
                SENT_WITH_PARAM,
            {
                ok: true,
                statusText: "valid"
            }
        );

        try {
            const reply = await userAuth.validateAccessToken(mock_token);
            assert.isTrue(reply);
        } catch (err) {
            console.error("Token not validated:", err);
            assert.fail();
        }
    });

    it("validateAccessTokenFalse", async function() {
        const userAuth = new UserAuth({
            credentials: {
                accessKeyId: mock_id,
                accessKeySecret: mock_scrt
            },
            tokenRequester: requestToken
        });

        const responseStatus = 500;
        const responseText = "Internal Server Error";

        fetchMock.post(
            "https://account.api.here.com/verify/accessToken?" +
                SENT_WITH_PARAM,
            responseStatus
        );

        await userAuth.validateAccessToken(mock_token).catch(err => {
            assert.isTrue(err instanceof HttpError);
            assert.equal(err.status, responseStatus);
            assert.equal(err.message, responseText);
        });
    });

    it("getAccessTokenFalse", async function() {
        const userAuth = new UserAuth({
            credentials: {
                accessKeyId: mock_id,
                accessKeySecret: mock_scrt
            },
            tokenRequester: requestToken
        });

        const responseStatus = 401;
        const responseText = "Unauthorized";

        fetchMock.post(
            "https://account.api.here.com/oauth2/token?" + SENT_WITH_PARAM,
            responseStatus
        );

        await userAuth.getToken().catch(err => {
            assert.isTrue(err instanceof HttpError);
            assert.equal(err.status, responseStatus);
            assert.equal(err.message, responseText);
        });
    });
});

describe("oauth-request-lookupapi", function() {
    const mock_token = "eyJhbGciOiJSUzUxMiIsImN0eSI6IkpXVCIsIm";
    const mock_id = "mock-id";
    const mock_scrt = "mock-str";

    beforeEach(function() {
        fetchMock.config.overwriteRoutes = true;
        fetchMock.post(
            "https://account.api.here.com/oauth2/token?" + SENT_WITH_PARAM,
            {
                accessToken: mock_token,
                tokenType: "bearer",
                expiresIn: 3599
            }
        );
    });

    afterEach(function() {
        fetchMock.reset();
    });

    it("getUserInfo-ProdEnv", async function() {
        const userAuth = new UserAuth({
            env: "here",
            credentials: {
                accessKeyId: mock_id,
                accessKeySecret: mock_scrt
            },
            tokenRequester: requestToken
        });

        fetchMock.get(
            "https://account.api.here.com/user/me?" + SENT_WITH_PARAM,
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
            assert.isTrue(reply.marketingEnabled);
            assert.equal(MOCK_CREATED_TIME, reply.createdTime);
            assert.equal(MOCK_UPDATED_TIME, reply.updatedTime);
            assert.equal("state", reply.state);
        } catch (err) {
            console.error("User info not retrieved:", err);
            assert.fail();
        }
    });

    it("getUserInfo-DevEnv", async function() {
        const userAuth = new UserAuth({
            env: "here-dev",
            credentials: {
                accessKeyId: mock_id,
                accessKeySecret: mock_scrt
            },
            tokenRequester: requestToken
        });

        fetchMock.get(
            "https://stg.account.api.here.com/user/me?" + SENT_WITH_PARAM,
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
            assert.isTrue(reply.marketingEnabled);
            assert.equal(MOCK_CREATED_TIME, reply.createdTime);
            assert.equal(MOCK_UPDATED_TIME, reply.updatedTime);
            assert.equal("state", reply.state);
        } catch (err) {
            console.error("User info not retrieved:", err);
            assert.fail();
        }
    });

    it("getUserInfo-CnEnv", async function() {
        const userAuth = new UserAuth({
            env: "here-cn",
            credentials: {
                accessKeyId: mock_id,
                accessKeySecret: mock_scrt
            },
            tokenRequester: requestToken
        });

        fetchMock.get(
            "https://elb.cn-northwest-1.account.hereapi.cn/user/me?" +
                SENT_WITH_PARAM,
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
            assert.isTrue(reply.marketingEnabled);
            assert.equal(MOCK_CREATED_TIME, reply.createdTime);
            assert.equal(MOCK_UPDATED_TIME, reply.updatedTime);
            assert.equal("state", reply.state);
        } catch (err) {
            console.error("User info not retrieved:", err);
            assert.fail();
        }
    });

    it("getUserInfo-CnDevEnv", async function() {
        const userAuth = new UserAuth({
            env: "here-cn-dev",
            credentials: {
                accessKeyId: mock_id,
                accessKeySecret: mock_scrt
            },
            tokenRequester: requestToken
        });

        fetchMock.get(
            "https://elb.cn-northwest-1.account.sit.hereapi.cn/user/me?" +
                SENT_WITH_PARAM,
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
            assert.isTrue(reply.marketingEnabled);
            assert.equal(MOCK_CREATED_TIME, reply.createdTime);
            assert.equal(MOCK_UPDATED_TIME, reply.updatedTime);
            assert.equal("state", reply.state);
        } catch (err) {
            console.error("User info not retrieved:", err);
            assert.fail();
        }
    });

    it("getUserInfo-CustomUrl", async function() {
        const userAuth = new UserAuth({
            customUrl: "http://localhost/",
            credentials: {
                accessKeyId: mock_id,
                accessKeySecret: mock_scrt
            },
            tokenRequester: requestToken
        });

        fetchMock.get("http://localhost/user/me?" + SENT_WITH_PARAM, {
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
            assert.isTrue(reply.marketingEnabled);
            assert.equal(MOCK_CREATED_TIME, reply.createdTime);
            assert.equal(MOCK_UPDATED_TIME, reply.updatedTime);
            assert.equal("state", reply.state);
        } catch (err) {
            console.error("User info not retrieved:", err);
            assert.fail();
        }
    });

    it("getUserInfo-default", async function() {
        const userAuth = new UserAuth({
            credentials: {
                accessKeyId: mock_id,
                accessKeySecret: mock_scrt
            },
            tokenRequester: requestToken
        });

        fetchMock.get(
            "https://account.api.here.com/user/me?" + SENT_WITH_PARAM,
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

describe("auth-request-project-scope", function() {
    let token: string | null = null;
    const mockedScope = "mocked-scope";
    const mock_id = "mock-id";
    const mock_scrt = "mock-str";
    const mockedToken: Token = {
        accessToken: "fake-access-token",
        expiresIn: 42,
        tokenType: "fake"
    };
    const mockedTokenRequester = async (params: any): Promise<Token> => {
        assert.strictEqual(params.scope, mockedScope);
        return Promise.resolve(mockedToken);
    };

    it("Should scope be present on userAuth", async function() {
        const userAuth = new UserAuth({
            env: "here-dev",
            credentials: {
                accessKeyId: mock_id,
                accessKeySecret: mock_scrt
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

    it("Should customUrl be present in getToken request", async function() {
        const mockedUrl = "https://example.com/my/custom/url";
        const mockedTokenRequest = async (params: any): Promise<Token> => {
            assert.strictEqual(params.url, mockedUrl);
            return Promise.resolve(mockedToken);
        };

        const userAuth = new UserAuth({
            env: "here-dev",
            credentials: {
                accessKeyId: mock_id,
                accessKeySecret: mock_scrt
            },
            tokenRequester: mockedTokenRequest,
            customUrl: mockedUrl
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

describe("expired token refreshing", async function() {
    let mockedTokenRequester: TokenRequesterFn;
    beforeEach(function() {
        const defaultTokenExpirationTime = 3600;
        mockedTokenRequester = async (params: OAuthArgs): Promise<Token> => {
            const expirationDate = new Date();
            expirationDate.setSeconds(
                params.expiresIn || defaultTokenExpirationTime
            );

            const mockedResponse: Token = {
                accessToken:
                    new Date() >= expirationDate ? "new-token" : "old-token",
                expiresIn: params.expiresIn || defaultTokenExpirationTime,
                tokenType: "fake"
            };
            return Promise.resolve(mockedResponse);
        };
    });

    it("Should getToken return the same token for two requests in row", async function() {
        const userAuth = new UserAuth({
            env: "here",
            tokenRequester: mockedTokenRequester,
            credentials: {
                accessKeyId: "appId",
                accessKeySecret: "keyScrt"
            }
        });

        const token1 = await userAuth.getToken();
        const token2 = await userAuth.getToken();

        assert.isDefined(token1);
        assert.isDefined(token2);
        expect(token1).to.be.equal(token2);
    });

    it("Should getToken return the different tokens for two requests with delay", async function() {
        const userProvidedTokenExpirationTime = 10;
        const userAuth = new UserAuth({
            env: "here",
            tokenRequester: mockedTokenRequester,
            credentials: {
                accessKeyId: "appId",
                accessKeySecret: "keyScrt"
            },
            expiresIn: userProvidedTokenExpirationTime
        });

        const token1 = await userAuth.getToken();

        setTimeout(async function() {
            const token2 = await userAuth.getToken();

            assert.isDefined(token1);
            assert.isDefined(token2);
            expect(token1).to.be.not.equal(token2);
            // tslint:disable-next-line: no-magic-numbers
        }, 15000);
    });
});
