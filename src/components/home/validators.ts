import { query, body } from "express-validator";
import CONFIG from "@/config";

const appKeys = Object.keys(CONFIG.APP).map((key) => key.toLocaleLowerCase());

body("phone").matches(/^[+][9]{2}[3][6][1-5][0-9]{6}$/);

export const appKeyValidator = [
  query("key")
    .optional()
    .isString()
    .isIn(appKeys)
    .withMessage("`name` should be string type"),
];
