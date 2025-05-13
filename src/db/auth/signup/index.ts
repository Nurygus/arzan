import bcrypt from "bcrypt";
import dotenv from "dotenv";
import pg from "@/config/db";
import { AuthSignUpRequest } from "@/types/request/auth";

dotenv.config();

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;

export async function insertAuthUser(body: AuthSignUpRequest) {
  const { name, password } = body;
  const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const { rows: list } = await pg.query<{ id: number }>(
    "INSERT INTO tb_user_auth (name, password, verify) VALUES ($1, $2, $3) RETURNING id",
    [name, hashPassword, false],
  );
  await pg.query(
    "INSERT INTO tb_user_coin_balance (user_auth_id) VALUES ($1)",
    [list[0].id],
  );
  return list[0].id;
}

export async function insertPhone({
  user_id,
  phone,
}: {
  user_id: number;
  phone: string;
}): Promise<void> {
  await pg.query("INSERT INTO tb_phone (user_auth_id, phone) VALUES ($1, $2)", [
    user_id,
    phone,
  ]);
}

export async function isPhoneExists(phone: string): Promise<boolean> {
  const { rows: list } = await pg.query(
    "SELECT id FROM tb_phone WHERE phone = $1",
    [phone],
  );

  return list.length > 0;
}

export async function getUserIdByPhone(phone: string) {
  const { rows: list } = await pg.query<{ user_auth_id: number }>(
    "SELECT user_auth_id FROM tb_phone where phone = $1",
    [phone],
  );
  return list[0].user_auth_id;
}

export async function deleteUser(id: number): Promise<void> {
  await pg.query("DELETE FROM tb_phone WHERE user_auth_id = $1", [id]);
  await pg.query("DELETE FROM tb_user_auth WHERE id = $1", [id]);
}

export async function isUnverifiedUser(userId: number) {
  const { rows: list } = await pg.query(
    "SELECT * FROM tb_user_auth where id = $1 AND verify = $2",
    [userId, false],
  );
  return list.length > 0;
}

export async function isUserWithUsernameExists(username: string) {
  const { rows: list } = await pg.query(
    "SELECT * FROM tb_user_auth where name = $1",
    [username],
  );
  return list.length > 0;
}
