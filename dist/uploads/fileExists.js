"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const fileExists = async (filename) => {
    try {
        await fs_1.default.promises.stat(filename);
        return true;
    }
    catch (err) {
        return false;
    }
};
exports.default = fileExists;
//# sourceMappingURL=fileExists.js.map