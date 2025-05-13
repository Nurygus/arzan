import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pg = new Pool({
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

export default pg;
