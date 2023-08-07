"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQueryPaths = void 0;
const QueryError_1 = __importDefault(require("../../errors/QueryError"));
const flattenTopLevelFields_1 = __importDefault(require("../../utilities/flattenTopLevelFields"));
const validateSearchParams_1 = require("./validateSearchParams");
const deepCopyObject_1 = __importDefault(require("../../utilities/deepCopyObject"));
const types_1 = require("./types");
const flattenWhere = (query) => Object.entries(query).reduce((flattenedConstraints, [key, val]) => {
    if ((key === 'and' || key === 'or') && Array.isArray(val)) {
        return [
            ...flattenedConstraints,
            ...val.map((subVal) => flattenWhere(subVal)),
        ];
    }
    return [
        ...flattenedConstraints,
        { [key]: val },
    ];
}, []);
async function validateQueryPaths({ where, collectionConfig, globalConfig, errors = [], policies = {
    collections: {},
    globals: {},
}, versionFields, req, overrideAccess, }) {
    const fields = (0, flattenTopLevelFields_1.default)(versionFields || (globalConfig || collectionConfig).fields);
    if (typeof where === 'object') {
        // const flattenedWhere = flattenWhere(where);
        const whereFields = flattenWhere(where);
        // We need to determine if the whereKey is an AND, OR, or a schema path
        const promises = [];
        whereFields.map(async (constraint) => {
            Object.keys(constraint).map(async (path) => {
                Object.entries(constraint[path]).map(async ([operator, val]) => {
                    if (types_1.validOperators.includes(operator)) {
                        promises.push((0, validateSearchParams_1.validateSearchParam)({
                            collectionConfig: (0, deepCopyObject_1.default)(collectionConfig),
                            globalConfig: (0, deepCopyObject_1.default)(globalConfig),
                            fields: fields,
                            versionFields,
                            errors,
                            policies,
                            req,
                            path,
                            val,
                            operator,
                            overrideAccess,
                        }));
                    }
                });
            });
        });
        await Promise.all(promises);
        if (errors.length > 0) {
            throw new QueryError_1.default(errors);
        }
    }
}
exports.validateQueryPaths = validateQueryPaths;
//# sourceMappingURL=validateQueryPaths.js.map