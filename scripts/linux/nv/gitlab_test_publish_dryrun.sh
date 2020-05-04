#!/bin/bash -ex
#
# Copyright (C) 2019-2020 HERE Europe B.V.
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

# Test the publish process of SDK, by running dry run test
echo ">>> Testing ... >>>"

# olp-sdk-authentication publish test dry-run
cd @here/olp-sdk-authentication && npm install && npm publish --dry-run && cd -

# olp-sdk-dataservice-read publish test dry-run
cd @here/olp-sdk-dataservice-read && npm install && npm publish --dry-run && cd -

# olp-sdk-dataservice-api publish test dry-run
cd @here/olp-sdk-dataservice-api && npm install && npm publish --dry-run && cd -

# olp-sdk-fetch publish test dry-run
cd @here/olp-sdk-fetch && npm install && npm publish --dry-run && cd -

# olp-sdk-dataservice-write publish test dry-run
cd @here/olp-sdk-dataservice-write && npm install && npm publish --dry-run && cd -

echo ">>> Testing SDK done... >>>"
