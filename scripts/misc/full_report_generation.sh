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
sed -i -e 's/Mocha\ Tests/API-Breaks\ Test\ Report/g' ./api-breaks-index.html
sed -i -e 's/Mocha\ Tests/Fetch\ Test\ Report/g' ./fetch-index.html
sed -i -e 's/Mocha\ Tests/Integration\ Test\ Report/g' ./integration-index.html
sed -i -e 's/Mocha\ Tests/Functional\ Test\ Report/g' ./functional-index.html
sed -i -e 's/Mocha\ Tests/Authentication\ Test\ Report/g' ./authentication-index.html
sed -i -e 's/Mocha\ Tests/Core\ Test\ Report/g' ./core-index.html
sed -i -e 's/Mocha\ Tests/Dataservice-api\ Test\ Report/g' ./dataservice-api-index.html
sed -i -e 's/Mocha\ Tests/Dataservice-read\ Test\ Report/g' ./dataservice-read-index.html
sed -i -e 's/Mocha\ Tests/Dataservice-write\ Test\ Report/g' ./dataservice-write-index.html

# Creating new html files
echo "<html> <head> <title>Full Regression Test Report</title> </head><h2>Full Regression Test Report</h2></html>" > ./index.html
# Authentication
echo "<html>" >> ./index.html
echo "<h3>Authentication</h3>" >> ./index.html
echo "/<html>" >> ./index.html
cat ./authentication-index.html >> ./index.html
# Core
echo "<html>" >> ./index.html
echo "<h3>Core</h3>" >> ./index.html
echo "/<html>" >> ./index.html
cat ./core-index.html >> ./index.html
# DS API
echo "<html>" >> ./index.html
echo "<h3>Dataservice-api</h3>" >> ./index.html
echo "/<html>" >> ./index.html
cat ./dataservice-api-index.html >> ./index.html
# DS READ
echo "<html>" >> ./index.html
echo "<h3>Dataservice-read</h3>" >> ./index.html
echo "/<html>" >> ./index.html
cat ./dataservice-read-index.html >> ./index.html
# DS WRITE
echo "<html>" >> ./index.html
echo "<h3>Dataservice-write</h3>" >> ./index.html
echo "/<html>" >> ./index.html
cat ./dataservice-write-index.html >> ./index.html
# Fetch
echo "<html>" >> ./index.html
echo "<h3>Fetch</h3>" >> ./index.html
echo "/<html>" >> ./index.html
cat ./fetch-index.html >> ./index.html
# Functional
echo "<html>" >> ./index.html
echo "<h3>Functional</h3>" >> ./index.html
echo "/<html>" >> ./index.html
cat ./functional-index.html >> ./index.html
# Integration
echo "<html>" >> ./index.html
echo "<h3>Integration</h3>" >> ./index.html
echo "/<html>" >> ./index.html
cat ./integration-index.html >> ./index.html
# API-Breaks
echo "<html>" >> ./index.html
echo "<h3>API-Breaks</h3>" >> ./index.html
echo "/<html>" >> ./index.html
cat ./api-breaks-index.html >> ./index.html

mkdir -p .public
cp index.html .public/

