import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import pg from "@/config/db";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";

export function generateAccessToken(
  id: number,
  subscription_type: { type: string; id: number },
) {
  const payload = {
    id,
    subscription_type,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export async function getUserRole(id: number) {
  const { rows: list } = await pg.query<{ type: string; id: number }>(
    `SELECT tb_subscription_type.type as type, tb_user_subscription_type.id as id
    FROM tb_user_subscription_type
    JOIN tb_subscription_type ON tb_subscription_type.id = tb_user_subscription_type.subscription_type_id
    WHERE user_auth_id = $1`,
    [id],
  );
  return list[0];
}

export async function checkUserPassword(id: number, password: string) {
  const { rows: list } = await pg.query<{ password: string }>(
    "SELECT password FROM tb_user_auth WHERE id = $1",
    [id],
  );
  const validPassword = await bcrypt.compare(password, list[0].password);
  return validPassword;
}
