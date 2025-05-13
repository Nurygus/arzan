"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("http-status/lib");
class ForbiddenError {
    status;
    message;
    constructor(message) {
        Object.setPrototypeOf(this, new.target.prototype);
        this.status = lib_1.FORBIDDEN;
        this.message = message;
    }
}
exports.default = ForbiddenError;
//# sourceMappingURL=ForbiddenError.js.map