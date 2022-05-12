const path = require("path");
var glob = require("glob");
//const { CleanWebpackPlugin } = require("clean-webpack-plugin");

// TODO: Automate entries

module.exports = {
    entry: {
        'site': './scripts/site.ts',
        'filebrowser': './scripts/filebrowser.ts',
        'models/path': './scripts/models/path.ts',
        'models/navigation_item': './scripts/models/navigation_item.ts',
        'models/navigation_item_type': './scripts/models/navigation_item_type.ts',
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
