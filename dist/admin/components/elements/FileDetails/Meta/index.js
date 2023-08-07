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
const Config_1 = require("../../../utilities/Config");
const CopyToClipboard_1 = __importDefault(require("../../CopyToClipboard"));
const formatFilesize_1 = __importDefault(require("../../../../../uploads/formatFilesize"));
const DocumentDrawer_1 = require("../../DocumentDrawer");
const Edit_1 = __importDefault(require("../../../icons/Edit"));
const Tooltip_1 = __importDefault(require("../../Tooltip"));
require("./index.scss");
const baseClass = 'file-meta';
const Meta = (props) => {
    const { filename, filesize, width, height, mimeType, staticURL, url, id, collection, } = props;
    const [hovered, setHovered] = (0, react_1.useState)(false);
    const openInDrawer = Boolean(id && collection);
    const [DocumentDrawer, DocumentDrawerToggler,] = (0, DocumentDrawer_1.useDocumentDrawer)({
        id, collectionSlug: collection,
    });
    const { serverURL } = (0, Config_1.useConfig)();
    const fileURL = url || `${serverURL}${staticURL}/${filename}`;
    return (react_1.default.createElement("div", { className: baseClass },
        react_1.default.createElement("div", { className: `${baseClass}__url` },
            openInDrawer && react_1.default.createElement(DocumentDrawer, null),
            react_1.default.createElement("a", { href: fileURL, target: "_blank", rel: "noopener noreferrer" }, filename),
            react_1.default.createElement(CopyToClipboard_1.default, { value: fileURL, defaultMessage: "Copy URL" }),
            openInDrawer
                && (react_1.default.createElement(DocumentDrawerToggler, { className: `${baseClass}__edit`, onMouseEnter: () => setHovered(true), onMouseLeave: () => setHovered(false) },
                    react_1.default.createElement(Edit_1.default, null),
                    react_1.default.createElement(Tooltip_1.default, { show: hovered }, "Edit")))),
        react_1.default.createElement("div", { className: `${baseClass}__size-type` },
            (0, formatFilesize_1.default)(filesize),
            (width && height) && (react_1.default.createElement(react_1.default.Fragment, null,
                "\u00A0-\u00A0",
                width,
                "x",
                height)),
            mimeType && (react_1.default.createElement(react_1.default.Fragment, null,
                "\u00A0-\u00A0",
                mimeType)))));
};
exports.default = Meta;
//# sourceMappingURL=index.js.map