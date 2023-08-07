"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorPill = void 0;
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
require("./index.scss");
const baseClass = 'error-pill';
const ErrorPill = (props) => {
    const { className, count, withMessage } = props;
    const lessThan3Chars = !withMessage && count < 99;
    const { t } = (0, react_i18next_1.useTranslation)();
    const classes = [
        baseClass,
        lessThan3Chars && `${baseClass}--fixed-width`,
        className && className,
    ].filter(Boolean).join(' ');
    if (count === 0)
        return null;
    return (react_1.default.createElement("div", { className: classes },
        react_1.default.createElement("div", { className: `${baseClass}__content` },
            react_1.default.createElement("span", { className: `${baseClass}__count` }, count),
            withMessage && ` ${count > 1 ? t('general:errors') : t('general:error')}`)));
};
exports.ErrorPill = ErrorPill;
//# sourceMappingURL=index.js.map