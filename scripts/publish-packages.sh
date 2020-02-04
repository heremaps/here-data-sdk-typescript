#!/bin/bash -e
#Simple script that bundles the publishing of packages
#to be run from Travis

echo '//registry.npmjs.org/:_authToken=${NPM_TOKEN}' > ~/.npmrc

# olp-sdk-authentication publish
cd @here/olp-sdk-authentication && npm install && npm publish && cd -

# olp-sdk-fetch publish
cd @here/olp-sdk-fetch && npm install && npm publish && cd -

# olp-sdk-dataservice-api publish
cd @here/olp-sdk-dataservice-api && npm install && npm publish && cd -

# olp-sdk-dataservice-read publish
cd @here/olp-sdk-dataservice-read && npm install && npm publish && cd -

echo 'Publish done!'