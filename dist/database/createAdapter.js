"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDatabaseAdapter = void 0;
const transaction_1 = require("./transaction");
const migrate_1 = require("./migrations/migrate");
const migrateStatus_1 = require("./migrations/migrateStatus");
const migrateDown_1 = require("./migrations/migrateDown");
const migrateRefresh_1 = require("./migrations/migrateRefresh");
const migrateReset_1 = require("./migrations/migrateReset");
const createMigration_1 = require("./migrations/createMigration");
function createDatabaseAdapter(args) {
    // Need to implement DB Webpack config extensions here
    if (args.webpack) {
        const existingWebpackConfig = args.payload.config.admin.webpack ? args.payload.config.admin.webpack : (webpackConfig) => webpackConfig;
        args.payload.config.admin.webpack = (webpackConfig) => {
            return args.webpack(existingWebpackConfig(webpackConfig));
        };
    }
    return {
        transaction: transaction_1.transaction,
        migrate: migrate_1.migrate,
        createMigration: createMigration_1.createMigration,
        migrateStatus: migrateStatus_1.migrateStatus,
        migrateDown: migrateDown_1.migrateDown,
        migrateRefresh: migrateRefresh_1.migrateRefresh,
        migrateReset: migrateReset_1.migrateReset,
        migrateFresh: async () => null,
        ...args,
    };
}
exports.createDatabaseAdapter = createDatabaseAdapter;
//# sourceMappingURL=createAdapter.js.map