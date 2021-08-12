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
  UserAuth,
  UserAuthConfig,
  AuthCredentials,
  UserInfo,
  OAuthArgs,
  Token
} from "@here/olp-sdk-authentication";
import * as authentication from "@here/olp-sdk-authentication";
import { Signer } from "@here/olp-sdk-authentication/lib/requestToken_common";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("UserAuth", function() {
  class UserAuthTest extends UserAuth {
    constructor(config: UserAuthConfig) {
      super(config);
    }

    async getToken(): Promise<string> {
      return Promise.resolve("resolve");
    }

    async validateAccessToken(userToken: string): Promise<string | boolean> {
      return Promise.resolve(true);
    }

    async getUserInfo(token: string): Promise<authentication.UserInfo> {
      return Promise.resolve({
        userId: "userId",
        realm: "test",
        firstname: "test",
        lastname: "test",
        email: "test",
        dob: "test",
        language: "test",
        countryCode: "test",
        emailVerified: true,
        marketingEnabled: true,
        createdTime: 1,
        updatedTime: 1,
        state: "test"
      });
    }
  }

  it("Shoud be initialized with config", async function() {
    const credentials = {
      accessKeyId: "test-key",
      accessKeySecret: "test-key-secret"
    };

    const userAuth = new UserAuthTest({
      credentials,
      tokenRequester: authentication.requestToken
    });

    assert.isDefined(userAuth);
    expect(userAuth).to.be.instanceOf(UserAuth);

    assert.isFunction(userAuth.getToken);
    assert.isFunction(userAuth.validateAccessToken);
    assert.isFunction(userAuth.getUserInfo);
  });

  it("Should getToken be called without arguments", async function() {
    const credentials = {
      accessKeyId: "test-key",
      accessKeySecret: "test-key-secret"
    };

    const userAuth = new UserAuthTest({
      credentials,
      tokenRequester: authentication.requestToken
    });

    const response = await userAuth.getToken();

    assert.isDefined(response);
  });

  it("Should validateAccessToken be called with required arguments", async function() {
    const credentials = {
      accessKeyId: "test-key",
      accessKeySecret: "test-key-secret"
    };

    const userAuth = new UserAuthTest({
      credentials,
      tokenRequester: authentication.requestToken
    });

    const response = await userAuth.validateAccessToken("token");

    assert.isDefined(response);
  });

  it("Test getUserInfo method with token", async function() {
    const credentials = {
      accessKeyId: "test-key",
      accessKeySecret: "test-key-secret"
    };

    const userAuth = new UserAuthTest({
      credentials,
      tokenRequester: authentication.requestToken
    });

    const response = await userAuth.getUserInfo("user-token");

    assert.isDefined(response);
  });
});

describe("AuthCredentials", function() {
  it("Test AuthCredentials with params", function() {
    const credentials: AuthCredentials = {
      accessKeyId: "test-accessKeyId",
      accessKeySecret: "test-accessKeySecret"
    };

    assert.isDefined(credentials);
  });

  it("Test AuthCredentials with all required params", function() {
    const credentials: AuthCredentials = {};

    assert.isDefined(credentials);
  });
});

describe("UserAuthConfig", function() {
  it("Test UserAuthConfig with params", function() {
    const config: UserAuthConfig = {
      credentials: {
        accessKeyId: "test-accessKeyId",
        accessKeySecret: "test-accessKeySecret"
      },
      env: "test",
      customUrl: "test",
      tokenRequester: authentication.requestToken,
      scope: "test"
    };

    assert.isDefined(config);
  });

  it("Test UserAuthConfig with all required params", function() {
    const config: UserAuthConfig = {
      tokenRequester: authentication.requestToken
    };

    assert.isDefined(config);
  });
});

describe("UserInfo", function() {
  it("Test UserInfo with all required params", function() {
    const userInfo: UserInfo = {
      userId: "userId",
      realm: "test",
      firstname: "test",
      lastname: "test",
      email: "test",
      dob: "test",
      language: "test",
      countryCode: "test",
      marketingEnabled: true,
      createdTime: 1,
      updatedTime: 1,
      state: "test"
    };

    assert.isDefined(userInfo);
  });
});

describe("Signer", function() {
  it("Test Signer with all required params", function() {
    const signer: Signer = {
      sign: (data: ArrayBufferLike, secretKey: string) =>
        Promise.resolve("test-response"),
      getRandomValues: (data: Uint8Array) => [1111] as any
    };

    assert.isDefined(signer);
  });
});

describe("OAuthArgs", function() {
  it("Test OAuthArgs with params", function() {
    const oAuthArgs: OAuthArgs = {
      url: "test",
      consumerKey: "test",
      secretKey: "test",
      nonce: "test",
      timestamp: 1,
      scope: "test"
    };

    assert.isDefined(oAuthArgs);
  });

  it("Test OAuthArgs with all required params", function() {
    const oAuthArgs: OAuthArgs = {
      url: "test",
      consumerKey: "test",
      secretKey: "test"
    };

    assert.isDefined(oAuthArgs);
  });
});

describe("Token", function() {
  it("Test Token with all required params", function() {
    const token: Token = {
      accessToken: "test",
      tokenType: "test",
      expiresIn: 12
    };

    assert.isDefined(token);
  });
});
