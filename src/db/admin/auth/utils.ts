import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import pg from "@/config/db";
import { AdminAuthLoginRequest } from "@/types/request/admin/auth";
import type { AdminAuthData } from "@/types/admin/auth";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";

export async function getAdminDataByEmail(email: string) {
  const { rows: list } = await pg.query<AdminAuthData>(
    "SELECT * FROM tb_admin_auth where email = $1",
    [email],
  );

  return list.length > 0 ? list[0] : null;
}

export async function checkAdminPassword(body: AdminAuthLoginRequest) {
  const { email, password } = body;
  const adminData = await getAdminDataByEmail(email);

  if (!adminData) {
    return null;
  }
  const isValidPassword = await bcrypt.compare(password, adminData.password);
  if (!isValidPassword) {
    return null;
  }
  return adminData;
}

export function generateAccessToken(id: number) {
  const payload = {
    id,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}
