"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFieldsToSign = void 0;
const types_1 = require("../../fields/config/types");
const getFieldsToSign = (args) => {
    const { collectionConfig, user, email, } = args;
    return collectionConfig.fields.reduce((signedFields, field) => {
        const result = {
            ...signedFields,
        };
        // get subfields from non-named fields like rows
        if (!(0, types_1.fieldAffectsData)(field) && (0, types_1.fieldHasSubFields)(field)) {
            field.fields.forEach((subField) => {
                if ((0, types_1.fieldAffectsData)(subField) && subField.saveToJWT) {
                    result[typeof subField.saveToJWT === 'string' ? subField.saveToJWT : subField.name] = user[subField.name];
                }
            });
        }
        if ((0, types_1.fieldAffectsData)(field) && field.saveToJWT) {
            result[typeof field.saveToJWT === 'string' ? field.saveToJWT : field.name] = user[field.name];
        }
        return result;
    }, {
        email,
        id: user.id,
        collection: collectionConfig.slug,
    });
};
exports.getFieldsToSign = getFieldsToSign;
//# sourceMappingURL=getFieldsToSign.js.map