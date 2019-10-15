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

document.addEventListener("DOMContentLoaded", () => {
    const appContainer = document.getElementById("example-app");

    /**
     * Authentification with olp-sdk-authentification
     */
    const userAuth = new UserAuth({
        env: "here",
        credentials: {
            accessKeyId: "your-access-key",
            accessKeySecret: "your-access-secret"
        }
    });

    /**
     * Create DatastoreContext with olp-sdk-dataservice-read
     */
    const context = new DataStoreContext({
        environment: "here",
        getToken: () => userAuth.getToken()
    });

    /**
     * Create client to the volatile layer with olp-sdk-dataservice-read
     */
    const volatileLayerClient = new VolatileLayerClient({
        context,
        hrn: "your-catalog-hrn",
        layerId: "your-layer-id",
    });

    /**
     * Get some partition from the layer by ID
     */
    volatileLayerClient.getPartition('some-partition-id').then(partitionResponse => {
        partitionResponse.blob().then(partitionBlob => {
            const partitionContainer = document.createElement("div");
            partitionContainer.innerHTML = `The size of blob in partition is: ${partitionBlob.size}kb., the type is: ${partitionBlob.type}`;
            appContainer.appendChild(partitionContainer);
        });
    });

    /**
     * Get tile using QuadKey
     */
    volatileLayerClient.getTile({
        row: 90,
        column: 56,
        level: 8
    }).then(tileResponse => {
        tileResponse.blob().then(tileBlob => {
            const tileContainer = document.createElement("div");
            tileContainer.innerHTML = `The size of blob of the tile {
                row: 90,
                column: 56,
                level: 8
            } is: ${tileBlob.size}kb., the type is: ${tileBlob.type}`;
            appContainer.appendChild(tileContainer);
        });
    });
});
