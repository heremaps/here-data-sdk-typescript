#!/bin/bash -e
#
###### This is a script for packaging and uploading to Veracode Scanner for security test. Mandatory for HERE SPC review.
# Usage for OLP EDGE TS:
# veracodeUpload.sh /workspace/build/olp-edge-ts.zip OLP_EDGE_CIq@here.com
#
# Required variables:
# VERACODE_API_PWD, VERACODE_API_USER.
# note that below hardcoded is nubmer 443849 : TS SDK app ID in Veracode Scanner https://analysiscenter.veracode.com .
#
# other samples:
# veracodeUpload.sh ./iOS.ipa OLP_EDGE_CI@here.com # any mail can be specified
# veracodeUpload.sh ./App.apk OLP_EDGE_CI@here.com
#
###### Usage from official Veracode API documentation https://confluence.in.here.com/display/SPC/Veracode+API :
# veracodeUpload.sh <filname> <email> <application-id> <label>
# Examples:
# veracodeUpload.sh /tmp/veracode.war michal.vossberg@here.com 443849 1.0.0-RC1
#
set +e
LATEST_TAG=$(git describe --abbrev=0 --tags) || LATEST_TAG=$(git describe --abbrev=0 --tags --always)
LATEST_HASH=$(git rev-parse --short=7 HEAD)
set -e
echo "##############################"
echo "LATEST_TAG is ${LATEST_TAG}"
echo "##############################"
echo "LATEST_HASH is ${LATEST_HASH}"
echo "##############################"

echo "Packing file: $1"

mkdir build
zip -r build/olp-edge-ts.zip . -i *.ts -x *test* -x *.git* # packing all files with extension .ts into zip for further scan, skip tests and git files
ls -lh build/olp-edge-ts.zip

echo "Packed file: $1"

echo "Uploading file: $1"

curl -f -v -k -H"X-spc-veracode-username:${VERACODE_API_USER}" -H"X-spc-veracode-password:${VERACODE_API_PWD}" \
-H"X-spc-veracode-email:$2" -F"file=@$1" https://sca.api.in.here.com/veracode-ws/analysis/start/443849/version/olp-edge-sdk-ts-${LATEST_HASH}

echo "File $1 was uploaded to https://analysiscenter.veracode.com via API"
