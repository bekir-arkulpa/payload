"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBaseConfig = void 0;
const path_1 = __importDefault(require("path"));
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
const webpack_1 = __importDefault(require("webpack"));
const mockModulePath = path_1.default.resolve(__dirname, '../../mocks/emptyModule.js');
const mockDotENVPath = path_1.default.resolve(__dirname, '../../mocks/dotENV.js');
const nodeModulesPath = path_1.default.resolve(__dirname, '../../../../node_modules');
const adminFolderPath = path_1.default.resolve(__dirname, '../../../admin');
const bundlerPath = path_1.default.resolve(__dirname, '../bundler');
const getBaseConfig = (payloadConfig) => ({
    entry: {
        main: [
            adminFolderPath,
        ],
    },
    resolveLoader: {
        modules: ['node_modules', path_1.default.join(__dirname, nodeModulesPath)],
    },
    module: {
        rules: [
            {
                test: /\.(t|j)sx?$/,
                exclude: /\/node_modules\/(?!.+\.tsx?$).*$/,
                use: [
                    {
                        loader: require.resolve('swc-loader'),
                        options: {
                            jsc: {
                                parser: {
                                    syntax: 'typescript',
                                    tsx: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                oneOf: [
                    {
                        test: /\.(?:ico|gif|png|jpg|jpeg|woff(2)?|eot|ttf|otf|svg)$/i,
                        type: 'asset/resource',
                    },
                ],
            },
        ],
    },
    resolve: {
        fallback: {
            path: require.resolve('path-browserify'),
            crypto: false,
            https: false,
            http: false,
        },
        modules: ['node_modules', path_1.default.resolve(__dirname, nodeModulesPath)],
        alias: {
            'payload-config': payloadConfig.paths.rawConfig,
            payload$: mockModulePath,
            'payload-user-css': payloadConfig.admin.css,
            dotenv: mockDotENVPath,
            [bundlerPath]: mockModulePath,
        },
        extensions: ['.ts', '.tsx', '.js', '.json'],
    },
    plugins: [
        new webpack_1.default.ProvidePlugin({ process: require.resolve('process/browser') }),
        new webpack_1.default.DefinePlugin(Object.entries(process.env).reduce((values, [key, val]) => {
            if (key.indexOf('PAYLOAD_PUBLIC_') === 0) {
                return ({
                    ...values,
                    [`process.env.${key}`]: `'${val}'`,
                });
            }
            return values;
        }, {})),
        new html_webpack_plugin_1.default({
            template: payloadConfig.admin.indexHTML,
            filename: path_1.default.normalize('./index.html'),
        }),
        new webpack_1.default.HotModuleReplacementPlugin(),
    ],
});
exports.getBaseConfig = getBaseConfig;
//# sourceMappingURL=base.js.map