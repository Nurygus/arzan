"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hidePassword = void 0;
const hidePassword = (bodyData) => {
    if (bodyData.hasOwnProperty("password")) {
        bodyData.password = "********";
    }
    return bodyData;
};
exports.hidePassword = hidePassword;
//# sourceMappingURL=auth.js.map