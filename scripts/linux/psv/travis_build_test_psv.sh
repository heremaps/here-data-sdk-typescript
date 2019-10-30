#!/bin/bash -xe
yarn
yarn bootstrap
npm run lint
npm run test
npm run coverage
