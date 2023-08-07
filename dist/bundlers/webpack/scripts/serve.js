"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serveAdmin = void 0;
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const connect_history_api_fallback_1 = __importDefault(require("connect-history-api-fallback"));
const router = express_1.default.Router();
const serveAdmin = async ({ payload }) => {
    router.use((0, connect_history_api_fallback_1.default)());
    router.get('*', (req, res, next) => {
        if (req.path.substr(-1) === '/' && req.path.length > 1) {
            const query = req.url.slice(req.path.length);
            res.redirect(301, req.path.slice(0, -1) + query);
        }
        else {
            next();
        }
    });
    router.use((0, compression_1.default)(payload.config.express.compression));
    router.use(express_1.default.static(payload.config.admin.buildPath, { redirect: false }));
    return router;
};
exports.serveAdmin = serveAdmin;
//# sourceMappingURL=serve.js.map