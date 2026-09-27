import fs from "node:fs";
import path from "node:path";
import { materials as seedMaterials, subjects } from "./data";

export type MaterialType = "notes" | "exam_routine" | "assignment" | "practical";
export type MaterialTarget = { department: string; semester: string; section: string };
export type AcademicMaterial = {
  id: string;
  title: string;
  description: string;
  type: MaterialType;
  subjectId: string;
  subject: string;
  department: string;
  semester: string;
  teacherId: string;
  teacher: string;
  filePath: string;
  filename: string;
  size: number;
  createdAt: string;
  targets: MaterialTarget[];
};

const storePath = path.join(process.cwd(), "data", "materials.json");
const typeMap: Record<string, MaterialType> = { notes: "notes", exam: "exam_routine", assignment: "assignment", practical: "practical" };
const typeLabel: Record<MaterialType, string> = { notes: "Notes", exam_routine: "Exam Routine", assignment: "Assignment", practical: "Practical" };

function seed(): AcademicMaterial[] {
  return seedMaterials.map((m, index) => {
    const subject = subjects.find(s => s.name === m.subject);
    return {
      id: `seed-${m.id}`,
      title: m.title,
      description: "Academic material distributed through CLASSORA.",
      type: typeMap[m.type] || "notes",
      subjectId: subject?.id || "CSE301",
      subject: m.subject,
      department: "CSE",
      semester: "3",
      teacherId: `T00${Math.min(index + 1, 5)}`,
      teacher: m.teacher,
      filePath: "",
      filename: `${m.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.pdf`,
      size: 0,
      createdAt: new Date(Date.now() - index * 86400000).toISOString(),
      targets: [{ department: "CSE", semester: "3", section: "E" }],
    };
  });
}

function ensureStore() {
  fs.mkdirSync(path.dirname(storePath), { recursive: true });
  if (!fs.existsSync(storePath)) fs.writeFileSync(storePath, JSON.stringify(seed(), null, 2));
}

export function getMaterials(): AcademicMaterial[] {
  ensureStore();
  try { return JSON.parse(fs.readFileSync(storePath, "utf8")) as AcademicMaterial[]; }
  catch { const rows = seed(); fs.writeFileSync(storePath, JSON.stringify(rows, null, 2)); return rows; }
}

export function saveMaterials(rows: AcademicMaterial[]) {
  ensureStore();
  fs.writeFileSync(storePath, JSON.stringify(rows, null, 2));
}

export function typeName(type: MaterialType) { return typeLabel[type]; }
export function slugType(type: MaterialType) { return type === "exam_routine" ? "exam-routine" : type === "assignment" ? "assignments" : type; }

export function getStudentMaterials(department = "CSE", semester = "3", section = "E") {
  return getMaterials().filter(m => m.targets.some(t => t.department === department && t.semester === semester && t.section === section));
}

export function getSubjectMaterials(subjectId: string, department = "CSE", semester = "3", section = "E") {
  return getStudentMaterials(department, semester, section).filter(m => m.subjectId === subjectId);
}

export function countsForSubject(subjectId: string, department = "CSE", semester = "3", section = "E") {
  const rows = getSubjectMaterials(subjectId, department, semester, section);
  return {
    notes: rows.filter(m => m.type === "notes").length,
    exam_routine: rows.filter(m => m.type === "exam_routine").length,
    assignment: rows.filter(m => m.type === "assignment").length,
    practical: rows.filter(m => m.type === "practical").length,
  };
}

export function formatSize(bytes: number) {
  if (!bytes) return "Demo file";
  const units = ["B", "KB", "MB", "GB"];
  let n = bytes, i = 0;
  while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
  return `${n.toFixed(n >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}
