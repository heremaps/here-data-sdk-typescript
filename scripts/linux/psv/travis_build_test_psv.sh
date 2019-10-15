#!/bin/bash -xe
yarn
yarn bootstrap
npm run build
npm run prepublish-bundle
npm run test
