#!/bin/bash -ex
#
# Copyright (C) 2021 HERE Europe B.V.
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

# Simple script that create full regression html report with list of different tests

# Replacing default title with specific test group names
sed -i -e 's/Reports\ Matrix/API-Breaks\ Test\ Report/g' ./api-breaks-index.html
sed -i -e 's/Reports\ Matrix/Fetch\ Test\ Report/g' ./fetch-index.html
sed -i -e 's/Reports\ Matrix/Integration\ Test\ Report/g' ./integration-index.html
sed -i -e 's/Reports\ Matrix/Functional\ Test\ Report/g' ./functional-index.html
sed -i -e 's/Reports\ Matrix/Authentication\ Test\ Report/g' ./authentication-index.html
sed -i -e 's/Reports\ Matrix/Core\ Test\ Report/g' ./core-index.html
sed -i -e 's/Reports\ Matrix/Dataservice-api\ Test\ Report/g' ./dataservice-api-index.html
sed -i -e 's/Reports\ Matrix/Dataservice-read\ Test\ Report/g' ./dataservice-read-index.html
sed -i -e 's/Reports\ Matrix/Dataservice-write\ Test\ Report/g' ./dataservice-write-index.html

# Creating new html files
echo "<html> <head> <title>Full Regression Test Report</title> </head><h2>Full Regression Test Report</h2></html>" > ./index.html
# Authentication
cat ./authentication-index.html >> ./index.html
# Core
cat ./core-index.html >> ./index.html
# DS API
cat ./dataservice-api-index.html >> ./index.html
# DS READ
cat ./dataservice-read-index.html >> ./index.html
# DS WRITE
cat ./dataservice-write-index.html >> ./index.html
# Fetch
cat ./fetch-index.html >> ./index.html
# Functional
cat ./functional-index.html >> ./index.html
# Integration
cat ./integration-index.html >> ./index.html
# API-Breaks
cat ./api-breaks-index.html >> ./index.html

mkdir -p .public
cp index.html .public/

