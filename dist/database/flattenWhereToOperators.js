"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Take a where query and flatten it to all top-level operators
const flattenWhereToOperators = (query) => Object.entries(query).reduce((flattenedConstraints, [key, val]) => {
    if ((key === 'and' || key === 'or') && Array.isArray(val)) {
        return [
            ...flattenedConstraints,
            ...val.reduce((subVals, subVal) => {
                return [
                    ...subVals,
                    ...flattenWhereToOperators(subVal),
                ];
            }, []),
        ];
    }
    return [
        ...flattenedConstraints,
        val,
    ];
}, []);
exports.default = flattenWhereToOperators;
//# sourceMappingURL=flattenWhereToOperators.js.map