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
const Locale_1 = require("../../../utilities/Locale");
const withCondition_1 = __importDefault(require("../../withCondition"));
const DocumentInfo_1 = require("../../../utilities/DocumentInfo");
const context_1 = require("../../Form/context");
const Error_1 = __importDefault(require("../../Error"));
const useField_1 = __importDefault(require("../../useField"));
const BlocksDrawer_1 = require("./BlocksDrawer");
const validations_1 = require("../../../../../fields/validations");
const Banner_1 = __importDefault(require("../../../elements/Banner"));
const FieldDescription_1 = __importDefault(require("../../FieldDescription"));
const scrollToID_1 = require("../../../../utilities/scrollToID");
const getTranslation_1 = require("../../../../../utilities/getTranslation");
const NullifyField_1 = require("../../NullifyField");
const Config_1 = require("../../../utilities/Config");
const DraggableSortable_1 = __importDefault(require("../../../elements/DraggableSortable"));
const DraggableSortableItem_1 = __importDefault(require("../../../elements/DraggableSortable/DraggableSortableItem"));
const useDrawerSlug_1 = require("../../../elements/Drawer/useDrawerSlug");
const Button_1 = __importDefault(require("../../../elements/Button"));
const Drawer_1 = require("../../../elements/Drawer");
const BlockRow_1 = require("./BlockRow");
const ErrorPill_1 = require("../../../elements/ErrorPill");
require("./index.scss");
const baseClass = 'blocks-field';
const BlocksField = (props) => {
    const { t, i18n } = (0, react_i18next_1.useTranslation)('fields');
    const { label, name, path: pathFromProps, blocks, labels: labelsFromProps, fieldTypes, maxRows, minRows, required, validate = validations_1.blocks, permissions, indexPath, localized, admin: { readOnly, description, condition, className, }, } = props;
    const path = pathFromProps || name;
    const { setDocFieldPreferences } = (0, DocumentInfo_1.useDocumentInfo)();
    const { dispatchFields, setModified, addFieldRow, removeFieldRow } = (0, context_1.useForm)();
    const locale = (0, Locale_1.useLocale)();
    const { localization } = (0, Config_1.useConfig)();
    const drawerSlug = (0, useDrawerSlug_1.useDrawerSlug)('blocks-drawer');
    const submitted = (0, context_1.useFormSubmitted)();
    const labels = {
        singular: t('block'),
        plural: t('blocks'),
        ...labelsFromProps,
    };
    const editingDefaultLocale = (() => {
        if (localization && localization.fallback) {
            const defaultLocale = localization.defaultLocale || 'en';
            return locale === defaultLocale;
        }
        return true;
    })();
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
    const addRow = (0, react_1.useCallback)(async (rowIndex, blockType) => {
        addFieldRow({
            path,
            rowIndex,
            data: {
                blockType,
            },
        });
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
        removeFieldRow({ path, rowIndex });
        setModified(true);
    }, [path, removeFieldRow, setModified]);
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
    const fieldErrorCount = rows.reduce((total, row) => { var _a; return total + (((_a = row === null || row === void 0 ? void 0 : row.childErrorPaths) === null || _a === void 0 ? void 0 : _a.size) || 0); }, 0);
    const fieldHasErrors = submitted && fieldErrorCount + (valid ? 0 : 1) > 0;
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
                react_1.default.createElement("div", { className: `${baseClass}__heading-with-error` },
                    react_1.default.createElement("h3", null, (0, getTranslation_1.getTranslation)(label || name, i18n)),
                    fieldHasErrors && fieldErrorCount > 0 && (react_1.default.createElement(ErrorPill_1.ErrorPill, { count: fieldErrorCount, withMessage: true }))),
                react_1.default.createElement("ul", { className: `${baseClass}__header-actions` },
                    react_1.default.createElement("li", null,
                        react_1.default.createElement("button", { type: "button", onClick: () => toggleCollapseAll(true), className: `${baseClass}__header-action` }, t('collapseAll'))),
                    react_1.default.createElement("li", null,
                        react_1.default.createElement("button", { type: "button", onClick: () => toggleCollapseAll(false), className: `${baseClass}__header-action` }, t('showAll'))))),
            react_1.default.createElement(FieldDescription_1.default, { value: value, description: description })),
        react_1.default.createElement(NullifyField_1.NullifyLocaleField, { localized: localized, path: path, fieldValue: value }),
        react_1.default.createElement(DraggableSortable_1.default, { ids: rows.map((row) => row.id), onDragEnd: ({ moveFromIndex, moveToIndex }) => moveRow(moveFromIndex, moveToIndex) },
            rows.length > 0 && rows.map((row, i) => {
                const { blockType } = row;
                const blockToRender = blocks.find((block) => block.slug === blockType);
                if (blockToRender) {
                    return (react_1.default.createElement(DraggableSortableItem_1.default, { key: row.id, id: row.id, disabled: readOnly }, (draggableSortableItemProps) => (react_1.default.createElement(BlockRow_1.BlockRow, { ...draggableSortableItemProps, row: row, rowIndex: i, indexPath: indexPath, addRow: addRow, duplicateRow: duplicateRow, removeRow: removeRow, moveRow: moveRow, setCollapse: setCollapse, blockToRender: blockToRender, blocks: blocks, fieldTypes: fieldTypes, permissions: permissions, readOnly: readOnly, rowCount: rows.length, labels: labels, path: path, hasMaxRows: hasMaxRows }))));
                }
                return null;
            }),
            !editingDefaultLocale && (react_1.default.createElement(react_1.default.Fragment, null,
                (rows.length < minRows || (required && rows.length === 0)) && (react_1.default.createElement(Banner_1.default, { type: "error" }, t('validation:requiresAtLeast', {
                    count: minRows,
                    label: (0, getTranslation_1.getTranslation)(minRows === 1 || typeof minRows === 'undefined' ? labels.singular : labels.plural, i18n),
                }))),
                (rows.length === 0 && readOnly) && (react_1.default.createElement(Banner_1.default, null, t('validation:fieldHasNo', { label: (0, getTranslation_1.getTranslation)(labels.plural, i18n) })))))),
        (!readOnly && !hasMaxRows) && (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(Drawer_1.DrawerToggler, { slug: drawerSlug, className: `${baseClass}__drawer-toggler` },
                react_1.default.createElement(Button_1.default, { el: "span", icon: "plus", buttonStyle: "icon-label", iconStyle: "with-border", iconPosition: "left" }, t('addLabel', { label: (0, getTranslation_1.getTranslation)(labels.singular, i18n) }))),
            react_1.default.createElement(BlocksDrawer_1.BlocksDrawer, { drawerSlug: drawerSlug, blocks: blocks, addRow: addRow, addRowIndex: value, labels: labels })))));
};
exports.default = (0, withCondition_1.default)(BlocksField);
//# sourceMappingURL=index.js.map