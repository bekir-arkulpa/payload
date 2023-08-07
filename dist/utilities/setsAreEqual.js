"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setsAreEqual = void 0;
const setsAreEqual = (xs, ys) => xs.size === ys.size
    && [...xs].every((x) => ys.has(x));
exports.setsAreEqual = setsAreEqual;
//# sourceMappingURL=setsAreEqual.js.map