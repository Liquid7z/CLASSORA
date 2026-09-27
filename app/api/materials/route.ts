import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { getMaterials, saveMaterials, type MaterialType } from "@/lib/academic";

export const runtime = "nodejs";

const allowed: MaterialType[] = ["notes", "exam_routine", "assignment", "practical"];
const folders: Record<MaterialType, string> = { notes: "notes", exam_routine: "exam-routine", assignment: "assignments", practical: "practical" };

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const title = String(form.get("title") || "").trim();
    const description = String(form.get("description") || "").trim();
    const type = String(form.get("type") || "notes") as MaterialType;
    const subjectId = String(form.get("subjectId") || "");
    const subject = String(form.get("subject") || "");
    const department = String(form.get("department") || "CSE");
    const semester = String(form.get("semester") || "3");
    const teacherId = String(form.get("teacherId") || "T001");
    const teacher = String(form.get("teacher") || "Dr. Sharma");
    const rawTargets = String(form.get("targets") || "[]");
    const targets = JSON.parse(rawTargets) as { department: string; semester: string; section: string }[];
    const file = form.get("file");

    if (!title || !subjectId || !subject || !allowed.includes(type) || !targets.length) {
      return NextResponse.json({ error: "Title, subject, type and at least one target section are required." }, { status: 400 });
    }
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "Please select a file." }, { status: 400 });
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const storedName = `${Date.now()}-${crypto.randomBytes(5).toString("hex")}-${safeName}`;
    const dir = path.join(process.cwd(), "public", "uploads", "academic", folders[type]);
    fs.mkdirSync(dir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(path.join(dir, storedName), buffer);

    const material = {
      id: crypto.randomUUID(), title, description, type, subjectId, subject, department, semester,
      teacherId, teacher, filePath: `/uploads/academic/${folders[type]}/${storedName}`,
      filename: file.name, size: file.size, createdAt: new Date().toISOString(), targets
    };
    saveMaterials([material, ...getMaterials()]);
    return NextResponse.json({ ok: true, material });
  } catch (error) {
    console.error("CLASSORA material upload failed", error);
    return NextResponse.json({ error: "Upload failed. Check the terminal for details." }, { status: 500 });
  }
}
