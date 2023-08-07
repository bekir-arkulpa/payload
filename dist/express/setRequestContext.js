"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRequestContext = void 0;
/**
 * This makes sure that req.context always exists (is {}) and populates it with an optional default context.
 * This function mutates directly to avoid copying memory. As payloadRequest is not a primitive, the scope of the mutation is not limited to this function but should also be reflected in the calling function.
 */
function setRequestContext(req = { context: null }, context = {}) {
    if (req.context) {
        if (Object.keys(req.context).length === 0 && req.context.constructor === Object) { // check if req.context is just {}
            req.context = context; // Faster - ... is bad for performance
        }
        else {
            req.context = { ...req.context, ...context }; // Merge together
        }
    }
    else {
        req.context = context;
    }
}
exports.setRequestContext = setRequestContext;
//# sourceMappingURL=setRequestContext.js.map