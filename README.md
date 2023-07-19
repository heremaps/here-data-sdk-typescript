# HERE Data SDK for TypeScript

HERE Data SDK for TypeScript is a TypeScript client for the <a href="https://platform.here.com" target="_blank">HERE platform</a>.

## Use the SDK

To learn how to install and use the Data SDK, see the <a href="https://github.com/heremaps/here-data-sdk-typescript/blob/master/docs/GettingStartedGuide.md" target="_blank">Getting Started Guide</a> and <a href="https://developer.here.com/documentation/sdk-typescript/dev_guide/index.html" target="blank">Developer Guide</a>.

## Health check

### Build and test

| Master                      | Node version       | Status                                                                                                                                                                                                                             |
| :-------------------------- | :----------------- |:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Build/Test/Bundling/Typedoc | Node 16.13.2 (LTS) | <a href="https://github.com/heremaps/here-data-sdk-typescript/actions/workflows/ci.yml" target="_blank"><img src="https://github.com/heremaps/here-data-sdk-typescript/actions/workflows/ci.yml/badge.svg" alt="Build Status"></a> |

### Test coverage

| Platform | Status                                                                                                                                                                                                              |
| :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Linux    | <a href="https://codecov.io/gh/heremaps/here-data-sdk-typescript/" target="_blank"><img src="https://codecov.io/gh/heremaps/here-data-sdk-typescript/branch/master/graph/badge.svg" alt="Linux code coverage"/></a> |

## Backward compatibility

We try to develop and maintain our API in a way that preserves its compatibility with the existing applications. Changes in Data SDK for TypeScript are greatly influenced by the Data API development. Data API introduces breaking changes 6 months in advance. Therefore, you may need to migrate to a new version of Data SDK for TypeScript every half a year.

For more information on Data API, see its <a href="https://developer.here.com/documentation/data-api/data_dev_guide/index.html" target="_blank">Developer Guide</a> and <a href="https://developer.here.com/documentation/data-api/api-reference.html" target="_blank">API Reference</a>.

When new API is introduced in Data SDK for TypeScript, the old one is not deleted straight away. The standard API deprecation time is 6 months. It gives you time to switch to new code. However, we do not provide API backward compatibility.

Learn more about deprecated methods, functions, and parameters in the Data SDK for TypeScript <a href="https://developer.here.com/documentation/sdk-typescript/api_reference/index.html"  target="_blank">API Reference</a> and <a href="https://github.com/heremaps/here-data-sdk-typescript/blob/master/CHANGELOG.md" target="_blank">changelog</a>.

For more information on Data SDK for TypeScript, see our <a href="https://github.com/heremaps/here-data-sdk-typescript/blob/master/docs/GettingStartedGuide.md" target="_blank">Getting Started Guide</a> and <a href="https://developer.here.com/documentation/sdk-typescript/dev_guide/index.html" target="blank">Developer Guide</a>.

## About this repository

The Data SDK repository is a monorepo that contains the core components of the platform SDK organized in the NPM workspace.

All components can be used stand-alone and are in the <a href="https://github.com/heremaps/here-data-sdk-typescript/tree/master/%40here" target="_blank">@here</a> subdirectory.

## LICENSE

Copyright (C) 2019-2023 HERE Europe B.V.

For license details, see the <a href="https://github.com/heremaps/here-data-sdk-typescript/blob/master/LICENSE" target="_blank">LICENSE</a> file in the root of this project.
