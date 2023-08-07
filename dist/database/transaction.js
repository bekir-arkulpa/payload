"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transaction = void 0;
const transaction = async function transaction(callback, options) {
    const id = await this.beginTransaction(options);
    try {
        await callback();
        await this.commitTransaction(id);
    }
    catch (err) {
        await this.rollbackTransaction(id);
    }
};
exports.transaction = transaction;
//# sourceMappingURL=transaction.js.map