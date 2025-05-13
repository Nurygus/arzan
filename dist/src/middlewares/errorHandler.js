"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genericErrorHandler = exports.notFoundError = void 0;
const lib_1 = __importStar(require("http-status/lib"));
const error_1 = require("@/helpers/error");
const notFoundError = (req, res, _next) => {
    res.status(lib_1.NOT_FOUND).json({
        error: {
            code: lib_1.NOT_FOUND,
            message: lib_1.default[lib_1.NOT_FOUND],
            path: req.originalUrl,
        },
    });
};
exports.notFoundError = notFoundError;
const genericErrorHandler = (err, req, res, _next) => {
    let resCode = err.status || lib_1.INTERNAL_SERVER_ERROR;
    let resBody = err;
    if (err.code === "ETIMEDOUT") {
        resCode = lib_1.REQUEST_TIMEOUT;
        resBody = new error_1.TimeOutError(req.originalUrl);
    }
    res.status(resCode).json(resBody);
};
exports.genericErrorHandler = genericErrorHandler;
//# sourceMappingURL=errorHandler.js.map