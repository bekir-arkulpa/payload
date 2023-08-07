"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.combineQueries = void 0;
const auth_1 = require("../auth");
const combineQueries = (where, access) => {
    if (!where && !access)
        return {};
    const result = {
        and: [],
    };
    if (where)
        result.and.push(where);
    if ((0, auth_1.hasWhereAccessResult)(access))
        result.and.push(access);
    return result;
};
exports.combineQueries = combineQueries;
//# sourceMappingURL=combineQueries.js.map