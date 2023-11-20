import path from "path";
import os from "os";
import dotenv from "dotenv";
dotenv.config();
import pkg from "./package.json";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CopyPlugin from "copy-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import type { Configuration } from "webpack";
import type { Configuration as DevServerConfiguration } from "webpack-dev-server";
import type { WebpackPluginInstance } from "webpack";

/*------------------------------- variables -----------------------------------*/

// 環境參數
const PRODUCTION_SOURCE_MAP = process.env.PRODUCTION_SOURCE_MAP ?? false;
const ADD_BUNDLE_ANALYZER = process.env.ADD_BUNDLE_ANALYZER === "true" ? true : false;
const OPEN_DEV_WEB_SERVER = process.env.OPEN_DEV_WEB_SERVER === "false" ? false : true;
const isDevelopmentMode = process.env.MODE === "development";
// dev: 如果.env有設定以.env為準 否則自動選一個沒被占用的, prod: 直接3000
const ENV_PORT = process.env.PORT ?? "auto";
const PRODUCTION_PORT = 3000;
// 參數
const threads = os.cpus().length; // cpu 線呈數

// setting variables
const corejsVersion = pkg.dependencies["core-js"].replace(/(^\^)/, "");
if (Number.isNaN(parseFloat(corejsVersion))) console.log("warning: core-js version might be wrong!");
const corejsSettingValue = Number.isNaN(parseFloat(corejsVersion)) ? "3" : parseFloat(corejsVersion) + "";

const PATH_IS_ABSOLUTE = (() => {
    const ENV_PATH_IS_ABSOLUTE = process.env.PATH_IS_ABSOLUTE;
    if (ENV_PATH_IS_ABSOLUTE === "false") {
        return false;
    } else if (ENV_PATH_IS_ABSOLUTE === "true") {
        return true;
    } else if (isDevelopmentMode) {
        return false;
    } else {
        return true;
    }
})();
const ENTER_PATH = PATH_IS_ABSOLUTE ? "" : "./";
const PUBLIC_PATH = PATH_IS_ABSOLUTE ? "/" : "";

/*------------------------------- plugins -----------------------------------*/
const plugins: WebpackPluginInstance[] = [
    new HtmlWebpackPlugin({
        title: "React Webpack",
        favicon: path.resolve(__dirname, "./public/webpack.svg"),
        template: path.resolve(__dirname, "./index.html"),
        filename: "index.html",
        inject: true,
        minify: true,
    }),
    new MiniCssExtractPlugin({
        filename: isDevelopmentMode
            ? ENTER_PATH + "css/index.css"
            : ENTER_PATH + "css/index.[contenthash:6].bundle.css",
    }),
    new CopyPlugin({
        patterns: [
            {
                from: path.resolve(__dirname, "./public"),
                to: path.resolve(__dirname, "./build"),
            },
        ],
    }),
    new webpack.ProvidePlugin({
        React: "react",
    }),
];

if (isDevelopmentMode) {
    plugins.push(new ReactRefreshWebpackPlugin());
} else if (ADD_BUNDLE_ANALYZER) {
    plugins.push(new BundleAnalyzerPlugin());
}

/*------------------------------- devServer -----------------------------------*/
const devServer: DevServerConfiguration = {
    host: "0.0.0.0",
    open: true,
    historyApiFallback: true,
    hot: isDevelopmentMode ? true : false,
    // onListening: function (devServer) {
    //     const port = (devServer?.server?.address() as any)?.port;
    //     // 設置代理
    //     devServer.options.proxy = {
    //         "/api": {
    //             target: `http://localhost:${port}`,
    //             changeOrigin: true,
    //         },
    //     };
    // },
};

// dev: 若ENV_PORT為auto則不設置port, 若ENV_PORT有值 則以該值為準, prod: 永遠以PRODUCTION_PORT為準
if (isDevelopmentMode) {
    if (ENV_PORT !== "auto") {
        devServer.port = ENV_PORT;
    }
    if (OPEN_DEV_WEB_SERVER) {
        devServer.open = true;
    } else {
        devServer.open = false;
    }
} else {
    devServer.port = PRODUCTION_PORT;
}

/*------------------------------- webpack config -----------------------------------*/
const config: Configuration & { devServer?: DevServerConfiguration } = {
    mode: isDevelopmentMode ? "development" : "production",
    entry: "./src/index.tsx",
    output: {
        path: path.resolve(__dirname, "./build"),
        filename: isDevelopmentMode
            ? ENTER_PATH + "js/main.bundle.js"
            : ENTER_PATH + "js/main.[contenthash:6].bundle.js",
        assetModuleFilename: "images/[name][ext]",
        clean: true,
        publicPath: PUBLIC_PATH,
    },
    module: {
        rules: [
            {
                // oneOf 會讓檔案只經過其中一個 loader 若要每個 loader都經過 可以移除 oneOf
                oneOf: [
                    {
                        test: /\.(ts|js)x?$/,
                        exclude: /node_modules/,
                        use: [
                            {
                                loader: "thread-loader",
                                options: {
                                    works: threads, // 線呈數
                                },
                            },
                            {
                                loader: "babel-loader",
                                options: {
                                    presets: [
                                        [
                                            "@babel/preset-env",
                                            {
                                                modules: false,
                                                debug: isDevelopmentMode ? false : true,
                                                useBuiltIns: "entry",
                                                // 注意 corejs 要與 package.json 的 core-js 版本相同
                                                corejs: corejsSettingValue,
                                            },
                                        ],
                                        "@babel/preset-react",
                                        "@babel/preset-typescript",
                                    ],
                                    plugins: isDevelopmentMode ? ["react-refresh/babel"] : [],
                                    cacheDirectory: isDevelopmentMode ? true : false, // 開啟 babel 編譯暫存
                                    cacheCompression: false, // 關閉暫存檔案壓縮 暫存不影響打包 所以關閉壓縮可以加快打包或開 dev server的速度
                                },
                            },
                        ],
                    },
                    {
                        test: /\.module\.s?[ac]ss$/i,
                        use: [
                            isDevelopmentMode ? "style-loader" : MiniCssExtractPlugin.loader,
                            {
                                loader: "css-loader",
                                options: {
                                    modules: {
                                        localIdentName: "[name]_[local]_[contenthash:5]",
                                    },
                                    importLoaders: 2,
                                },
                            },
                            {
                                loader: "postcss-loader",
                                options: {
                                    postcssOptions: {
                                        plugins: [
                                            [
                                                "postcss-preset-env",
                                                {
                                                    options: {
                                                        postcssOptions: {
                                                            parser: "postcss-js",
                                                        },
                                                        execute: true,
                                                    },
                                                },
                                            ],
                                        ],
                                    },
                                },
                            },
                            "sass-loader",
                        ],
                    },
                    {
                        test: /\.s?[ac]ss$/i,
                        exclude: /module\.s?[ac]ss$/i,
                        use: [
                            isDevelopmentMode ? "style-loader" : MiniCssExtractPlugin.loader,
                            {
                                loader: "css-loader",
                                options: {
                                    importLoaders: 2,
                                },
                            },
                            {
                                loader: "postcss-loader",
                                options: {
                                    postcssOptions: {
                                        plugins: [["postcss-preset-env"]],
                                    },
                                },
                            },
                            "sass-loader",
                        ],
                    },
                    {
                        test: /\.(png|jpe?g|gif|svg)$/i,
                        type: "asset/resource",
                        generator: {
                            filename: "images/[name].[contenthash:6][ext]",
                        },
                    },
                    {
                        test: /\.json/,
                        type: "asset/resource",
                        generator: {
                            filename: "data/json/[name].[contenthash:6][ext]",
                        },
                    },
                    {
                        test: /\.(eot|ttf|woff|woff2)$/i,
                        type: "asset/resource",
                        generator: {
                            filename: "data/font/[name].[contenthash:6][ext]",
                        },
                    },
                    {
                        test: /\.(mp4|webm|ogg|mp3|wav|flac|avi|aac)(\?.*)?$/,
                        type: "asset/resource",
                        generator: {
                            filename: "data/media/[name].[contenthash:6][ext]",
                        },
                    },
                ],
            },
        ],
    },
    plugins,
    optimization: {
        minimize: true,
        minimizer: [new CssMinimizerPlugin()].concat(
            (isDevelopmentMode
                ? []
                : [
                      new TerserPlugin({
                          test: /\.(js|jsx)$/,
                          exclude: /node_modules/,
                          parallel: threads,
                      }),
                  ]) as any[]
        ),
    },
    devtool: isDevelopmentMode ? "cheap-module-source-map" : PRODUCTION_SOURCE_MAP ? "source-map" : false,
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
        extensions: ["", ".ts", ".tsx", ".js", ".jsx"],
    },
    cache: isDevelopmentMode
        ? {
              type: "filesystem",
              allowCollectingMemory: true,
              buildDependencies: {
                  config: [__filename],
              },
          }
        : false,
    devServer,
};

export default config;
