/*
 * Copyright (C) 2026 HERE Europe B.V.
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
 * Builds the description of a failed authentication request.
 *
 * The response body carries the `correlationId` and the error description
 * reported by the platform. Both are needed to investigate a failure, so the
 * body is appended to the status text. `statusText` is empty over HTTP/2, in
 * which case the body becomes the whole message.
 *
 * @param response The failed response.
 * @return The human-readable description of the failure.
 */
export async function buildErrorMessage(response: Response): Promise<string> {
    // A body that cannot be read must not mask the HTTP error itself.
    const rawBody =
        typeof response.text === "function"
            ? await response.text().catch(() => "")
            : "";
    const body = rawBody.trim();

    if (body.length === 0) {
        return response.statusText;
    }

    return response.statusText.length > 0
        ? `${response.statusText} | Info: ${body}`
        : body;
}
