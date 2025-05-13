"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeDAO = void 0;
const config_1 = __importDefault(require("@/config"));
class HomeDAO {
    get = (key) => {
        if (!key) {
            return Promise.resolve(config_1.default.APP);
        }
        const upperKey = key.toUpperCase();
        return Promise.resolve({ [upperKey]: config_1.default.APP[upperKey] });
    };
}
exports.HomeDAO = HomeDAO;
//# sourceMappingURL=home.js.map