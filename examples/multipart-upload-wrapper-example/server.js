/*
 * Copyright (C) 2021 HERE Europe B.V.
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

"use strict";

const http = require("http");
const fs = require("fs");

const HOST = "127.0.0.1";
const PORT = 8080;
const RESPONSE_DELAY_MS = 300;

const routing = {
  "/": `<!DOCTYPE html>
  <html lang="en">
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="title" content="MultiPartUpload example webapp">
  <meta name=”description” content="MultiPartUpload example webapp">
  <body>
      <button id="abort">Abort</button>
      <div id="app"></div>
      <script src="https://unpkg.com/@here/olp-sdk-core/bundle.umd.min.js"></script> 
      <script src="https://unpkg.com/@here/olp-sdk-authentication/bundle.umd.min.js"></script> 
      <script src="https://unpkg.com/@here/olp-sdk-dataservice-api/bundle.umd.min.js"></script> 
      <script src="https://unpkg.com/@here/olp-sdk-dataservice-write/bundle.umd.min.js"></script> 
      <script src="ui.js"></script>
  </body>
  </html>`,
  "/ui.js": fs.readFileSync("./ui.js").toString(),
  "/oauth2/token": () => ({
    accessToken: "mocked-access-token",
    tokenType: "bearer",
    expiresIn: 99999999,
  }),
  "/api/lookup/resources/hrn:here:data::mocked:catalog/apis": () => [
    {
      api: "blob",
      version: "v1",
      baseURL: `http://${HOST}:${PORT}/blobstore/v1`,
      parameters: {},
    },
    {
      api: "publish",
      version: "v2",
      baseURL: `http://${HOST}:${PORT}/publish/v2`,
      parameters: {},
    },
  ],
  "/publish/v2/publications": () => ({
    catalogId: "catalog",
    catalogVersion: 999,
    details: {
      expires: 9999999999999,
      message: "",
      modified: 9999999999999,
      started: 9999999999999,
      state: "initialized",
    },
    id: "mocked-publication-id",
    layerIds: ["mocked-layer"],
    versionDependencies: [],
  }),
  "/blobstore/v1/layers/mocked-layer/data/mocked-datahandle/multiparts": () => ({
    links: {
      status: {
        href: `http://${HOST}:${PORT}/blobstore/v1/catalogs/hrn:here:data::mocked:catalog/layers/mocked-layer/data/mocked-datahandle/multiparts/mocked-blob-token`,
        method: "GET",
      },
      delete: {
        href: `http://${HOST}:${PORT}/blobstore/v1/catalogs/hrn:here:data::mocked:catalog/layers/mocked-layer/data/mocked-datahandle/multiparts/mocked-blob-token`,
        method: "DELETE",
      },
      uploadPart: {
        href: `http://${HOST}:${PORT}/blobstore/v1/catalogs/hrn:here:data::mocked:catalog/layers/mocked-layer/data/mocked-datahandle/multiparts/mocked-blob-token/parts`,
        method: "POST",
      },
      complete: {
        href: `http://${HOST}:${PORT}/blobstore/v1/catalogs/hrn:here:data::mocked:catalog/layers/mocked-layer/data/mocked-datahandle/multiparts/mocked-blob-token`,
        method: "PUT",
      },
    },
  }),
  "/blobstore/v1/catalogs/hrn:here:data::mocked:catalog/layers/mocked-layer/data/mocked-datahandle/multiparts/mocked-blob-token/parts": (
    req,
    res
  ) => {
    res.setHeader("ETag", Math.random() * 10000);
    res.setHeader("Access-Control-Expose-Headers", "ETag");
    return {
      status: res.statusCode,
    };
  },
  "/blobstore/v1/catalogs/hrn:here:data::mocked:catalog/layers/mocked-layer/data/mocked-datahandle/multiparts/mocked-blob-token": () => ({
    ok: true,
  }),
  "/publish/v2/layers/mocked-layer/publications/mocked-publication-id/partitions": () => ({
    ok: true,
  }),
  "/publish/v2/publications/mocked-publication-id": () => ({
    ok: true,
  }),
};

const types = {
  object: JSON.stringify,
  string: (s) => s,
  number: (val) => `${val}`,
  undefined: () => "Not Found",
  function: (fn, req, res) => JSON.stringify(fn(req, res)),
};

const server = http.createServer((req, res) => {
  console.dir({ type: "Reguest", method: req.method, url: req.url });
  const queryIndex = req.url.indexOf("?");
  const adaptedUrl =
    queryIndex !== -1 ? req.url.substr(0, queryIndex) : req.url;

  const data = routing[adaptedUrl];
  const type = typeof data;
  const serialiser = types[type];
  const result = serialiser(data, req, res);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "authorization,content-type, ETag"
  );
  res.setHeader("Access-Control-Allow-Methods", "*");

  res.statusCode = type === "undefined" ? 404 : 200;
  setTimeout(() => {
    res.end(result);
  }, RESPONSE_DELAY_MS);
});

server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
