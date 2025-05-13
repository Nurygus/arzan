import bcrypt from "bcrypt";
import dotenv from "dotenv";
import pg from "@/config/db";

dotenv.config();

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;

export async function changePassword(userId: number, password: string) {
  const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);
  await pg.query("UPDATE tb_user_auth SET password = $1 WHERE id = $2", [
    hashPassword,
    userId,
  ]);
}
