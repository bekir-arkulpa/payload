"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dev_1 = require("./scripts/dev");
const build_1 = require("./scripts/build");
const serve_1 = require("./scripts/serve");
exports.default = () => ({
    dev: async (payload) => (0, dev_1.devAdmin)({ payload }),
    build: async (payloadConfig) => (0, build_1.buildAdmin)({ payloadConfig }),
    serve: async (payload) => (0, serve_1.serveAdmin)({ payload }),
});
//# sourceMappingURL=bundler.js.map