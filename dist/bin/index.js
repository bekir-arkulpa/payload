"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-var-requires */
const minimist_1 = __importDefault(require("minimist"));
const register_1 = __importDefault(require("@swc/register"));
const get_tsconfig_1 = require("get-tsconfig");
const generateTypes_1 = require("./generateTypes");
const generateGraphQLSchema_1 = require("./generateGraphQLSchema");
const tsConfig = (0, get_tsconfig_1.getTsconfig)();
const swcOptions = {
    sourceMaps: 'inline',
    jsc: {
        parser: {
            syntax: 'typescript',
            tsx: true,
        },
        paths: undefined,
        baseUrl: undefined,
    },
    module: {
        type: 'commonjs',
    },
    ignore: [
        /.*\/node_modules\/.*/, // parse everything besides files within node_modules
    ],
};
if ((_b = (_a = tsConfig === null || tsConfig === void 0 ? void 0 : tsConfig.config) === null || _a === void 0 ? void 0 : _a.compilerOptions) === null || _b === void 0 ? void 0 : _b.paths) {
    swcOptions.jsc.paths = tsConfig.config.compilerOptions.paths;
    if ((_d = (_c = tsConfig === null || tsConfig === void 0 ? void 0 : tsConfig.config) === null || _c === void 0 ? void 0 : _c.compilerOptions) === null || _d === void 0 ? void 0 : _d.baseUrl) {
        swcOptions.jsc.baseUrl = tsConfig.config.compilerOptions.baseUrl;
    }
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - bad @swc/register types
(0, register_1.default)(swcOptions);
const { build } = require('./build');
const args = (0, minimist_1.default)(process.argv.slice(2));
const scriptIndex = args._.findIndex((x) => x === 'build');
const script = scriptIndex === -1 ? args._[0] : args._[scriptIndex];
switch (script.toLowerCase()) {
    case 'build': {
        build();
        break;
    }
    case 'generate:types': {
        (0, generateTypes_1.generateTypes)();
        break;
    }
    case 'generate:graphqlschema': {
        (0, generateGraphQLSchema_1.generateGraphQLSchema)();
        break;
    }
    default:
        console.log(`Unknown script "${script}".`);
        break;
}
//# sourceMappingURL=index.js.map