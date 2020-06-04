#!/bin/bash -ex
#
# Copyright (C) 2019 HERE Europe B.V.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# SPDX-License-Identifier: Apache-2.0
# License-Filename: LICENSE

###################################################
# Following script is for SDK building verification
###################################################

# Install main dependencies
yarn

# Initialize lerna monorepo with yarn workspaces
yarn bootstrap

# Build the project
npm run build

# Generate bundles and typedocs
npm run bundle
npm run typedoc

# Check the lints
npm run lint

# Run tests
npm run test

# Generate and upload codecov
npm run codecov

# Integration tests
npm run integration-test

# Functional tests
npm run functional-test

# Test the generated bundles
npm run http-server-testing-bundles & npm run test-generated-bundles