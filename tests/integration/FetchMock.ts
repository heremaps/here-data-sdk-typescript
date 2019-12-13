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
 * The class for integration testing with the implementation
 * of fetch function and possibility to set mocked responses for specific URLs
 */
export class FetchMock {
  private mockedResponsesByUrl?: Map<string, Response>;

  /**
   * Setter for the mocked responses.
   * @param responses The map of responses for URLs.
   * @returns The updated `FetchMock` instance.
   */
  public withMockedResponses(responses: Map<string, Response>): FetchMock {
    this.mockedResponsesByUrl = responses;
    return this;
  }

/**
 * A `fetch` implementation for e2e testing.
 *
 * *Use only for testing purposes*.
 *
 * Example:
 * ```
 *     const fetchStub = sandbox.stub(global as any, "fetch");
 *     fetchStub.callsFake(new FetchMock().fetch());
 *     await someApi.loadSomethingWithFetch("https://example.com");
 *     assert.equal(fetchStub, 1);
 * ```
 *
 * @see [fetch documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
 */
  public fetch() {
    return async (input: RequestInfo, init?: RequestInit) => {
      const url = typeof input === "object" ? input.url : input;
      console.log("Requested url: " + url);

      const response: Response | undefined = this.mockedResponsesByUrl && this.mockedResponsesByUrl.get(url);
      return response ? Promise.resolve(response) : Promise.reject(`Unhandled url: ${url}`);
    }
  }
}
