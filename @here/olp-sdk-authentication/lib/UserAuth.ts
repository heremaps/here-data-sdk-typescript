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

import { OAuthArgs, Token } from "./requestToken_common";

/**
 * User credentials. User can download the file with credentials from [OLP portal](https://account.here.com/).
 * This downloaded credentials file have the info about access key id and access key secret to get token.
 * User is able to use this credentials from the file for authentication.
 */
export interface AuthCredentials {
    /**
     * Access key id of the user. User can find it in user`s credentials file downloaded from OLP Portal
     */
    accessKeyId?: string;

    /**
     * Access key secret of the user. User can find it in user`s credentials file downloaded from OLP Portal
     */
    accessKeySecret?: string;
}

/**
 * Type of the function to obtain access token.
 */
export type TokenRequesterFn = (args: OAuthArgs) => Promise<Token>;

export interface UserAuthConfig {
    /** Credentials for authorization */
    credentials?: AuthCredentials;
    /** Environment */
    env?: string;
    /** Url for a custom Environment */
    customUrl?: string;
    /**
     * A function to obtain the access token.
     *
     * Client can provide own implementation or can use from @here/olp-sdk-authentication.
     *
     * There are two functions that work for browser and NodeJS.
     * UserAuth can use requestToken() from requestToken.web.ts for browser
     * or requestToken() from requestToken.ts for NodeJS.
     *
     * When a function imports a function using import { requestToken } from "@here/olp-sdk-authentication",
     * the code automatically applies the corresponding function that is applicable to access browser or NodeJS.
     *
     * The following code is applicable both for browser and NodeJS.
     *
     * @example
     * import { UserAuth, requestToken } from "@here/olp-sdk-authentication";
     *
     *  const userAuth = new UserAuth({
     *       credentials: {
     *           accessKeyId: "your-access-key",
     *           accessKeySecret: "your-access-key-secret"
     *       },
     *       tokenRequester: requestToken
     *   });
     *
     */
    tokenRequester: TokenRequesterFn;
    /**
     * Project scope.
     * If the project is specified, the resulting token is bound to it.
     * If the desired resource is restricted to a specific project, to get a valid token, specify this project.
     */
    scope?: string;
}

/**
 * Data and info of the user.
 */
export interface UserInfo {
    /** The unique identifier of the user. Begins with AUTHINVITE if status is invited otherwise a HERE id. */
    userId: string;
    /** A realm to which user belongs to. */
    realm: string;
    /** The first name of the user. */
    firstname: string;
    /** The lastname of the user. */
    lastname: string;
    /** Email address of the user. */
    email: string;
    /** The date of birth of the user. */
    dob: string;
    /** The language of this user. */
    language: string;
    /** The country code of this user. */
    countryCode: string;
    /** Set `true` if the user`s email was verified, otherwhise set `false` */
    emailVerified: boolean;
    marketingEnabled: boolean;
    /** Unix time (seconds) when the authorization was created. */
    createdTime: number;
    /** Unix time (seconds) when the authorization was updated. */
    updatedTime: number;
    /** The status of this user. */
    state: string;
}

/**
 * `UserAuth` class instance is used to work with accounts API: obtain an access token, user info,
 * etc.
 */
export class UserAuth {
    private m_accessToken: string | undefined;
    private m_expirationDate?: Date;
    private m_credentials: AuthCredentials = {};
    private m_scope?: string;
    private readonly m_apiUrl: string;

    constructor(private readonly config: UserAuthConfig) {

        if (this.config.customUrl !== undefined) {
            this.m_apiUrl = this.config.customUrl;
        } else {
            switch (this.config.env) {
                case "here":
                    this.m_apiUrl = "https://account.api.here.com/";
                    break;
                case "here-dev":
                    this.m_apiUrl = "https://stg.account.api.here.com/";
                    break;
                case "here-cn":
                    this.m_apiUrl =
                        "https://elb.cn-northwest-1.account.hereapi.cn/";
                    break;
                case "here-cn-dev":
                    this.m_apiUrl =
                        "https://elb.cn-northwest-1.account.sit.hereapi.cn/";
                    break;
                default:
                    this.m_apiUrl = "https://account.api.here.com/";
                    break;
            }
        }

        if (!config.credentials) {
            throw new Error(`The credentials has not been added, please add credentials!`);
        }

        this.m_scope = config.scope;
        this.m_credentials = config.credentials;

    }

    /**
     * Returns access token.
     */
    async getToken(): Promise<string> {
        if (this.tokenIsValid()) {
            return this.m_accessToken!;
        }

        if (!this.m_credentials || !this.m_credentials.accessKeyId || !this.m_credentials.accessKeySecret) {
            return Promise.reject("Error getting token. The credentials has not been added!");
        }

        const response = await this.config.tokenRequester({
            url: this.m_apiUrl + "oauth2/token",
            consumerKey: this.m_credentials.accessKeyId,
            secretKey: this.m_credentials.accessKeySecret,
            scope: this.m_scope
        }).catch(err => Promise.reject(`Error fetching token: ${err}`));

        if (response.accessToken) {
            this.m_accessToken = response.accessToken;
        } else {
            return Promise.reject("No access token received.");
        }

        this.m_expirationDate = new Date();
        if (response.expiresIn !== undefined) {
            this.m_expirationDate.setSeconds(
                this.m_expirationDate.getSeconds() + response.expiresIn
            );
        }
        return this.m_accessToken;
    }

    /**
     * Validates the access token.
     * @param token String containing the token.
     * @returns True if access token is valid.
     */
    async validateAccessToken(token: string): Promise<string | boolean> {
        const body = {
            token
        };

        const headers = new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/json"
        });

        const request = await fetch(this.m_apiUrl + "verify/accessToken", {
            method: "POST",
            body: JSON.stringify(body),
            headers
        });

        if (!request.ok) {
            return request.statusText;
        }

        return true;
    }

    /**
     * Retrieve user's info.
     * @param userToken String containing the user's token.
     */
    async getUserInfo(userToken: string): Promise<UserInfo> {
        const headers = new Headers({
            Authorization: "Bearer " + userToken,
            "Content-Type": "application/json"
        });

        const request = await fetch(this.m_apiUrl + "user/me", {
            method: "GET",
            headers
        });

        if (!request.ok) {
            throw new Error(`Error fetching user info: ${request.statusText}`);
        }

        return request.json();
    }

    private tokenIsValid(): boolean {
        if (
            this.m_accessToken === undefined ||
            this.m_expirationDate === undefined
        ) {
            return false;
        }

        if (new Date() >= this.m_expirationDate) {
            return false;
        }

        return true;
    }
}
