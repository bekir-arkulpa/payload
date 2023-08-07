"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.devAdmin = void 0;
const webpack_1 = __importDefault(require("webpack"));
const express_1 = __importDefault(require("express"));
const webpack_dev_middleware_1 = __importDefault(require("webpack-dev-middleware"));
const webpack_hot_middleware_1 = __importDefault(require("webpack-hot-middleware"));
const connect_history_api_fallback_1 = __importDefault(require("connect-history-api-fallback"));
const dev_1 = require("../configs/dev");
const router = express_1.default.Router();
const devAdmin = async ({ payload }) => {
    router.use((0, connect_history_api_fallback_1.default)());
    try {
        const webpackConfig = (0, dev_1.getDevConfig)(payload.config);
        const compiler = (0, webpack_1.default)(webpackConfig);
        router.use((0, webpack_dev_middleware_1.default)(compiler, {
            publicPath: '/',
        }));
        router.use((0, webpack_hot_middleware_1.default)(compiler));
    }
    catch (err) {
        console.error(err);
        throw new Error('Error: there was an error creating the webpack dev server.');
    }
    return router;
};
exports.devAdmin = devAdmin;
//# sourceMappingURL=dev.js.map