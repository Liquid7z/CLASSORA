import { cookies } from "next/headers";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { db } from "./db";

const COOKIE = "classora_session";
const runtimeFile = path.join(process.cwd(), "data", "runtime.json");

type User = {
  id: number; name: string; email: string; role: string; department?: string;
  department_id?: number; semester?: string | number; section?: string; active?: number;
  password_hash?: string;
};

function runtime(): any {
  try { return JSON.parse(fs.readFileSync(runtimeFile, "utf8")); }
  catch { return { users: [], sessions: [] }; }
}

export function createSession(userId: number) {
  const id = crypto.randomBytes(32).toString("hex");
  db.prepare("INSERT INTO sessions(id,user_id,expires_at) VALUES(?,?,?)").run(id, userId, Date.now() + 7 * 24 * 60 * 60 * 1000);
  return id;
}

export async function currentUser(): Promise<User | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const data = runtime();
  const session = (data.sessions || []).find((s: any) => s.id === token && Number(s.expires_at) > Date.now());
  if (!session) return null;
  const user = (data.users || []).find((u: User) => Number(u.id) === Number(session.user_id) && Number(u.active) === 1);
  return user || null;
}

export async function clearSession() {
  const c = await cookies();
  const token = c.get(COOKIE)?.value;
  if (token) db.prepare("DELETE FROM sessions WHERE id=?").run(token);
}

export const sessionCookieName = COOKIE;
