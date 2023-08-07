"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDevConfig = void 0;
const webpack_1 = __importDefault(require("webpack"));
const md5_1 = __importDefault(require("md5"));
const base_1 = require("./base");
const getDevConfig = (payloadConfig) => {
    const baseConfig = (0, base_1.getBaseConfig)(payloadConfig);
    let webpackConfig = {
        ...baseConfig,
        cache: {
            type: 'filesystem',
            // version cache when there are changes to aliases
            version: (0, md5_1.default)(Object.entries(baseConfig.resolve.alias).join()),
            buildDependencies: {
                config: [__filename],
            },
        },
        entry: {
            ...baseConfig.entry,
            main: [
                `webpack-hot-middleware/client?path=${payloadConfig.routes.admin}/__webpack_hmr`,
                ...baseConfig.entry.main,
            ],
        },
        output: {
            publicPath: `${payloadConfig.routes.admin}/`,
            path: '/',
            filename: '[name].js',
        },
        devtool: 'inline-source-map',
        mode: 'development',
        stats: 'errors-warnings',
        plugins: [
            ...baseConfig.plugins,
            new webpack_1.default.HotModuleReplacementPlugin(),
        ],
    };
    webpackConfig.module.rules.push({
        test: /\.(scss|css)$/,
        sideEffects: true,
        /*
         * The loaders here are run in reverse order. Here is how your loaders are being processed:
         * 1. sass-loader: This loader compiles your SCSS into CSS.
         * 2. postcss-loader: This loader applies postcss transformations (with preset-env plugin in your case).
         * 3. css-loader: This loader interprets @import and url() like import/require() and will resolve them.
         * 4. style-loader: This loader injects CSS into the DOM.
         */
        use: [
            require.resolve('style-loader'),
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
    if (payloadConfig.admin.webpack && typeof payloadConfig.admin.webpack === 'function') {
        webpackConfig = payloadConfig.admin.webpack(webpackConfig);
    }
    return webpackConfig;
};
exports.getDevConfig = getDevConfig;
//# sourceMappingURL=dev.js.map