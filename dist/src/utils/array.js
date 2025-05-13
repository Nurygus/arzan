"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.diff = void 0;
const lodash_es_1 = require("lodash-es");
const diff = (arr1, arr2) => {
    const added = (0, lodash_es_1.differenceWith)(arr2, arr1, lodash_es_1.isEqual);
    const removed = (0, lodash_es_1.differenceWith)(arr1, arr2, lodash_es_1.isEqual);
    return { added, removed };
};
exports.diff = diff;
//# sourceMappingURL=array.js.map