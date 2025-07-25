import dotenv from "dotenv";
import pkg from "../../package.json";

dotenv.config();

const CONFIG = {
  APP: {
    NAME: pkg.name,
    VERSION: pkg.version,
    VER: `v${pkg.version[0]}`,
    DESCRIPTION: pkg.description,
    AUTHORS: pkg.authors,
    HOST: process.env.APP_HOST,
    BASE_URL: process.env.API_BASE_URL,
    PORT: process.env.PORT || 8080,
    ENV: process.env.NODE_ENV,
  },
  SERVER: {
    TIMEOUT: 60000, // 1m
  },
  DATABASE: {
    NAME: process.env.DB_DATABASE,
    HOST: process.env.DB_HOST,
    PORT: process.env.DB_PORT,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
  },
  LOG: {
    PATH: process.env.LOGGING_DIR || "logs",
    LEVEL: process.env.LOGGING_LEVEL || "info",
    MAX_FILES: process.env.LOGGING_MAX_FILES || 5,
  },
  AUTH: {
    SALT_ROUNDS: process.env.SALT_ROUNDS || "11",
    ACCESS_TOKEN_EXPIRE: process.env.ACCESS_TOKEN_DURATION || "300000",
    REFRESH_TOKEN_EXPIRE: process.env.REFRESH_TOKEN_DURATION || "86400000",
    ACCESS_TOKEN_SALT: process.env.ACCESS_TOKEN_SALT,
    REFRESH_TOKEN_SALT: process.env.REFRESH_TOKEN_SALT,
  },
  EXTERNAL: {
    API_KEY: process.env.API_KEY,
  },
} as const;

export default CONFIG;
