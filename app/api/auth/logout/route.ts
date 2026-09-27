export const runtime = "nodejs";
import { NextResponse } from "next/server"; import { clearSession, sessionCookieName } from "@/lib/auth";
export async function POST(req:Request){await clearSession();const r=NextResponse.redirect(new URL("/login",req.url));r.cookies.delete(sessionCookieName);return r}
