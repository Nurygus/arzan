"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exitLog = exports.expressPinoLogger = void 0;
const lib_1 = __importDefault(require("http-status/lib"));
const express_pino_logger_1 = __importDefault(require("express-pino-logger"));
const auth_1 = require("@/utils/auth");
const { OK, BAD_REQUEST, SERVER_ERROR } = lib_1.default;
const expressPinoLogger = () => (0, express_pino_logger_1.default)({
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
            translateTime: true,
        },
    },
    customLogLevel(res, err) {
        const status = res.statusCode;
        if (status >= 400 && status < 500) {
            return "warn";
        }
        if (status >= 500 || err) {
            return "error";
        }
        return "silent";
    },
    customErrorMessage: (err) => `${err.name} : ${err.message}`,
    customSuccessMessage(res) {
        const status = res.statusCode;
        if (status >= 400 && status < 500) {
            return `${status || BAD_REQUEST} : ${lib_1.default[status || 400]}`;
        }
        if (status >= 500) {
            return `${status || SERVER_ERROR} : ${lib_1.default[status || 500]}`;
        }
        return `${OK} : ${lib_1.default[200].toUpperCase()}`;
    },
    serializers: {
        req: (req) => {
            const { method, url, headers: { host }, } = req;
            return {
                origin: host,
                method,
                url,
                query: req.query,
                params: req.params,
                body: (0, auth_1.hidePassword)({ ...req.raw.body }),
            };
        },
        res: (res) => {
            return {
                status: res.statusCode,
            };
        },
        err: (err) => `${err.type} : ${err.message}`,
    },
});
exports.expressPinoLogger = expressPinoLogger;
const exitLog = (err, evt) => {
    if (err) {
        process.stdout.write(`\n\n[!ERROR][${evt}] => ${err}\n\n`);
    }
    else {
        process.stdout.write(`\n\n![${evt}] EVENT CAUSE EXIT\n\n`);
    }
    process.exit(err ? 1 : 0);
};
exports.exitLog = exitLog;
//# sourceMappingURL=loggers.js.map