#!/usr/bin/env node

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

import { getUserAuth } from "./getUserAuth";
import { options } from "./options";
import {
  DataRequest,
  TileRequest,
  VersionedLayerClient
} from "@here/olp-sdk-dataservice-read";
import { getOlpClientSettings } from "./getOlpClientSettings";
import { HRN, TileKey } from "@here/olp-sdk-core";
import { writeToFile } from "./writeToFile";

const userAuth = getUserAuth(options.credentials as string);
const settings = getOlpClientSettings(userAuth);

const layerClient = new VersionedLayerClient({
  catalogHrn: HRN.fromString(options.catalog as string),
  layerId: options.layer as string,
  settings,
  version: options.catalogVersion as number | undefined
});

const partitions = options.partitions as string | undefined;
if (partitions) {
  const partitionIds = partitions.split(",");
  const request = new DataRequest();

  for (const id of partitionIds) {
    layerClient
      .getData(request.withPartitionId(id))
      .then(res => res.arrayBuffer())
      .then(data => {
        writeToFile(options.output + "/" + id, Buffer.from(data));
      });
  }
}

const fileWithPartitionIds = options.pf as string | undefined;
if (fileWithPartitionIds) {
  const lineReader = require("readline").createInterface({
    input: require("fs").createReadStream(fileWithPartitionIds)
  });

  const request = new DataRequest();
  lineReader.on("line", (id: string) => {
    layerClient
      .getData(request.withPartitionId(id))
      .then(res => res.arrayBuffer())
      .then(data => {
        writeToFile(options.output + "/" + id, Buffer.from(data));
      });
  });
}

const quadKeyString = options.quadkey as string | undefined;
if (quadKeyString) {
  const parsed = quadKeyString.split(",");
  if (!parsed[0] || !parsed[1] || !parsed[2] || parsed[3]) {
    throw new Error(
      "The quadkey parameted should be in format: row,column,level"
    );
  }
  const tileKey = TileKey.fromRowColumnLevel(
    parseInt(parsed[0]),
    parseInt(parsed[1]),
    parseInt(parsed[2])
  );

  layerClient
    .getAggregatedData(new TileRequest().withTileKey(tileKey))
    .then(res => res.arrayBuffer())
    .then(data => {
      const id = "tile";
      writeToFile(
        options.output + "/" + tileKey.toHereTile(),
        Buffer.from(data)
      );
    });
}
