"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProdConfig = void 0;
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
const webpack_bundle_analyzer_1 = require("webpack-bundle-analyzer");
const swc_minify_webpack_plugin_1 = require("swc-minify-webpack-plugin");
const base_1 = require("./base");
const getProdConfig = (payloadConfig) => {
    const baseConfig = (0, base_1.getBaseConfig)(payloadConfig);
    let webpackConfig = {
        ...baseConfig,
        output: {
            publicPath: `${payloadConfig.routes.admin}/`,
            path: payloadConfig.admin.buildPath,
            filename: '[name].[chunkhash].js',
            chunkFilename: '[name].[chunkhash].js',
        },
        mode: 'production',
        stats: 'errors-only',
        optimization: {
            minimizer: [new swc_minify_webpack_plugin_1.SwcMinifyWebpackPlugin()],
            splitChunks: {
                cacheGroups: {
                    styles: {
                        name: 'styles',
                        test: /\.(sa|sc|c)ss$/,
                        chunks: 'all',
                        enforce: true,
                    },
                },
            },
        },
        plugins: [
            ...baseConfig.plugins,
            new mini_css_extract_plugin_1.default({
                filename: '[name].css',
                ignoreOrder: true,
            }),
        ],
    };
    webpackConfig.module.rules.push({
        test: /\.(scss|css)$/,
        sideEffects: true,
        use: [
            mini_css_extract_plugin_1.default.loader,
            {
                loader: require.resolve('css-loader'),
                options: {
                    url: (url) => (!url.startsWith('/')),
                },
            },
            {
                loader: require.resolve('postcss-loader'),
                options: {
                    postcssOptions: {
                        plugins: [require.resolve('postcss-preset-env')],
                    },
                },
            },
            require.resolve('sass-loader'),
        ],
    });
    if (process.env.PAYLOAD_ANALYZE_BUNDLE) {
        webpackConfig.plugins.push(new webpack_bundle_analyzer_1.BundleAnalyzerPlugin());
    }
    if (payloadConfig.admin.webpack && typeof payloadConfig.admin.webpack === 'function') {
        webpackConfig = payloadConfig.admin.webpack(webpackConfig);
    }
    return webpackConfig;
};
exports.getProdConfig = getProdConfig;
//# sourceMappingURL=prod.js.map