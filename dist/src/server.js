"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = void 0;
const http_1 = require("http");
const helpers_1 = require("./helpers");
const config_1 = __importDefault(require("./config"));
const startServer = (app) => {
    const httpServer = (0, http_1.createServer)(app);
    process
        .on("SIGINT", () => (0, helpers_1.exitLog)(null, "SIGINT"))
        .on("SIGQUIT", () => (0, helpers_1.exitLog)(null, "SIGQUIT"))
        .on("SIGTERM", () => (0, helpers_1.exitLog)(null, "SIGTERM"))
        .on("uncaughtException", (err) => (0, helpers_1.exitLog)(err, "uncaughtException"))
        .on("beforeExit", () => (0, helpers_1.exitLog)(null, "beforeExit"))
        .on("exit", () => (0, helpers_1.exitLog)(null, "exit"));
    return httpServer.listen({ port: config_1.default.APP.PORT }, () => {
        process.stdout.write(`⚙️ Application Environment: ${config_1.default.APP.ENV}\n`);
        process.stdout.write(`⏱ Started on: ${Date.now()}\n`);
        process.stdout.write(`🚀 Server ready at http://localhost:${config_1.default.APP.PORT}\n`);
    });
};
exports.startServer = startServer;
//# sourceMappingURL=server.js.map