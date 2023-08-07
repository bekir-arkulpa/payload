"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateStatus = void 0;
const console_table_printer_1 = require("console-table-printer");
const readMigrationFiles_1 = require("./readMigrationFiles");
const getMigrations_1 = require("./getMigrations");
async function migrateStatus() {
    const { payload } = this;
    const migrationFiles = await (0, readMigrationFiles_1.readMigrationFiles)({ payload });
    const { existingMigrations } = await (0, getMigrations_1.getMigrations)({ payload });
    if (!migrationFiles.length) {
        payload.logger.info({ msg: 'No migrations found.' });
        return;
    }
    // Compare migration files to existing migrations
    const statuses = migrationFiles.map((migration) => {
        const existingMigration = existingMigrations.find((m) => m.name === migration.name);
        return {
            Ran: existingMigration ? 'Yes' : 'No',
            Name: migration.name,
            Batch: existingMigration === null || existingMigration === void 0 ? void 0 : existingMigration.batch,
        };
    });
    const p = new console_table_printer_1.Table();
    statuses.forEach((s) => {
        p.addRow(s, {
            color: s.Ran === 'Yes' ? 'green' : 'red',
        });
    });
    p.printTable();
}
exports.migrateStatus = migrateStatus;
//# sourceMappingURL=migrateStatus.js.map