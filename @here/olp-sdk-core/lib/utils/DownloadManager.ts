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

/**
 * It's an interface for `@here/olp-sdk-dataservice-api` that is used to send requests to platform services.
 * [[DataStoreRequestBuilder]] has its own default implementation of the download manager.
 * If you want to use your download manager, you can implement this interface, and then set your download manager.
 *
 * @see [[DataStoreRequestBuilder]]
 */
export interface DownloadManager {
    /**
     * Downloads data from the specified URL.
     *
     * @param url The URL that you want to download.
     * @param init The helper object for the request.
     * @return The data from the specified URL.
     */
    download(url: string, init?: RequestInit): Promise<Response>;
}
