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

import { OlpClientSettings } from "@here/olp-sdk-core";
import React from "react";
import { Link } from "react-router-dom";
import "./Catalogs.css";
import listOfCatalogs from "./listOfCatalogs";

class Catalogs extends React.Component<
  { settings: OlpClientSettings },
  {
    catalogs: { title: string; hrn: string }[];
  }
> {
  constructor(props: { settings: OlpClientSettings }) {
    super(props);
    this.state = {
      catalogs: [],
    };
  }

  componentDidMount() {
    listOfCatalogs(this.props.settings).then((catalogs) => {
      this.setState({ catalogs });
    });
  }

  render() {
    return (
      <div className="catalogs-list">
        <b>Catalogs</b>
        <ul>
          {this.state.catalogs.map((el, index) => (
            <li key={index}>
              <Link to={"/catalogs/" + el.hrn}>{el.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Catalogs;
