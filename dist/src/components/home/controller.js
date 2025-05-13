"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeController = void 0;
const lib_1 = require("http-status/lib");
const services_1 = require("./services");
const apiResponse_1 = require("@/helpers/apiResponse");
class HomeController {
    static getAppInfo = async (req, res, next) => {
        try {
            const appInfoKey = req.query.key;
            const homeServices = new services_1.HomeServices();
            const result = await homeServices.getAppInfo(appInfoKey);
            res.status(lib_1.OK).json((0, apiResponse_1.apiResponse)(result));
        }
        catch (error) {
            next(error);
        }
    };
}
exports.HomeController = HomeController;
//# sourceMappingURL=controller.js.map