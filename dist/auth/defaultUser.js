"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultUserCollection = void 0;
const extractTranslations_1 = require("../translations/extractTranslations");
const labels = (0, extractTranslations_1.extractTranslations)(['general:user', 'general:users']);
exports.defaultUserCollection = {
    slug: 'users',
    labels: {
        singular: labels['general:user'],
        plural: labels['general:users'],
    },
    admin: {
        useAsTitle: 'email',
    },
    auth: {
        tokenExpiration: 7200,
    },
    fields: [],
};
//# sourceMappingURL=defaultUser.js.map