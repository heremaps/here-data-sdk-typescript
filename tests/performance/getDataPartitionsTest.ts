/*
 * Copyright (C) 2020-2021 HERE Europe B.V.
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

/* tslint:disable */

import {
  VersionedLayerClient,
  PartitionsRequest
} from "@here/olp-sdk-dataservice-read";
import { OlpClientSettings, HRN } from "@here/olp-sdk-core";

import { getSleepPeriod, sleep, TestParams } from "./utils";

export async function getPartitionsMemoryTest(params: TestParams) {
  const settings = new OlpClientSettings({
    environment: "http://localhost:3000/lookup-service/lookup/v1",
    getToken: () => Promise.resolve("mocked-token")
  });

  const { runTimeSeconds, requestsPerSecond } = params;
  const sleepPeriod = getSleepPeriod(requestsPerSecond);

  let countSentRequests = 0;
  let countSuccessRequests = 0;
  let countFailedRequests = 0;

  const endTimestamp = new Date(new Date().getTime() + 1000 * runTimeSeconds);
  const layerClient = new VersionedLayerClient({
    catalogHrn: HRN.fromString("hrn:local:data::olp-here:mocked-catalog"),
    layerId: "mocked-layer",
    settings
  });

  const partitionsRequest = new PartitionsRequest();

  while (endTimestamp > new Date()) {
    countSentRequests++;
    console.info(`>>> Sending request: ${countSentRequests} <<<`);

    layerClient
      .getPartitions(partitionsRequest)
      .then(metadata => {
        console.log("Metadata:\n" + JSON.stringify(metadata));
        countSuccessRequests++;
      })
      .catch(_ => {
        countFailedRequests++;
      });

    await sleep(sleepPeriod);
  }

  console.log("\n\nRequests statistic:");
  console.info(`  Total requests: ${countSentRequests}`);
  console.info(`  Responses succeed: ${countSuccessRequests}`);
  console.info(`  Responses failed: ${countFailedRequests}`);

  const memory = process.memoryUsage();
  console.log("\nMemory usage:");
  console.log(`  Heap total: ${memory.heapTotal * 1e-6} Mb.`);
  console.log(`  Heap used: ${memory.heapUsed * 1e-6}Mb.`);
  console.log(`  Rss: ${memory.rss * 1e-6} Mb.`);
  console.log(`  External: ${memory.external * 1e-6} Mb.\n`);
}
