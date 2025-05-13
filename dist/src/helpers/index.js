"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizer = exports.exitLog = exports.expressPinoLogger = void 0;
var loggers_1 = require("./loggers");
Object.defineProperty(exports, "expressPinoLogger", { enumerable: true, get: function () { return loggers_1.expressPinoLogger; } });
Object.defineProperty(exports, "exitLog", { enumerable: true, get: function () { return loggers_1.exitLog; } });
var dataSanitizers_1 = require("./dataSanitizers");
Object.defineProperty(exports, "sanitizer", { enumerable: true, get: function () { return dataSanitizers_1.sanitizer; } });
//# sourceMappingURL=index.js.map