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

/**
 * A `fetch` implementation for e2e testing.
 *
 * *Use only for testing purposes*.
 *
 * Example:
 * ```
 *     const fetchStub = sandbox.stub(global as any, "fetch");
 *     fetchStub.callsFake(mockedFetch);
 *     await someApi.loadSomethingWithFetch("https://example.com");
 *     assert.equal(fetchStub, 1);
 * ```
 *
 * @see [fetch documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
 */
export async function fetchMock
(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  const url = typeof input === "object" ? input.url : input;
  console.log("Requested url: " + url);
  let result: string;
  switch (url) {
    case "https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::test-hrn/apis/query/v1":

    result = JSON.stringify([
        {
          api: "query",
          version: "v1",
          baseURL: "https://query.data.api.platform.here.com/query/v1",
          parameters: {
            additionalProp1: "string",
            additionalProp2: "string",
            additionalProp3: "string"
          }
        }
      ]);

      break;

    case "https://query.data.api.platform.here.com/query/v1/layers/test-layed-id/partitions?partition=100&partition=1000":

            result = JSON.stringify({
                "partitions": [
                  {
                    "checksum": "291f66029c232400e3403cd6e9cfd36e",
                    "compressedDataSize": 1024,
                    "dataHandle": "1b2ca68f-d4a0-4379-8120-cd025640510c",
                    "dataSize": 1024,
                    "crc": "c3f276d7",
                    "partition": "100",
                    "version": 2
                  },
                  {
                    "checksum": "123f66029c232400e3403cd6e9cfd45b",
                    "compressedDataSize": 2084,
                    "dataHandle": "1b2ca68f-d4a0-4379-8120-cd025640578e",
                    "dataSize": 2084,
                    "crc": "c3f2766y",
                    "partition": "1000",
                    "version": 2
                  }
                ]
              });

        break;

    case "https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::test-hrn/apis/metadata/v1":

              result = JSON.stringify([{
                api: "metadata",
                version: "v1",
                baseURL: "https://metadata.data.api.platform.here.com/metadata/v1",
                parameters: {
                  additionalProp1: "string",
                  additionalProp2: "string",
                  additionalProp3: "string"
                }
              }]);
    break;

    case "https://metadata.data.api.platform.here.com/metadata/v1/versions/latest?startVersion=-1":
            result = JSON.stringify({"version": 128});
    break;

    case "https://metadata.data.api.platform.here.com/metadata/v1/layers/test-layed-id/partitions?version=128":
            result = JSON.stringify({
                "partitions": [
                  {
                    "checksum": "291f66029c232400e3403cd6e9cfd36e",
                    "compressedDataSize": 1024,
                    "dataHandle": "1b2ca68f-d4a0-4379-8120-cd025640510c",
                    "dataSize": 1024,
                    "crc": "c3f276d7",
                    "partition": "314010583",
                    "version": 1
                  },
                  {
                    "checksum": "123f66029c232400e3403cd6e9cfd45b",
                    "compressedDataSize": 2084,
                    "dataHandle": "1b2ca68f-d4a0-4379-8120-cd025640578e",
                    "dataSize": 2084,
                    "crc": "c3f2766y",
                    "partition": "1000",
                    "version": 2
                  },
                  {
                    "checksum": "123f66029c232400e3403cd6e9cfd345",
                    "compressedDataSize": 2084,
                    "dataHandle": "1b2ca68f-d4a0-4379-8120-cd0256405444",
                    "dataSize": 2084,
                    "crc": "c3f2766y",
                    "partition": "1000",
                    "version": 2
                  },{
                    "checksum": "123f66029c232400e3403cd6e9cfd234",
                    "compressedDataSize": 2084,
                    "dataHandle": "1b2ca68f-d4a0-4379-8120-cd0256405555",
                    "dataSize": 2084,
                    "crc": "c3f2766y",
                    "partition": "1000",
                    "version": 2
                  }
                ],
                "next": "/uri/to/next/page"
              });

        break;

    default:
      throw new Error(`Unhandled URL: ${url}`);
  }

  const response = new Response(result);

  return new Promise((resolve, reject) => {
    resolve(response);
  });
}
