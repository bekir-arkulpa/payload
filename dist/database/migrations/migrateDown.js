"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateDown = void 0;
const getMigrations_1 = require("./getMigrations");
const readMigrationFiles_1 = require("./readMigrationFiles");
async function migrateDown() {
    const { payload } = this;
    const migrationFiles = await (0, readMigrationFiles_1.readMigrationFiles)({ payload });
    const { existingMigrations, latestBatch, } = await (0, getMigrations_1.getMigrations)({
        payload,
    });
    const migrationsToRollback = existingMigrations.filter((migration) => migration.batch === latestBatch);
    if (!(migrationsToRollback === null || migrationsToRollback === void 0 ? void 0 : migrationsToRollback.length)) {
        payload.logger.info({ msg: 'No migrations to rollback.' });
        return;
    }
    payload.logger.info({ msg: `Rolling back batch ${latestBatch} consisting of ${migrationsToRollback.length} migrations.` });
    for (const migration of migrationsToRollback) {
        const migrationFile = migrationFiles.find((m) => m.name === migration.name);
        if (!migrationFile) {
            throw new Error(`Migration ${migration.name} not found locally.`);
        }
        const start = Date.now();
        let transactionID;
        try {
            payload.logger.info({ msg: `Migrating: ${migrationFile.name}` });
            transactionID = await this.beginTransaction();
            await migrationFile.down({ payload });
            payload.logger.info({ msg: `Migrated:  ${migrationFile.name} (${Date.now() - start}ms)` });
            await payload.delete({
                collection: 'payload-migrations',
                id: migration.id,
                req: {
                    transactionID,
                },
            });
            await this.commitTransaction(transactionID);
        }
        catch (err) {
            await this.rollbackTransaction(transactionID);
            payload.logger.error({
                msg: `Error running migration ${migrationFile.name}`,
                err,
            });
            throw err;
        }
    }
}
exports.migrateDown = migrateDown;
//# sourceMappingURL=migrateDown.js.map