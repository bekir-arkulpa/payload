"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAdmin = void 0;
const webpack_1 = __importDefault(require("webpack"));
const prod_1 = require("../configs/prod");
const buildAdmin = async ({ payloadConfig }) => {
    try {
        const webpackConfig = (0, prod_1.getProdConfig)(payloadConfig);
        (0, webpack_1.default)(webpackConfig, (err, stats) => {
            if (err || stats.hasErrors()) {
                // Handle errors here
                if (stats) {
                    console.error(stats.toString({
                        chunks: false,
                        colors: true,
                    }));
                }
                else {
                    console.error(err.message);
                }
            }
        });
    }
    catch (err) {
        console.error(err);
        throw new Error('Error: there was an error building the webpack prod config.');
    }
};
exports.buildAdmin = buildAdmin;
//# sourceMappingURL=build.js.map