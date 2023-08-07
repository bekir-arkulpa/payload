"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const withCondition_1 = __importDefault(require("../../withCondition"));
const Button_1 = __importDefault(require("../../../elements/Button"));
const context_1 = require("../../Form/context");
const useField_1 = __importDefault(require("../../useField"));
const Locale_1 = require("../../../utilities/Locale");
const Error_1 = __importDefault(require("../../Error"));
const validations_1 = require("../../../../../fields/validations");
const Banner_1 = __importDefault(require("../../../elements/Banner"));
const FieldDescription_1 = __importDefault(require("../../FieldDescription"));
const DocumentInfo_1 = require("../../../utilities/DocumentInfo");
const scrollToID_1 = require("../../../../utilities/scrollToID");
const getTranslation_1 = require("../../../../../utilities/getTranslation");
const Config_1 = require("../../../utilities/Config");
const NullifyField_1 = require("../../NullifyField");
const DraggableSortable_1 = __importDefault(require("../../../elements/DraggableSortable"));
const DraggableSortableItem_1 = __importDefault(require("../../../elements/DraggableSortable/DraggableSortableItem"));
const ArrayRow_1 = require("./ArrayRow");
const ErrorPill_1 = require("../../../elements/ErrorPill");
require("./index.scss");
const baseClass = 'array-field';
const ArrayFieldType = (props) => {
    var _a, _b;
    const { name, path: pathFromProps, fields, fieldTypes, validate = validations_1.array, required, maxRows, minRows, permissions, indexPath, localized, admin: { readOnly, description, condition, className, components, }, } = props;
    const path = pathFromProps || name;
    // eslint-disable-next-line react/destructuring-assignment
    const label = (_a = props === null || props === void 0 ? void 0 : props.label) !== null && _a !== void 0 ? _a : (_b = props === null || props === void 0 ? void 0 : props.labels) === null || _b === void 0 ? void 0 : _b.singular;
    const CustomRowLabel = (components === null || components === void 0 ? void 0 : components.RowLabel) || undefined;
    const { setDocFieldPreferences } = (0, DocumentInfo_1.useDocumentInfo)();
    const { dispatchFields, setModified, addFieldRow, removeFieldRow } = (0, context_1.useForm)();
    const submitted = (0, context_1.useFormSubmitted)();
    const locale = (0, Locale_1.useLocale)();
    const { t, i18n } = (0, react_i18next_1.useTranslation)('fields');
    const { localization } = (0, Config_1.useConfig)();
    const editingDefaultLocale = (() => {
        if (localization && localization.fallback) {
            const defaultLocale = localization.defaultLocale || 'en';
            return locale === defaultLocale;
        }
        return true;
    })();
    // Handle labeling for Arrays, Global Arrays, and Blocks
    const getLabels = (p) => {
        if (p === null || p === void 0 ? void 0 : p.labels)
            return p.labels;
        if (p === null || p === void 0 ? void 0 : p.label)
            return { singular: p.label, plural: undefined };
        return { singular: t('row'), plural: t('rows') };
    };
    const labels = getLabels(props);
    const memoizedValidate = (0, react_1.useCallback)((value, options) => {
        // alternative locales can be null
        if (!editingDefaultLocale && value === null) {
            return true;
        }
        return validate(value, { ...options, minRows, maxRows, required });
    }, [maxRows, minRows, required, validate, editingDefaultLocale]);
    const { showError, errorMessage, value, rows = [], valid, } = (0, useField_1.default)({
        path,
        validate: memoizedValidate,
        condition,
        hasRows: true,
    });
    const addRow = (0, react_1.useCallback)(async (rowIndex) => {
        await addFieldRow({ rowIndex, path });
        setModified(true);
        setTimeout(() => {
            (0, scrollToID_1.scrollToID)(`${path}-row-${rowIndex + 1}`);
        }, 0);
    }, [addFieldRow, path, setModified]);
    const duplicateRow = (0, react_1.useCallback)(async (rowIndex) => {
        dispatchFields({ type: 'DUPLICATE_ROW', rowIndex, path });
        setModified(true);
        setTimeout(() => {
            (0, scrollToID_1.scrollToID)(`${path}-row-${rowIndex + 1}`);
        }, 0);
    }, [dispatchFields, path, setModified]);
    const removeRow = (0, react_1.useCallback)((rowIndex) => {
        removeFieldRow({ rowIndex, path });
        setModified(true);
    }, [removeFieldRow, path, setModified]);
    const moveRow = (0, react_1.useCallback)((moveFromIndex, moveToIndex) => {
        dispatchFields({ type: 'MOVE_ROW', moveFromIndex, moveToIndex, path });
        setModified(true);
    }, [dispatchFields, path, setModified]);
    const toggleCollapseAll = (0, react_1.useCallback)(async (collapsed) => {
        dispatchFields({ type: 'SET_ALL_ROWS_COLLAPSED', path, collapsed, setDocFieldPreferences });
    }, [dispatchFields, path, setDocFieldPreferences]);
    const setCollapse = (0, react_1.useCallback)(async (rowID, collapsed) => {
        dispatchFields({ type: 'SET_ROW_COLLAPSED', path, collapsed, rowID, setDocFieldPreferences });
    }, [dispatchFields, path, setDocFieldPreferences]);
    const hasMaxRows = maxRows && rows.length >= maxRows;
    const fieldErrorCount = rows.reduce((total, row) => { var _a; return total + (((_a = row === null || row === void 0 ? void 0 : row.childErrorPaths) === null || _a === void 0 ? void 0 : _a.size) || 0); }, 0) + (valid ? 0 : 1);
    const fieldHasErrors = submitted && fieldErrorCount > 0;
    const classes = [
        'field-type',
        baseClass,
        className,
        fieldHasErrors ? `${baseClass}--has-error` : `${baseClass}--has-no-error`,
    ].filter(Boolean).join(' ');
    return (react_1.default.createElement("div", { id: `field-${path.replace(/\./gi, '__')}`, className: classes },
        react_1.default.createElement("div", { className: `${baseClass}__error-wrap` },
            react_1.default.createElement(Error_1.default, { showError: showError, message: errorMessage })),
        react_1.default.createElement("header", { className: `${baseClass}__header` },
            react_1.default.createElement("div", { className: `${baseClass}__header-wrap` },
                react_1.default.createElement("div", { className: `${baseClass}__header-content` },
                    react_1.default.createElement("h3", null, (0, getTranslation_1.getTranslation)(label || name, i18n)),
                    fieldHasErrors && fieldErrorCount > 0 && (react_1.default.createElement(ErrorPill_1.ErrorPill, { count: fieldErrorCount, withMessage: true }))),
                react_1.default.createElement("ul", { className: `${baseClass}__header-actions` },
                    react_1.default.createElement("li", null,
                        react_1.default.createElement("button", { type: "button", onClick: () => toggleCollapseAll(true), className: `${baseClass}__header-action` }, t('collapseAll'))),
                    react_1.default.createElement("li", null,
                        react_1.default.createElement("button", { type: "button", onClick: () => toggleCollapseAll(false), className: `${baseClass}__header-action` }, t('showAll'))))),
            react_1.default.createElement(FieldDescription_1.default, { className: `field-description-${path.replace(/\./gi, '__')}`, value: value, description: description })),
        react_1.default.createElement(NullifyField_1.NullifyLocaleField, { localized: localized, path: path, fieldValue: value }),
        react_1.default.createElement(DraggableSortable_1.default, { ids: rows.map((row) => row.id), onDragEnd: ({ moveFromIndex, moveToIndex }) => moveRow(moveFromIndex, moveToIndex), className: `${baseClass}__draggable-rows` },
            rows.length > 0 && rows.map((row, i) => (react_1.default.createElement(DraggableSortableItem_1.default, { key: row.id, id: row.id, disabled: readOnly }, (draggableSortableItemProps) => (react_1.default.createElement(ArrayRow_1.ArrayRow, { ...draggableSortableItemProps, row: row, addRow: addRow, duplicateRow: duplicateRow, removeRow: removeRow, setCollapse: setCollapse, path: path, fieldTypes: fieldTypes, fields: fields, moveRow: moveRow, readOnly: readOnly, rowCount: rows.length, permissions: permissions, CustomRowLabel: CustomRowLabel, rowIndex: i, indexPath: indexPath, labels: labels, hasMaxRows: hasMaxRows }))))),
            !valid && (react_1.default.createElement(react_1.default.Fragment, null,
                readOnly && (rows.length === 0) && (react_1.default.createElement(Banner_1.default, null, t('validation:fieldHasNo', { label: (0, getTranslation_1.getTranslation)(labels.plural, i18n) }))),
                (rows.length < minRows || (required && rows.length === 0)) && (react_1.default.createElement(Banner_1.default, { type: "error" }, t('validation:requiresAtLeast', {
                    count: minRows,
                    label: (0, getTranslation_1.getTranslation)(minRows ? labels.plural : labels.singular, i18n) || t(minRows > 1 ? 'general:row' : 'general:rows'),
                })))))),
        (!readOnly && !hasMaxRows) && (react_1.default.createElement("div", { className: `${baseClass}__add-button-wrap` },
            react_1.default.createElement(Button_1.default, { icon: "plus", buttonStyle: "icon-label", iconStyle: "with-border", iconPosition: "left", onClick: () => addRow(value) }, t('addLabel', { label: (0, getTranslation_1.getTranslation)(labels.singular, i18n) }))))));
};
exports.default = (0, withCondition_1.default)(ArrayFieldType);
//# sourceMappingURL=index.js.map