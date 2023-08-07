"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockRow = void 0;
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const Collapsible_1 = require("../../../elements/Collapsible");
const RenderFields_1 = __importDefault(require("../../RenderFields"));
const SectionTitle_1 = __importDefault(require("./SectionTitle"));
const Pill_1 = __importDefault(require("../../../elements/Pill"));
const HiddenInput_1 = __importDefault(require("../HiddenInput"));
const getTranslation_1 = require("../../../../../utilities/getTranslation");
const createNestedFieldPath_1 = require("../../Form/createNestedFieldPath");
const RowActions_1 = require("./RowActions");
const context_1 = require("../../Form/context");
const ErrorPill_1 = require("../../../elements/ErrorPill");
const baseClass = 'blocks-field';
const BlockRow = ({ path: parentPath, addRow, removeRow, moveRow, duplicateRow, setCollapse, transform, listeners, attributes, setNodeRef, row, rowIndex, rowCount, indexPath, readOnly, labels, fieldTypes, permissions, blocks, blockToRender, hasMaxRows, }) => {
    var _a, _b, _c;
    const path = `${parentPath}.${rowIndex}`;
    const { i18n } = (0, react_i18next_1.useTranslation)();
    const hasSubmitted = (0, context_1.useFormSubmitted)();
    const childErrorPathsCount = (_a = row.childErrorPaths) === null || _a === void 0 ? void 0 : _a.size;
    const fieldHasErrors = hasSubmitted && childErrorPathsCount > 0;
    const classNames = [
        `${baseClass}__row`,
        fieldHasErrors ? `${baseClass}__row--has-errors` : `${baseClass}__row--no-errors`,
    ].filter(Boolean).join(' ');
    return (react_1.default.createElement("div", { key: `${parentPath}-row-${rowIndex}`, id: `${parentPath.split('.').join('-')}-row-${rowIndex}`, ref: setNodeRef, style: {
            transform,
        } },
        react_1.default.createElement(Collapsible_1.Collapsible, { collapsed: row.collapsed, onToggle: (collapsed) => setCollapse(row.id, collapsed), className: classNames, collapsibleStyle: fieldHasErrors ? 'error' : 'default', key: row.id, dragHandleProps: {
                id: row.id,
                attributes,
                listeners,
            }, header: (react_1.default.createElement("div", { className: `${baseClass}__block-header` },
                react_1.default.createElement("span", { className: `${baseClass}__block-number` }, String(rowIndex + 1).padStart(2, '0')),
                react_1.default.createElement(Pill_1.default, { pillStyle: "white", className: `${baseClass}__block-pill ${baseClass}__block-pill-${row.blockType}` }, (0, getTranslation_1.getTranslation)(blockToRender.labels.singular, i18n)),
                react_1.default.createElement(SectionTitle_1.default, { path: `${path}.blockName`, readOnly: readOnly }),
                fieldHasErrors && (react_1.default.createElement(ErrorPill_1.ErrorPill, { count: childErrorPathsCount, withMessage: true })))), actions: !readOnly ? (react_1.default.createElement(RowActions_1.RowActions, { addRow: addRow, removeRow: removeRow, moveRow: moveRow, duplicateRow: duplicateRow, rowCount: rowCount, rowIndex: rowIndex, blockType: row.blockType, blocks: blocks, labels: labels, hasMaxRows: hasMaxRows })) : undefined },
            react_1.default.createElement(HiddenInput_1.default, { name: `${path}.id`, value: row.id }),
            react_1.default.createElement(RenderFields_1.default, { className: `${baseClass}__fields`, readOnly: readOnly, fieldTypes: fieldTypes, permissions: (_c = (_b = permissions === null || permissions === void 0 ? void 0 : permissions.blocks) === null || _b === void 0 ? void 0 : _b[row.blockType]) === null || _c === void 0 ? void 0 : _c.fields, fieldSchema: blockToRender.fields.map((field) => ({
                    ...field,
                    path: (0, createNestedFieldPath_1.createNestedFieldPath)(path, field),
                })), indexPath: indexPath }))));
};
exports.BlockRow = BlockRow;
//# sourceMappingURL=BlockRow.js.map