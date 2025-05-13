"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emptyToNull = void 0;
const emptyToNull = (obj) => {
    if (isScalarType(obj)) {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(exports.emptyToNull);
    }
    const result = {};
    for (const key of Object.keys(obj)) {
        const value = obj[key];
        if (typeof value === "object") {
            result[key] = (0, exports.emptyToNull)(value);
        }
        else {
            result[key] = nullIfEmpty(value);
        }
    }
    return result;
};
exports.emptyToNull = emptyToNull;
const isScalarType = (obj) => {
    return (typeof obj !== "object" ||
        obj instanceof String ||
        obj instanceof Number ||
        obj instanceof Boolean ||
        obj === null);
};
const nullIfEmpty = (value) => {
    if (typeof value !== "string") {
        return value;
    }
    return value.trim() === "" ? null : value;
};
//# sourceMappingURL=filter.js.map