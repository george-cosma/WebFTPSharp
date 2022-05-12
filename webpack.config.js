﻿const path = require("path");
var glob = require("glob");
//const { CleanWebpackPlugin } = require("clean-webpack-plugin");

// TODO: Automate entries

module.exports = {
    entry: {
        'site': './scripts/site.ts',
        'filebrowser': './scripts/filebrowser.ts',
        'models/path': './scripts/models/path.ts',
        'components': glob.sync("./scripts/components/**/*.ts")
    },
    output: {
        path: path.resolve(__dirname, "wwwroot/js/"),
        filename: "[name].js",
        publicPath: "/",
    },
    resolve: {
        extensions: [".js", ".ts"],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
            }
        ],
    },
    devtool: 'source-map',
    plugins: [
        //new CleanWebpackPlugin(),
    ]
};
