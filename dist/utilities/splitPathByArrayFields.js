"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitPathByArrayFields = void 0;
/**
  Turns: 'arrayField.0.group123field.arrayField.0.textField'

  Into: ['arrayField', '0', 'group123field.arrayField', '0', 'textField']
*/
function splitPathByArrayFields(str) {
    const regex = /\.(\d+)\./g;
    return str.split(regex).filter(Boolean);
}
exports.splitPathByArrayFields = splitPathByArrayFields;
//# sourceMappingURL=splitPathByArrayFields.js.map