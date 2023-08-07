"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateRefresh = void 0;
const readMigrationFiles_1 = require("./readMigrationFiles");
/**
 * Reset and re-run all migrations.
 */
async function migrateRefresh() {
    const { payload } = this;
    const migrationFiles = await (0, readMigrationFiles_1.readMigrationFiles)({ payload });
    // Clear all migrations
    await payload.delete({
        collection: 'payload-migrations',
        where: {}, // All migrations
    });
    let transactionID;
    // Run all migrations
    for (const migration of migrationFiles) {
        payload.logger.info({ msg: `Migrating: ${migration.name}` });
        try {
            const start = Date.now();
            transactionID = await this.beginTransaction();
            await migration.up({ payload });
            await payload.create({
                collection: 'payload-migrations',
                data: {
                    name: migration.name,
                    executed: true,
                },
                req: {
                    transactionID,
                },
            });
            await this.commitTransaction(transactionID);
            payload.logger.info({ msg: `Migrated:  ${migration.name} (${Date.now() - start}ms)` });
        }
        catch (err) {
            await this.rollbackTransaction(transactionID);
            payload.logger.error({
                msg: `Error running migration ${migration.name}`,
                err,
            });
            throw err;
        }
    }
}
exports.migrateRefresh = migrateRefresh;
//# sourceMappingURL=migrateRefresh.js.map