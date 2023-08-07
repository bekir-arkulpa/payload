"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMigration = void 0;
/* eslint-disable no-restricted-syntax, no-await-in-loop */
const fs_1 = __importDefault(require("fs"));
const migrationTemplate_1 = require("./migrationTemplate");
const createMigration = async function createMigration({ payload, migrationDir, migrationName, }) {
    const dir = migrationDir || '.migrations'; // TODO: Verify path after linking
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir);
    }
    const [yyymmdd, hhmmss] = new Date().toISOString().split('T');
    const formattedDate = yyymmdd.replace(/\D/g, '');
    const formattedTime = hhmmss.split('.')[0].replace(/\D/g, '');
    const timestamp = `${formattedDate}_${formattedTime}`;
    const formattedName = migrationName.replace(/\W/g, '_');
    const fileName = `${timestamp}_${formattedName}.ts`;
    const filePath = `${dir}/${fileName}`;
    fs_1.default.writeFileSync(filePath, migrationTemplate_1.migrationTemplate);
    payload.logger.info({ msg: `Migration created at ${filePath}` });
};
exports.createMigration = createMigration;
//# sourceMappingURL=createMigration.js.map