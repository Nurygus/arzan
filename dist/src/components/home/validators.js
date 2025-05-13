"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appKeyValidator = void 0;
const express_validator_1 = require("express-validator");
const config_1 = __importDefault(require("@/config"));
const appKeys = Object.keys(config_1.default.APP).map((key) => key.toLocaleLowerCase());
exports.appKeyValidator = [
    (0, express_validator_1.query)("key")
        .optional()
        .isString()
        .isIn(appKeys)
        .withMessage("`name` should be string type"),
];
//# sourceMappingURL=validators.js.map