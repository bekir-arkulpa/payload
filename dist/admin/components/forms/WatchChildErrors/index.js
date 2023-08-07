"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatchChildErrors = void 0;
const react_1 = __importDefault(require("react"));
const types_1 = require("../../../../fields/config/types");
const context_1 = require("../Form/context");
const useThrottledEffect_1 = __importDefault(require("../../../hooks/useThrottledEffect"));
const buildPathSegments = (parentPath, fieldSchema) => {
    const pathNames = fieldSchema.reduce((acc, subField) => {
        if ((0, types_1.fieldHasSubFields)(subField) && (0, types_1.fieldAffectsData)(subField)) {
            // group, block, array
            acc.push(parentPath ? `${parentPath}.${subField.name}.` : `${subField.name}.`);
        }
        else if ((0, types_1.fieldHasSubFields)(subField)) {
            // rows, collapsibles, unnamed-tab
            acc.push(...buildPathSegments(parentPath, subField.fields));
        }
        else if (subField.type === 'tabs') {
            // tabs
            subField.tabs.forEach((tab) => {
                let tabPath = parentPath;
                if ((0, types_1.tabHasName)(tab)) {
                    tabPath = parentPath ? `${parentPath}.${tab.name}` : tab.name;
                }
                acc.push(...buildPathSegments(tabPath, tab.fields));
            });
        }
        else if ((0, types_1.fieldAffectsData)(subField)) {
            // text, number, date, etc.
            acc.push(parentPath ? `${parentPath}.${subField.name}` : subField.name);
        }
        return acc;
    }, []);
    return pathNames;
};
const WatchChildErrors = ({ path, fieldSchema, setErrorCount }) => {
    const [fields] = (0, context_1.useAllFormFields)();
    const hasSubmitted = (0, context_1.useFormSubmitted)();
    const [pathSegments] = react_1.default.useState(() => {
        if (fieldSchema) {
            return buildPathSegments(path, fieldSchema);
        }
        return [`${path}.`];
    });
    (0, useThrottledEffect_1.default)(() => {
        let errorCount = 0;
        if (hasSubmitted) {
            Object.entries(fields).forEach(([key]) => {
                const matchingSegment = pathSegments.some((segment) => {
                    if (segment.endsWith('.')) {
                        return key.startsWith(segment);
                    }
                    return key === segment;
                });
                if (matchingSegment) {
                    if ('valid' in fields[key] && !fields[key].valid) {
                        errorCount += 1;
                    }
                }
            });
        }
        setErrorCount(errorCount);
    }, 250, [fields, hasSubmitted, pathSegments]);
    return null;
};
exports.WatchChildErrors = WatchChildErrors;
//# sourceMappingURL=index.js.map