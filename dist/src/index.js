"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias").addAlias("@", __dirname);
const app_1 = require("./app");
const server_1 = require("./server");
if (process.env.NODE_ENV !== "test") {
    const app = (0, app_1.createApp)();
    (0, server_1.startServer)(app);
}
//# sourceMappingURL=index.js.map