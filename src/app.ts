import path from "path";
// import cors from "cors";
import express from "express";
// import helmet from "helmet";
import morgan from "morgan";
import fse from "fs-extra";
import timeout from "connect-timeout";
import dotenv from "dotenv";
import session from "express-session";
import { createClient } from "redis";
import RedisStore from "connect-redis";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import adminSwaggerDocument from "../bundle/admin-swagger.json";
import swaggerDocument from "../bundle/swagger.json";
import CONFIG from "./config";
import { expressPinoLogger } from "./helpers";
import { apiResponse } from "./helpers/apiResponse";
import * as errorHandler from "@/middlewares/errorHandler";
import { router, adminRouter } from "@/routes";

dotenv.config();

export const createApp = (): express.Application => {
  const app = express();

  const redisClient = createClient();

  redisClient.connect();

  redisClient.on("connect", () => {
    console.log("Redis client connected!");
  });

  redisClient.on("error", (err: any) => {
    console.log(err.message);
  });

  const redisStore = new RedisStore({
    client: redisClient,
    prefix: "arzan-api:",
  });

  app.set("trust proxy", 1);

  // app.use(cors());
  // app.use(helmet());
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    }),
  );

  if (CONFIG.APP.ENV !== "test") {
    app.use(morgan("dev"));
    app.use(expressPinoLogger());
  }

  app.use(timeout(CONFIG.SERVER.TIMEOUT));

  app.use("/video/:url", function (req, res) {
    try {
      const url = req.params.url;
      const range = req.headers.range;
      if (range === undefined) {
        res.status(400).send("Requires Range header");
      }
      let chunk = Number(`${process.env.CHUNK_SIZE}`);
      if (range === "") {
        chunk = 1;
      }
      const videoPath = path.join(__dirname, "..", "video", url);
      const videoSize = fse.statSync(videoPath).size;
      const CHUNK_SIZE = 1024 * chunk;
      const start = Number(range!.replace(/\D/g, ""));
      const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
      const contentLength = end - start + 1;
      const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
      };
      res.writeHead(206, headers);
      const videoStream = fse.createReadStream(videoPath, { start, end });
      videoStream.pipe(res);
    } catch (err: any) {
      res.status(err.status).json(
        apiResponse({
          status: false,
          message: err.message,
        }),
      );
    }
  });

  const options = {
    definition: {
      openapi: "3.0.1",
      info: {
        title: "REST API for Swagger Documentation",
        version: "1.0.0",
      },
      schemes: ["http", "https"],
      servers: [
        {
          url: `http://${process.env.APP_HOST || "localhost"}:${
            process.env.PORT || 8081
          }/`,
        },
      ],
    },
    apis: [`${__dirname}/docs/public/*.ts`],
  };

  const adminOptions = {
    definition: {
      openapi: "3.0.1",
      info: {
        title: "REST API for Swagger Documentation",
        version: "1.0.0",
      },
      schemes: ["http", "https"],
      servers: [
        {
          url: `http://${process.env.APP_HOST || "localhost"}:${
            process.env.PORT || 8081
          }/`,
        },
      ],
    },
    apis: [`${__dirname}/docs/admin/*.ts`],
  };

  const swaggerSpec = swaggerJSDoc(options);
  const adminSwaggerSpec = swaggerJSDoc(adminOptions);

  if (process.env.NODE_ENV === "production") {
    app.use(
      "/api-docs",
      swaggerUi.serveFiles(swaggerDocument),
      swaggerUi.setup(swaggerDocument),
    );
    app.use(
      "/admin/api-docs",
      swaggerUi.serveFiles(adminSwaggerDocument),
      swaggerUi.setup(adminSwaggerDocument),
    );
  } else {
    app.use(
      "/api-docs",
      swaggerUi.serveFiles(swaggerSpec),
      swaggerUi.setup(swaggerSpec),
    );
    app.use(
      "/admin/api-docs",
      swaggerUi.serveFiles(adminSwaggerSpec),
      swaggerUi.setup(adminSwaggerSpec),
    );
  }

  // Public API Routes
  app.use(
    `/api/${CONFIG.APP.VER}`,
    session({
      store: redisStore as any,
      secret: "secret$%^134",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        httpOnly: false,
      },
    }),
    router,
  );

  // Admin API Routes
  app.use("/admin", adminRouter);

  //Static Files
  app.use("/static", express.static(path.join(__dirname, "..", "static")));

  // Error Middleware
  app.use(errorHandler.genericErrorHandler);
  app.use(errorHandler.notFoundError);

  return app;
};
