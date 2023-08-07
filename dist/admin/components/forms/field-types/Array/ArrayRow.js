"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayRow = void 0;
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const Collapsible_1 = require("../../../elements/Collapsible");
const RenderFields_1 = __importDefault(require("../../RenderFields"));
const ArrayAction_1 = require("../../../elements/ArrayAction");
const HiddenInput_1 = __importDefault(require("../HiddenInput"));
const RowLabel_1 = require("../../RowLabel");
const getTranslation_1 = require("../../../../../utilities/getTranslation");
const createNestedFieldPath_1 = require("../../Form/createNestedFieldPath");
const context_1 = require("../../Form/context");
const ErrorPill_1 = require("../../../elements/ErrorPill");
require("./index.scss");
const baseClass = 'array-field';
const ArrayRow = ({ path: parentPath, addRow, removeRow, moveRow, duplicateRow, setCollapse, transform, listeners, attributes, setNodeRef, row, rowIndex, rowCount, indexPath, readOnly, labels, fieldTypes, permissions, CustomRowLabel, fields, hasMaxRows, }) => {
    var _a;
    const path = `${parentPath}.${rowIndex}`;
    const { i18n } = (0, react_i18next_1.useTranslation)();
    const hasSubmitted = (0, context_1.useFormSubmitted)();
    const fallbackLabel = `${(0, getTranslation_1.getTranslation)(labels.singular, i18n)} ${String(rowIndex + 1).padStart(2, '0')}`;
    const childErrorPathsCount = (_a = row.childErrorPaths) === null || _a === void 0 ? void 0 : _a.size;
    const fieldHasErrors = hasSubmitted && childErrorPathsCount > 0;
    const classNames = [
        `${baseClass}__row`,
        fieldHasErrors ? `${baseClass}__row--has-errors` : `${baseClass}__row--no-errors`,
    ].filter(Boolean).join(' ');
    return (react_1.default.createElement("div", { key: `${parentPath}-row-${row.id}`, id: `${parentPath.split('.').join('-')}-row-${rowIndex}`, ref: setNodeRef, style: {
            transform,
        } },
        react_1.default.createElement(Collapsible_1.Collapsible, { collapsed: row.collapsed, onToggle: (collapsed) => setCollapse(row.id, collapsed), className: classNames, collapsibleStyle: fieldHasErrors ? 'error' : 'default', dragHandleProps: {
                id: row.id,
                attributes,
                listeners,
            }, header: (react_1.default.createElement("div", { className: `${baseClass}__row-header` },
                react_1.default.createElement(RowLabel_1.RowLabel, { path: path, label: CustomRowLabel || fallbackLabel, rowNumber: rowIndex + 1 }),
                fieldHasErrors && (react_1.default.createElement(ErrorPill_1.ErrorPill, { count: childErrorPathsCount, withMessage: true })))), actions: !readOnly ? (react_1.default.createElement(ArrayAction_1.ArrayAction, { addRow: addRow, removeRow: removeRow, moveRow: moveRow, duplicateRow: duplicateRow, rowCount: rowCount, index: rowIndex, hasMaxRows: hasMaxRows })) : undefined },
            react_1.default.createElement(HiddenInput_1.default, { name: `${path}.id`, value: row.id }),
            react_1.default.createElement(RenderFields_1.default, { className: `${baseClass}__fields`, readOnly: readOnly, fieldTypes: fieldTypes, permissions: permissions === null || permissions === void 0 ? void 0 : permissions.fields, indexPath: indexPath, fieldSchema: fields.map((field) => ({
                    ...field,
                    path: (0, createNestedFieldPath_1.createNestedFieldPath)(path, field),
                })) }))));
};
exports.ArrayRow = ArrayRow;
//# sourceMappingURL=ArrayRow.js.map