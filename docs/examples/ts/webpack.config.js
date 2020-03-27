const path = require('path');
const tsFiles = [
    '@here/olp-sdk-authentication/index.web.ts',
    '@here/olp-sdk-dataservice-api/index.ts',
    '@here/olp-sdk-dataservice-read/index.web.ts'
];
tsFiles.push('./example.ts');

module.exports = {
    target: "web",
    mode: "development",
    resolve: {
    extensions: [ ".ts", ".js"],
    modules: [".", "node_modules"],
    },
    entry: tsFiles,
    output: {
        filename: "app.js",
        libraryTarget: "umd",
        globalObject: 'this'
    },
    optimization: {
        minimize: false
    },
    module: {
    rules: [
        {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader",
        exclude: /node_modules/,
        options: {
            onlyCompileBundledFiles: true
        }
        }
    ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 4242,
        open: true
    }
};
