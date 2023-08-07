"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeConfig = void 0;
const deepmerge_1 = __importDefault(require("deepmerge"));
const is_plain_object_1 = require("is-plain-object");
const defaultUser_1 = require("../auth/defaultUser");
const sanitize_1 = __importDefault(require("../collections/config/sanitize"));
const errors_1 = require("../errors");
const sanitize_2 = __importDefault(require("../globals/config/sanitize"));
const checkDuplicateCollections_1 = __importDefault(require("../utilities/checkDuplicateCollections"));
const defaults_1 = require("./defaults");
const bundler_1 = __importDefault(require("../bundlers/webpack/bundler"));
const sanitizeAdmin = (config) => {
    const adminConfig = config.admin;
    // add default user collection if none provided
    if (!(adminConfig === null || adminConfig === void 0 ? void 0 : adminConfig.user)) {
        const firstCollectionWithAuth = config.collections.find(({ auth }) => Boolean(auth));
        if (firstCollectionWithAuth) {
            adminConfig.user = firstCollectionWithAuth.slug;
        }
        else {
            adminConfig.user = 'users';
            const sanitizedDefaultUser = (0, sanitize_1.default)(config, defaultUser_1.defaultUserCollection);
            config.collections.push(sanitizedDefaultUser);
        }
    }
    if (!config.collections.find(({ slug }) => slug === adminConfig.user)) {
        throw new errors_1.InvalidConfiguration(`${config.admin.user} is not a valid admin user collection`);
    }
    // add default bundler if none provided
    if (!adminConfig.bundler) {
        adminConfig.bundler = (0, bundler_1.default)();
    }
    return adminConfig;
};
const sanitizeConfig = (config) => {
    const sanitizedConfig = (0, deepmerge_1.default)(defaults_1.defaults, config, {
        isMergeableObject: is_plain_object_1.isPlainObject,
    });
    sanitizedConfig.admin = sanitizeAdmin(sanitizedConfig);
    sanitizedConfig.collections = sanitizedConfig.collections.map((collection) => (0, sanitize_1.default)(sanitizedConfig, collection));
    (0, checkDuplicateCollections_1.default)(sanitizedConfig.collections);
    if (sanitizedConfig.globals.length > 0) {
        sanitizedConfig.globals = (0, sanitize_2.default)(sanitizedConfig.collections, sanitizedConfig.globals);
    }
    if (typeof sanitizedConfig.serverURL === 'undefined') {
        sanitizedConfig.serverURL = '';
    }
    if (sanitizedConfig.serverURL !== '') {
        sanitizedConfig.csrf.push(sanitizedConfig.serverURL);
    }
    return sanitizedConfig;
};
exports.sanitizeConfig = sanitizeConfig;
//# sourceMappingURL=sanitize.js.map