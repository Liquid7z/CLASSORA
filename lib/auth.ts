import { cookies } from "next/headers";
import crypto from "crypto";
import { db } from "./db";

const COOKIE = "classora_session";

db.exec(`CREATE TABLE IF NOT EXISTS sessions(
 id TEXT PRIMARY KEY,
 user_id INTEGER NOT NULL,
 expires_at INTEGER NOT NULL
)`);

export function createSession(userId:number) {
  const id = crypto.randomBytes(32).toString("hex");
  db.prepare("INSERT INTO sessions(id,user_id,expires_at) VALUES(?,?,?)").run(id,userId,Date.now()+7*24*60*60*1000);
  return id;
}
export async function currentUser() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const row = db.prepare(`
    SELECT u.id,u.name,u.email,u.role,u.department,u.department_id,u.semester,u.section,u.active
    FROM sessions s JOIN users u ON u.id=s.user_id
    WHERE s.id=? AND s.expires_at>? AND u.active=1
  `).get(token,Date.now()) as any;
  if (!row) return null;
  return row;
}
export async function clearSession() {
  const c=await cookies(); const token=c.get(COOKIE)?.value;
  if(token) db.prepare("DELETE FROM sessions WHERE id=?").run(token);
}
export const sessionCookieName=COOKIE;
