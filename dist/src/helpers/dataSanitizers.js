"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizer = void 0;
const express_validator_1 = require("express-validator");
const ValidationError_1 = __importDefault(require("./error/ValidationError"));
const catchValidatorError = (req, _, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const validationErrors = errors
            .array()
            .reduce((obj, error) => {
            obj[error.param] = error.msg;
            return obj;
        }, {});
        throw new ValidationError_1.default(validationErrors);
    }
    next();
};
const sanitizer = (validator) => [...validator, catchValidatorError];
exports.sanitizer = sanitizer;
//# sourceMappingURL=dataSanitizers.js.map