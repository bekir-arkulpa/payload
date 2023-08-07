"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocalizedPaths = void 0;
const types_1 = require("../fields/config/types");
const flattenTopLevelFields_1 = __importDefault(require("../utilities/flattenTopLevelFields"));
async function getLocalizedPaths({ payload, locale, collectionSlug, globalSlug, fields, incomingPath, overrideAccess = false, }) {
    const pathSegments = incomingPath.split('.');
    const localizationConfig = payload.config.localization;
    let paths = [
        {
            path: '',
            complete: false,
            field: undefined,
            fields: (0, flattenTopLevelFields_1.default)(fields, false),
            collectionSlug,
            globalSlug,
            invalid: false,
        },
    ];
    for (let i = 0; i < pathSegments.length; i += 1) {
        const segment = pathSegments[i];
        const lastIncompletePath = paths.find(({ complete }) => !complete);
        if (lastIncompletePath) {
            const { path } = lastIncompletePath;
            let currentPath = path ? `${path}.${segment}` : segment;
            const matchedField = lastIncompletePath.fields.find((field) => (0, types_1.fieldAffectsData)(field) && field.name === segment);
            lastIncompletePath.field = matchedField;
            if (currentPath === 'globalType' && globalSlug) {
                lastIncompletePath.path = currentPath;
                lastIncompletePath.complete = true;
                lastIncompletePath.field = {
                    name: 'globalType',
                    type: 'text',
                };
                return paths;
            }
            if (matchedField) {
                if ('hidden' in matchedField && matchedField.hidden && !overrideAccess) {
                    lastIncompletePath.invalid = true;
                }
                const nextSegment = pathSegments[i + 1];
                const nextSegmentIsLocale = localizationConfig && localizationConfig.locales.includes(nextSegment);
                if (nextSegmentIsLocale) {
                    // Skip the next iteration, because it's a locale
                    i += 1;
                    currentPath = `${currentPath}.${nextSegment}`;
                }
                else if (localizationConfig && 'localized' in matchedField && matchedField.localized) {
                    currentPath = `${currentPath}.${locale}`;
                }
                switch (matchedField.type) {
                    case 'blocks':
                    case 'richText':
                    case 'json': {
                        const upcomingSegments = pathSegments.slice(i + 1).join('.');
                        lastIncompletePath.complete = true;
                        lastIncompletePath.path = upcomingSegments ? `${currentPath}.${upcomingSegments}` : currentPath;
                        return paths;
                    }
                    case 'relationship':
                    case 'upload': {
                        // If this is a polymorphic relation,
                        // We only support querying directly (no nested querying)
                        if (typeof matchedField.relationTo !== 'string') {
                            const lastSegmentIsValid = ['value', 'relationTo'].includes(pathSegments[pathSegments.length - 1]);
                            if (lastSegmentIsValid) {
                                lastIncompletePath.complete = true;
                                lastIncompletePath.path = pathSegments.join('.');
                            }
                            else {
                                lastIncompletePath.invalid = true;
                                return paths;
                            }
                        }
                        else {
                            lastIncompletePath.complete = true;
                            lastIncompletePath.path = currentPath;
                            const nestedPathToQuery = pathSegments.slice(nextSegmentIsLocale ? i + 2 : i + 1).join('.');
                            if (nestedPathToQuery) {
                                const relatedCollection = payload.collections[matchedField.relationTo].config;
                                // eslint-disable-next-line no-await-in-loop
                                const remainingPaths = await getLocalizedPaths({
                                    payload,
                                    locale,
                                    globalSlug,
                                    collectionSlug: relatedCollection.slug,
                                    fields: relatedCollection.fields,
                                    incomingPath: nestedPathToQuery,
                                });
                                paths = [
                                    ...paths,
                                    ...remainingPaths,
                                ];
                            }
                            return paths;
                        }
                        break;
                    }
                    default: {
                        if ('fields' in lastIncompletePath.field) {
                            lastIncompletePath.fields = (0, flattenTopLevelFields_1.default)(lastIncompletePath.field.fields, false);
                        }
                        if (i + 1 === pathSegments.length)
                            lastIncompletePath.complete = true;
                        lastIncompletePath.path = currentPath;
                    }
                }
            }
            else {
                lastIncompletePath.invalid = true;
                lastIncompletePath.path = currentPath;
                return paths;
            }
        }
    }
    return paths;
}
exports.getLocalizedPaths = getLocalizedPaths;
//# sourceMappingURL=getLocalizedPaths.js.map