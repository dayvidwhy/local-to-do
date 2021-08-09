const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const htmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = (env, argv) => {
    const prod = argv.mode === "production";
    return {
        entry: {
            "build/bundle": ["./src/main.js"]
        },
        resolve: {
            alias: {
                svelte: path.dirname(require.resolve("svelte/package.json"))
            },
            extensions: [".mjs", ".js", ".svelte"],
            mainFields: ["svelte", "browser", "module", "main"]
        },
        output: {
            filename: "[name].[contenthash:8].js",
            path: path.resolve(__dirname, "dist"),
            chunkFilename: "[name].[contenthash:8].js"
        },
        module: {
            rules: [
                {
                    test: /\.svelte$/,
                    use: {
                        loader: "svelte-loader",
                        options: {
                            compilerOptions: {
                                dev: !prod
                            },
                            emitCss: prod,
                            hotReload: !prod
                        }
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader"
                    ]
                },
                {
                    // required to prevent errors from Svelte on Webpack 5+
                    test: /node_modules\/svelte\/.*\.mjs$/,
                    resolve: {
                        fullySpecified: false
                    }
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: "[name].[contenthash:8].css",
                chunkFilename: "[name].[contenthash:8].css"
            }),
            new htmlWebpackPlugin({
                template: path.resolve(__dirname, "public", "index.html")
            })
        ],
        devtool: prod ? false : "source-map",
        devServer: {
            hot: true
        }
    };
};
