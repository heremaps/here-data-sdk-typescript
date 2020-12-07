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

import { HRN, OlpClientSettings } from "@here/olp-sdk-core";
import {
  DataRequest,
  PartitionsRequest,
  VersionedLayerClient,
} from "@here/olp-sdk-dataservice-read";
import {
  CompleteBatchRequest,
  PublishSinglePartitionRequest,
  StartBatchRequest,
  VersionedLayerClient as VersionedLayerClientWrite,
} from "@here/olp-sdk-dataservice-write";
import { MetadataApi } from "@here/olp-sdk-dataservice-api";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function Layer(props: { settings: OlpClientSettings }) {
  const { hrn, layerId } = useParams() as { hrn: string; layerId: string };
  const client = new VersionedLayerClient({
    catalogHrn: HRN.fromString(hrn),
    layerId,
    settings: props.settings,
  });

  const versionedLayerClientWrite = new VersionedLayerClientWrite({
    catalogHrn: HRN.fromString(hrn),
    settings: props.settings,
  });

  const [partitions, setPartitions] = useState<MetadataApi.Partition[]>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>();

  const downloadPartitionData = (dataHandle: string, name: string) => {
    client
      .getData(new DataRequest().withDataHandle(dataHandle))
      .then((res) => res.blob())
      .then((blob) => {
        const a = document.createElement("a");
        document.body.appendChild(a);
        const url = URL.createObjectURL(blob);
        a.href = url;
        a.download = name;
        a.click();
        URL.revokeObjectURL(url);
      });
  };

  const uploadHandler = (event: any) => {
    setLoading(true);
    const file = event.target.files[0] as File;
    file.arrayBuffer().then((buffer) => {
      versionedLayerClientWrite
        .startBatch(new StartBatchRequest().withLayers([layerId]))
        .then((publication) => {
          const publicationId = publication.id;
          if (!publicationId) {
            throw Error("Error starting publication process.");
          }

          const request = new PublishSinglePartitionRequest()
            .withPublicationId(publicationId)
            .withLayerId(layerId)
            .withContentType(file.type)
            .withData(buffer)
            .withMetaData({
              partition: file.name,
            });
          versionedLayerClientWrite
            .publishToBatch(request)
            .then((_) => {
              versionedLayerClientWrite
                .completeBatch(
                  new CompleteBatchRequest().withPublicationId(publicationId)
                )
                .then((_) => {
                  window.location.reload();
                })
                .catch((error) => {
                  setError(error.message);
                });
            })
            .catch((error) => {
              setError(error.message);
            });
        })
        .catch((error) => {
          setError(error.message);
        });
    });
  };

  useEffect(() => {
    if (!partitions) {
      client
        .getPartitions(new PartitionsRequest())
        .then((response) => {
          setPartitions(
            response.partitions.sort((a, b) => (a.version > b.version ? -1 : 1))
          );
        })
        .catch((error) => {
          throw new Error(error);
        });
    }
  });

  if (loading) {
    return (
      <div>
        <Link to="/">Catalogs</Link>
        {" > "}
        <Link to={"/catalogs/" + hrn}>Layers</Link>
        <div style={{ marginTop: "20px" }}>
          <b>Loading...</b>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Link to="/">Catalogs</Link>
        {" > "}
        <Link to={"/catalogs/" + hrn}>Layers</Link>
        <div style={{ marginTop: "20px" }}>
          <b>Error: </b>
          {error}
        </div>
      </div>
    );
  }

  if (!partitions) {
    return null;
  }

  return (
    <div>
      <Link to="/">Catalogs</Link>
      {" > "}
      <Link to={"/catalogs/" + hrn}>Layers</Link>
      {" > "}
      <b>Partitions in layer "{layerId}"</b>
      <div style={{ marginTop: "20px" }}>
        Upload data to the layer:{" "}
        <input type="file" name="file" onChange={uploadHandler} />
      </div>
      <ul>
        {partitions.map((partition, index) => (
          <li key={index}>
            <div>
              <p>
                <b>Partition ID: </b>
                {partition.partition}
              </p>
              <p>
                <b>Version:</b>
                {partition.version}
              </p>
              <p>
                <button
                  onClick={() =>
                    downloadPartitionData(
                      partition.dataHandle,
                      partition.partition
                    )
                  }
                >
                  Download
                </button>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Layer;
