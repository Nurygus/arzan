"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeOutError = exports.NotFoundException = exports.UnauthorizedError = exports.ForbiddenError = exports.ValidationError = exports.APIError = void 0;
const ApiError_1 = __importDefault(require("./ApiError"));
exports.APIError = ApiError_1.default;
const ValidationError_1 = __importDefault(require("./ValidationError"));
exports.ValidationError = ValidationError_1.default;
const ForbiddenError_1 = __importDefault(require("./ForbiddenError"));
exports.ForbiddenError = ForbiddenError_1.default;
const UnauthorizedError_1 = __importDefault(require("./UnauthorizedError"));
exports.UnauthorizedError = UnauthorizedError_1.default;
const NotFoundException_1 = __importDefault(require("./NotFoundException"));
exports.NotFoundException = NotFoundException_1.default;
const TimeOutError_1 = __importDefault(require("./TimeOutError"));
exports.TimeOutError = TimeOutError_1.default;
//# sourceMappingURL=index.js.map