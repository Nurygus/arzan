"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compare = exports.hash = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("@/config"));
const hash = async (value) => {
    const saltRounds = parseInt(config_1.default.AUTH.SALT_ROUNDS, 10);
    return bcrypt_1.default.hash(value, saltRounds);
};
exports.hash = hash;
const compare = async (value, hashedValue) => {
    return bcrypt_1.default.compare(value, hashedValue);
};
exports.compare = compare;
//# sourceMappingURL=crypt.js.map