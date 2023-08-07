"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatchFormErrors = void 0;
const useThrottledEffect_1 = __importDefault(require("../../../hooks/useThrottledEffect"));
const WatchFormErrors = ({ buildRowErrors }) => {
    (0, useThrottledEffect_1.default)(() => {
        buildRowErrors();
    }, 250, [buildRowErrors]);
    return null;
};
exports.WatchFormErrors = WatchFormErrors;
//# sourceMappingURL=WatchFormErrors.js.map