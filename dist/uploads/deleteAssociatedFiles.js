"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAssociatedFiles = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const errors_1 = require("../errors");
const fileExists_1 = __importDefault(require("./fileExists"));
const deleteAssociatedFiles = async ({ config, collectionConfig, files = [], doc, t, overrideDelete, }) => {
    if (!collectionConfig.upload)
        return;
    if (overrideDelete || files.length > 0) {
        const { staticDir } = collectionConfig.upload;
        const staticPath = path_1.default.resolve(config.paths.configDir, staticDir);
        const fileToDelete = `${staticPath}/${doc.filename}`;
        try {
            if (await (0, fileExists_1.default)(fileToDelete)) {
                fs_1.default.unlinkSync(fileToDelete);
            }
        }
        catch (err) {
            throw new errors_1.ErrorDeletingFile(t);
        }
        if (doc.sizes) {
            const sizes = Object.values(doc.sizes);
            // Since forEach will not wait until unlink is finished it could
            // happen that two operations will try to delete the same file.
            // To avoid this it is recommended to use "sync" instead
            // eslint-disable-next-line no-restricted-syntax
            for (const size of sizes) {
                const sizeToDelete = `${staticPath}/${size.filename}`;
                try {
                    // eslint-disable-next-line no-await-in-loop
                    if (await (0, fileExists_1.default)(sizeToDelete)) {
                        fs_1.default.unlinkSync(sizeToDelete);
                    }
                }
                catch (err) {
                    throw new errors_1.ErrorDeletingFile(t);
                }
            }
        }
    }
};
exports.deleteAssociatedFiles = deleteAssociatedFiles;
//# sourceMappingURL=deleteAssociatedFiles.js.map