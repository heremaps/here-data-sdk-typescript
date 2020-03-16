/*
 * Copyright (C) 2019-2020 HERE Europe B.V.
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

import { HttpError } from "..";
import { LIB_VERSION } from "../lib.version";
import { OAuthArgs, Token } from "./requestToken_common";

/**
 * User credentials.
 *
 * Download the file with credentials from the [Open Location Platform (OLP) portal](https://account.here.com/).
 * The downloaded **credentials.properties** file contains the access key ID and access key secret needed to get the access token.
 * You can also use the access key ID and access key secret for authentication.
 */
export interface AuthCredentials {
    /**
     * Your access key ID.
     *
     * Find the access key ID in the **credentials.properties** file downloaded from the OLP Portal.
     */
    accessKeyId?: string;
    /**
     * Your access key secret.
     *
     * Find the access key secret in the **credentials.properties** file downloaded from the OLP Portal.
     */
    accessKeySecret?: string;
}

/**
 * Gets an access token.
 *
 * @param args The arguments needed to get the access token.
 * @return The generated access token.
 */
export type TokenRequesterFn = (args: OAuthArgs) => Promise<Token>;

/**
 * Parameters for authentification.
 */
export interface UserAuthConfig {
    /** Credentials for authorization. */
    credentials?: AuthCredentials;
    /** One of the following environments: here, here-dev, here-cn, and here-cn-dev. */
    env?: string;
    /** The URL of your custom environment. */
    customUrl?: string;
    /**
     * Gets the access token.
     *
     * You can provide your own implementation or use one from `@here/olp-sdk-authentication`.
     *
     * There are two functions that work for the browser and Node.js.
     * For the browser, `UserAuth` uses `requestToken()` from requestToken.web.ts.
     * For Node.js,`UserAuth` uses `requestToken()` from requestToken.ts.
     *
     * When a function imports a function using `import { requestToken }` from "@here/olp-sdk-authentication"`,
     * the code automatically applies to the corresponding function.
     *
     * The following code is applicable only for Node.js.
     *
     * @example
     *
     * ```typescript
     * import { UserAuth, requestToken } from "@here/olp-sdk-authentication";
     *
     *  const userAuth = new UserAuth({
     *       credentials: {
     *           accessKeyId: "your-access-key",
     *           accessKeySecret: "your-access-key-secret"
     *       },
     *       tokenRequester: requestToken
     *   });
     * ```
     */
    tokenRequester: TokenRequesterFn;
    /**
     * Project scope.
     *
     * If the project is specified, the resulting token is bound to it.
     * If the desired resource is restricted to a specific project, to get a valid token, specify this project.
     */
    scope?: string;
}

/**
 * User data and information.
 */
export interface UserInfo {
    /**
     * Your unique identifier.
     * Begins with `AUTHINVITE` if status is invited. Otherwise, use your HERE ID.
     */
    userId: string;
    /** The realm to which you belong. */
    realm: string;
    /** Your first name. */
    firstname: string;
    /** Your last name. */
    lastname: string;
    /** Your email address. */
    email: string;
    /** Your date of birth. */
    dob: string;
    /** Your native language. */
    language: string;
    /** The code of the country in which you live. */
    countryCode: string;
    /** True if your email is verified, false otherwise. */
    emailVerified: boolean;
    marketingEnabled: boolean;
    /** The Unix time (seconds) when the authorization was created. */
    createdTime: number;
    /** The Unix time (seconds) when the authorization was updated. */
    updatedTime: number;
    /** Your user status. */
    state: string;
}

/**
 * Used to get and validate an access token, and to get user data.
 */
export class UserAuth {
    private m_accessToken: string | undefined;
    private m_expirationDate?: Date;
    private m_credentials: AuthCredentials = {};
    private m_scope?: string;
    private readonly m_apiUrl: string;

    /**
     * Creates the [[UserAuth]] instance.
     *
     * @param config Parameters for authentication.
     * @return The [[UserAuth]] instance.
     */
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
            throw new Error(
                `The credentials has not been added, please add credentials!`
            );
        }

        this.m_scope = config.scope;
        this.m_credentials = config.credentials;
    }

    /**
     * Retrieves the access token.
     *
     * @return The access token if it is valid, or an error if at least one of the following credentials is not stated:
     * access key ID or access key secret.
     */
    async getToken(): Promise<string> {
        if (this.tokenIsValid()) {
            return this.m_accessToken!;
        }

        if (
            !this.m_credentials ||
            !this.m_credentials.accessKeyId ||
            !this.m_credentials.accessKeySecret
        ) {
            return Promise.reject(
                "Error getting token. The credentials has not been added!"
            );
        }

        const response = await this.config
            .tokenRequester({
                url: this.m_apiUrl + "oauth2/token",
                consumerKey: this.m_credentials.accessKeyId,
                secretKey: this.m_credentials.accessKeySecret,
                scope: this.m_scope
            })
            .catch(err => Promise.reject(err));

        if (response.accessToken) {
            this.m_accessToken = response.accessToken;
        } else {
            return Promise.reject(response);
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
     *
     * @param token The string containing the token.
     * @return True if the access token is valid, false otherwise.
     */
    async validateAccessToken(token: string): Promise<string | boolean> {
        const body = {
            token
        };

        const headers = new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
            "User-Agent": `OLP-TS-SDK/${LIB_VERSION}`
        });

        const request = await fetch(this.m_apiUrl + "verify/accessToken", {
            method: "POST",
            body: JSON.stringify(body),
            headers
        });

        if (!request.ok) {
            return Promise.reject(
                new HttpError(request.status, request.statusText)
            );
        }

        return Promise.resolve(true);
    }

    /**
     * Retrieves user data.
     *
     * @param userToken The string that contains the user token.
     * @return The `json` object with the user data.
     */
    async getUserInfo(userToken: string): Promise<UserInfo> {
        const headers = new Headers({
            Authorization: "Bearer " + userToken,
            "Content-Type": "application/json",
            "User-Agent": `OLP-TS-SDK/${LIB_VERSION}`
        });

        const request = await fetch(this.m_apiUrl + "user/me", {
            method: "GET",
            headers
        });

        if (!request.ok) {
            return Promise.reject(
                new HttpError(
                    request.status,
                    `Error fetching user info: ${request.statusText}`
                )
            );
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
