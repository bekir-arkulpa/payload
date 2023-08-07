"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readMigrationFiles = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Read the migration files from disk
 */
const readMigrationFiles = async ({ payload, }) => {
    if (!fs_1.default.existsSync(payload.db.migrationDir))
        return [];
    const files = fs_1.default
        .readdirSync(payload.db.migrationDir)
        .sort()
        .map((file) => {
        return path_1.default.resolve(payload.db.migrationDir, file);
    });
    return files.map((filePath) => {
        var _a;
        // eslint-disable-next-line @typescript-eslint/no-var-requires,import/no-dynamic-require
        const migration = require(filePath);
        migration.name = (_a = path_1.default.basename(filePath).split('.')) === null || _a === void 0 ? void 0 : _a[0];
        return migration;
    });
};
exports.readMigrationFiles = readMigrationFiles;
//# sourceMappingURL=readMigrationFiles.js.map