"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrate = void 0;
const getMigrations_1 = require("./getMigrations");
const readMigrationFiles_1 = require("./readMigrationFiles");
async function migrate() {
    const { payload } = this;
    const migrationFiles = await (0, readMigrationFiles_1.readMigrationFiles)({ payload });
    const { existingMigrations, latestBatch } = await (0, getMigrations_1.getMigrations)({ payload });
    const newBatch = latestBatch + 1;
    // Execute 'up' function for each migration sequentially
    for (const migration of migrationFiles) {
        const existingMigration = existingMigrations.find((existing) => existing.name === migration.name);
        // Run migration if not found in database
        if (existingMigration) {
            continue; // eslint-disable-line no-continue
        }
        const start = Date.now();
        let transactionID;
        try {
            payload.logger.info({ msg: `Migrating: ${migration.name}` });
            transactionID = await this.beginTransaction();
            await migration.up({ payload });
            payload.logger.info({ msg: `Migrated:  ${migration.name} (${Date.now() - start}ms)` });
            await payload.create({
                collection: 'payload-migrations',
                data: {
                    name: migration.name,
                    batch: newBatch,
                },
                req: {
                    transactionID,
                },
            });
            await this.commitTransaction(transactionID);
        }
        catch (err) {
            await this.rollbackTransaction(transactionID);
            payload.logger.error({ msg: `Error running migration ${migration.name}`, err });
            throw err;
        }
    }
}
exports.migrate = migrate;
//# sourceMappingURL=migrate.js.map