"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeServices = void 0;
const home_1 = require("@/db/home");
class HomeServices {
    homeDAO;
    constructor() {
        this.homeDAO = new home_1.HomeDAO();
    }
    getAppInfo = async (appInfoKey) => {
        const result = await this.homeDAO.get(appInfoKey);
        return result;
    };
}
exports.HomeServices = HomeServices;
//# sourceMappingURL=services.js.map