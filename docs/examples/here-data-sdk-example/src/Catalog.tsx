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
import { CatalogClient, CatalogRequest } from "@here/olp-sdk-dataservice-read";
import { ConfigApi } from "@here/olp-sdk-dataservice-api";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function Catalog(props: { settings: OlpClientSettings }) {
  const { hrn } = useParams() as { hrn: string };
  const client = new CatalogClient(HRN.fromString(hrn), props.settings);
  const [catalog, setCatalog] = useState<ConfigApi.Catalog>();

  useEffect(() => {
    if (!catalog) {
      client
        .getCatalog(new CatalogRequest())
        .then((response) => {
          setCatalog(response);
        })
        .catch((error) => {
          throw new Error(error);
        });
    }
  });

  if (!catalog) {
    return null;
  }

  return (
    <div>
      <Link to="/">Catalogs</Link>
      {" > "}
      <b>Layers in catalog "{catalog.name}"</b>
      <ul>
        {catalog.layers.map((layer, index) => (
          <li key={index}>
            <Link to={"/catalogs/" + hrn + "/layers/" + layer.id}>
              {`${layer.name} (${layer.layerType})`}
            </Link>
            <p>{layer.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Catalog;
