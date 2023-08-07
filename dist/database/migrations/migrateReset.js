"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateReset = void 0;
const getMigrations_1 = require("./getMigrations");
const readMigrationFiles_1 = require("./readMigrationFiles");
async function migrateReset() {
    const { payload } = this;
    const migrationFiles = await (0, readMigrationFiles_1.readMigrationFiles)({ payload });
    const { existingMigrations } = await (0, getMigrations_1.getMigrations)({ payload });
    if (!(existingMigrations === null || existingMigrations === void 0 ? void 0 : existingMigrations.length)) {
        payload.logger.info({ msg: 'No migrations to reset.' });
        return;
    }
    let transactionID;
    // Rollback all migrations in order
    for (const migration of migrationFiles) {
        // Create or update migration in database
        const existingMigration = existingMigrations.find((existing) => existing.name === migration.name);
        if (existingMigration) {
            payload.logger.info({ msg: `Migrating: ${migration.name}` });
            try {
                const start = Date.now();
                transactionID = await this.beginTransaction();
                await migration.down({ payload });
                await payload.delete({
                    collection: 'payload-migrations',
                    where: {
                        id: {
                            equals: existingMigration.id,
                        },
                    },
                    req: { transactionID },
                });
                await this.commitTransaction(transactionID);
                payload.logger.info({ msg: `Migrated:  ${migration.name} (${Date.now() - start}ms)` });
            }
            catch (err) {
                await this.rollbackTransaction(transactionID);
                payload.logger.error({ msg: `Error running migration ${migration.name}`, err });
                throw err;
            }
        }
    }
}
exports.migrateReset = migrateReset;
//# sourceMappingURL=migrateReset.js.map