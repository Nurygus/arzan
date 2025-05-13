"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFullUrl = void 0;
const url_1 = __importDefault(require("url"));
const getFullUrl = (req) => {
    return url_1.default.format({
        protocol: req.protocol,
        host: req.get("host"),
        pathname: req.baseUrl + req.path,
    });
};
exports.getFullUrl = getFullUrl;
//# sourceMappingURL=url.js.map