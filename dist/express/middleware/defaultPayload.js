"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const setRequestContext_1 = require("../setRequestContext");
function defaultPayload(req, res, next) {
    (0, setRequestContext_1.setRequestContext)(req);
    next();
}
exports.default = defaultPayload;
//# sourceMappingURL=defaultPayload.js.map