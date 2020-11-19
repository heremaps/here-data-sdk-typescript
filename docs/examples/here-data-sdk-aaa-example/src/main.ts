/*
 * Copyright (C) 2020 HERE Global B.V. and its affiliate(s).
 * All rights reserved.
 *
 * This software and other materials contain proprietary information
 * controlled by HERE and are protected by applicable copyright legislation.
 * Any use and utilization of this software and other materials and
 * disclosure to any third parties is conditional upon having a separate
 * agreement with HERE for the access, use, utilization or disclosure of this
 * software. In the absence of such agreement, the use of the software is not
 * allowed.
 */

import { UserAuth, requestToken } from "@here/olp-sdk-authentication";
import { RequestFactory, OlpClientSettings } from "@here/olp-sdk-core";
import {
  AuthorizationAPI,
  RequestBuilder
} from "@here/olp-sdk-dataservice-api";

declare const credentials: {
  appKey: string;
  appSecret: string;
};

declare const window: any;

let userAuth: UserAuth;
let settings: OlpClientSettings;
let requestBuilder: RequestBuilder;

async function setup() {
  userAuth = new UserAuth({
    credentials: {
      accessKeyId: credentials.appKey,
      accessKeySecret: credentials.appSecret
    },
    tokenRequester: requestToken
  });

  settings = new OlpClientSettings({
    environment: "here",
    getToken: () => userAuth.getToken()
  });

  requestBuilder = await RequestFactory.create(
    "authorization",
    "v1.1",
    settings
  );
}

async function getMyGroups() {
  return await AuthorizationAPI.getMyGroups(requestBuilder);
}

window.createGroup = async () => {
  const groupNameInput = document.getElementById(
    "create-group-name"
  ) as HTMLInputElement;
  const groupName = groupNameInput.value;

  if (!groupName) {
    alert("Please provide the name of the new group");
    return;
  }

  const response = await AuthorizationAPI.createGroup(requestBuilder, {
    body: {
      name: groupName
    }
  });

  if (response.id !== undefined) {
    window.location.reload();
  }
};

const myGroupsContainer = document.getElementById("my-groups");
if (myGroupsContainer) {
  setup().then(() => {
    getMyGroups().then(groups => {
      myGroupsContainer.innerHTML += "<h2>My groups:</h2><ul>";
      groups.data.forEach(group => {
        myGroupsContainer.innerHTML += `<li>
          <b>${group.name}</b>
          <div><b>id:</b> ${group.id}</div>
          <div><b>hrn:</b> ${group.hrn})
        </li>`;
      });
      myGroupsContainer.innerHTML += "</ul>";
    });
  });
}
