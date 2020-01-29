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

# For core dump backtrace
ulimit -c unlimited

# Build the SDK
echo ">>> Building ... >>>"
npm install -g yarn
yarn
yarn bootstrap
npm run build 
echo ">>> Building SDK done... >>>"

# Start local server
echo ">>> Local Server starting for further performance test ... >>>"
node tests/utils/mocked-olp-server/server.js & SERVER_PID=$!

# Node can start server in 1 second, but not faster.
# Add waiter for server to be started. No other way to solve that.
# Curl returns code 1 - means server still down. Curl returns 0 when server is up
RC=1
while [[ ${RC} -ne 0 ]];
do
        set +e
        curl -s http://localhost:3000
        RC=$?
        sleep 0.15
        set -e
done
echo ">>> Local Server started for further performance test ... >>>"

echo ">>> Start performance tests ... >>>"
npx tsc --target ES5 tests/performance/longMemoryTest.ts && heaptrack node ./tests/performance/longMemoryTest.js 2>> errors.txt || TEST_FAILURE=1
mv heaptrack.node.*.gz short_test.gz
echo ">>> Finished performance tests . >>>"

if [[ ${TEST_FAILURE} == 1 ]]; then
        echo "Printing error.txt ###########################################"
        cat errors.txt
        echo "End of error.txt #############################################"
        echo "CRASH ERROR. One of test groups contains crash. Report was not generated for that group ! "
else
    echo "OK. Full list of tests passed. "
fi

mkdir -p reports/heaptrack
mkdir heaptrack

# Third party dependency needed for pretty graph generation below
git clone --depth=1 https://github.com/brendangregg/FlameGraph

heaptrack_print --print-leaks \
      --print-flamegraph heaptrack/flamegraph_short_test.data \
      --file short_test.gz > reports/heaptrack/report_short_test.txt
    # Pretty graph generation
    ./FlameGraph/flamegraph.pl --title="Flame Graph: short_test" heaptrack/flamegraph_short_test.data > reports/heaptrack/flamegraph_short_test.svg
    cat reports/heaptrack/flamegraph_short_test.svg >> heaptrack_report.html

cp heaptrack_report.html reports
ls -la heaptrack
ls -la

# Gracefully stop local server
kill -15 ${SERVER_PID}
# Waiter for server process to be exited correctly
wait ${SERVER_PID}