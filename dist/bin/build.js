"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = void 0;
const load_1 = __importDefault(require("../config/load"));
const build = async () => {
    const config = await (0, load_1.default)(); // Will throw its own error if it fails
    await config.admin.bundler.build(config);
};
exports.build = build;
// when build.js is launched directly
if (module.id === require.main.id) {
    (0, exports.build)();
}
//# sourceMappingURL=build.js.map