"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.difference = exports.withOnlyAttrs = exports.withoutAttrs = void 0;
const lodash_es_1 = require("lodash-es");
const withoutAttrs = (obj, attrsToExclude) => {
    const result = {};
    Object.keys(obj).forEach((key) => {
        if (!attrsToExclude.includes(key)) {
            result[key] = obj[key];
        }
    });
    return result;
};
exports.withoutAttrs = withoutAttrs;
const withOnlyAttrs = (obj, attrs) => {
    const result = {};
    Object.keys(obj).forEach((key) => {
        if (attrs.includes(key)) {
            result[key] = obj[key];
        }
    });
    return result;
};
exports.withOnlyAttrs = withOnlyAttrs;
const difference = (list1, list2, key = "id") => {
    return {
        create: list2
            .filter((obj) => obj.hasOwnProperty(key) && obj[key] === null)
            .map((obj) => (0, exports.withoutAttrs)(obj, [key])),
        update: (0, lodash_es_1.intersectionBy)(list2, list1, key),
        destroy: (0, lodash_es_1.differenceBy)(list1, list2, key).map((obj) => obj[key]),
    };
};
exports.difference = difference;
//# sourceMappingURL=object.js.map