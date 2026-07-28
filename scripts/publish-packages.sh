#!/bin/bash -e
#
# Copyright (C) 2019-2026 HERE Europe B.V.
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

# Simple script that bundles the publishing of packages,
# to be run from GitHub Actions

echo '//registry.npmjs.org/:_authToken=${NPM_TOKEN}' > ~/.npmrc

npm ci

while [[ $# -gt 0 ]]; do
    key="$1"
    case "$key" in
        -fetch)
        # olp-sdk-fetch publish
        npm publish -w @here/olp-sdk-fetch
        ;;
        -core)
        # olp-sdk-core publish
        npm publish -w @here/olp-sdk-core
        ;;
        -api)
        # olp-sdk-dataservice-api publish
        npm publish -w @here/olp-sdk-dataservice-api
        ;;
        -auth)
        # olp-sdk-authentication publish
        npm publish -w @here/olp-sdk-authentication
        ;;
        -read)
        # olp-sdk-dataservice-read publish
        npm publish -w @here/olp-sdk-dataservice-read
        ;;
        -write)
        # olp-sdk-dataservice-write publish
        npm publish -w @here/olp-sdk-dataservice-write
        ;;
        -verify)
        # verify all published
        echo 'Publish verification...'
        npm ci
        npm run --silent build
        npm run --silent http-server-testing-bundles & npm run --silent test-published-bundles
        echo 'Publish verification done! '
        ;;
    esac
    # Shift after checking all the cases to get the next option
    shift
done
echo 'Publish done!'