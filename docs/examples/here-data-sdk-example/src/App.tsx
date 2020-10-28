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

import React from "react";
import { Switch, Route } from "react-router-dom";
import Catalogs from "./Catalogs";
import Catalog from "./Catalog";
import Layer from "./Layer";
import getOlpClientSettings from "./getOlpClientSettings";
import { OlpClientSettings } from "@here/olp-sdk-core";

export const OlpClientSettingsContext = React.createContext({});
class App extends React.Component<
  any,
  {
    settings?: OlpClientSettings;
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    getOlpClientSettings().then((settings) => {
      this.setState({ settings });
    });
  }
  render() {
    if (!this.state.settings) {
      return null;
    }
    return (
      <div>
        <h1>An example React app with Here Data SDK Typescript.</h1>

        <Switch>
          <Route path="/catalogs/:hrn/layers/:layerId">
            <Layer settings={this.state.settings} />
          </Route>
          <Route path="/catalogs/:hrn">
            <Catalog settings={this.state.settings} />
          </Route>
          <Route path="/">
            <Catalogs settings={this.state.settings} />
          </Route>
        </Switch>
      </div>
    );
  }
}

export default App;
