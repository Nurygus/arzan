"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const home_1 = require("@/components/home");
const helpers_1 = require("@/helpers");
const router = (0, express_1.Router)();
router.get("/", (0, helpers_1.sanitizer)(home_1.appKeyValidator), home_1.HomeController.getAppInfo);
exports.default = router;
//# sourceMappingURL=index.js.map