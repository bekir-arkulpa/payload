"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSearchParam = void 0;
const types_1 = require("../../fields/config/types");
const getEntityPolicies_1 = require("../../utilities/getEntityPolicies");
const validateQueryPaths_1 = require("./validateQueryPaths");
const getLocalizedPaths_1 = require("../getLocalizedPaths");
/**
 * Validate the Payload key / value / operator
 */
async function validateSearchParam({ fields, path: incomingPath, versionFields, val, operator, collectionConfig, globalConfig, errors, req, policies, overrideAccess, }) {
    // Replace GraphQL nested field double underscore formatting
    let sanitizedPath;
    if (incomingPath === '_id') {
        sanitizedPath = 'id';
    }
    else {
        sanitizedPath = incomingPath.replace(/__/gi, '.');
    }
    let paths = [];
    const { slug } = (collectionConfig || globalConfig);
    if (globalConfig && !policies.globals[slug]) {
        // eslint-disable-next-line no-param-reassign
        globalConfig.fields = fields;
        // eslint-disable-next-line no-param-reassign
        policies.globals[slug] = await (0, getEntityPolicies_1.getEntityPolicies)({
            req,
            entity: globalConfig,
            operations: ['read'],
            type: 'global',
        });
    }
    if (sanitizedPath !== 'id') {
        paths = await (0, getLocalizedPaths_1.getLocalizedPaths)({
            payload: req.payload,
            locale: req.locale,
            collectionSlug: collectionConfig === null || collectionConfig === void 0 ? void 0 : collectionConfig.slug,
            globalSlug: globalConfig === null || globalConfig === void 0 ? void 0 : globalConfig.slug,
            fields,
            incomingPath: sanitizedPath,
            overrideAccess,
        });
    }
    const promises = [];
    promises.push(...paths.map(async ({ path, field, invalid, collectionSlug }, i) => {
        var _a;
        if (invalid) {
            errors.push({ path });
            return;
        }
        if (!overrideAccess && (0, types_1.fieldAffectsData)(field)) {
            if (collectionSlug) {
                if (!policies.collections[collectionSlug]) {
                    // eslint-disable-next-line no-param-reassign
                    policies.collections[collectionSlug] = await (0, getEntityPolicies_1.getEntityPolicies)({
                        req,
                        entity: req.payload.collections[collectionSlug].config,
                        operations: ['read'],
                        type: 'collection',
                    });
                }
                if (['salt', 'hash'].includes(incomingPath) && collectionConfig.auth && !((_a = collectionConfig.auth) === null || _a === void 0 ? void 0 : _a.disableLocalStrategy)) {
                    errors.push({ path: incomingPath });
                }
            }
            let fieldAccess;
            let fieldPath = path;
            // remove locale from end of path
            if (path.endsWith(req.locale)) {
                fieldPath = path.slice(0, -(req.locale.length + 1));
            }
            // remove ".value" from ends of polymorphic relationship paths
            if (field.type === 'relationship' && Array.isArray(field.relationTo)) {
                fieldPath = fieldPath.replace('.value', '');
            }
            const entityType = globalConfig ? 'globals' : 'collections';
            const entitySlug = collectionSlug || globalConfig.slug;
            const segments = fieldPath.split('.');
            if (versionFields) {
                if (fieldPath === 'parent' || fieldPath === 'version') {
                    fieldAccess = policies[entityType][entitySlug].read.permission;
                }
                else if (segments[0] === 'parent' || segments[0] === 'version') {
                    fieldAccess = policies[entityType][entitySlug].read.permission;
                    segments.shift();
                }
            }
            else {
                fieldAccess = policies[entityType][entitySlug].fields;
                segments.forEach((segment, pathIndex) => {
                    if (pathIndex === segments.length - 1) {
                        fieldAccess = fieldAccess[segment];
                    }
                    else {
                        fieldAccess = fieldAccess[segment].fields;
                    }
                });
                fieldAccess = fieldAccess.read.permission;
            }
            if (!fieldAccess) {
                errors.push({ path: fieldPath });
            }
        }
        if (i > 1) {
            // Remove top collection and reverse array
            // to work backwards from top
            const pathsToQuery = paths.slice(1)
                .reverse();
            pathsToQuery.forEach(({ path: subPath, collectionSlug: pathCollectionSlug, }, pathToQueryIndex) => {
                // On the "deepest" collection,
                // validate query of the relationship
                if (pathToQueryIndex === 0) {
                    promises.push((0, validateQueryPaths_1.validateQueryPaths)({
                        collectionConfig: req.payload.collections[pathCollectionSlug].config,
                        globalConfig: undefined,
                        where: {
                            [subPath]: {
                                [operator]: val,
                            },
                        },
                        errors,
                        policies,
                        req,
                        overrideAccess,
                    }));
                }
            });
        }
    }));
    await Promise.all(promises);
}
exports.validateSearchParam = validateSearchParam;
//# sourceMappingURL=validateSearchParams.js.map