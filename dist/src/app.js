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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const connect_timeout_1 = __importDefault(require("connect-timeout"));
const config_1 = __importDefault(require("./config"));
const helpers_1 = require("./helpers");
const errorHandler = __importStar(require("@/middlewares/errorHandler"));
const routes_1 = __importDefault(require("@/routes"));
const createApp = () => {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use((0, helmet_1.default)());
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({
        extended: true,
    }));
    if (config_1.default.APP.ENV !== "test") {
        app.use((0, morgan_1.default)("dev"));
        app.use((0, helpers_1.expressPinoLogger)());
    }
    app.use((0, connect_timeout_1.default)(config_1.default.SERVER.TIMEOUT));
    app.use(`/api/${config_1.default.APP.VER}`, routes_1.default);
    app.use("/static", express_1.default.static(path_1.default.join(__dirname, "..", "static")));
    app.use(errorHandler.genericErrorHandler);
    app.use(errorHandler.notFoundError);
    return app;
};
exports.createApp = createApp;
//# sourceMappingURL=app.js.map