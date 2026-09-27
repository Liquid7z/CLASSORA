/**
 * CLASSORA demo data layer.
 *
 * This is intentionally JSON-backed. It keeps the old small prepare()/all()/get()/run()
 * interface used by a few demo routes while avoiding native SQLite dependencies.
 */
import fs from "node:fs";
import path from "node:path";
import { assignments, events, materials, notices, students, subjects, teachers } from "./data";

type Row = Record<string, any>;
const store = path.join(process.cwd(), "data", "runtime.json");

function readStore(): any {
  fs.mkdirSync(path.dirname(store), { recursive: true });
  if (!fs.existsSync(store)) {
    fs.writeFileSync(store, JSON.stringify({
      users: [
        { id: 1, name: "Liquid", email: "student@college.edu", role: "student", department: "CSE", department_id: 1, semester: "3", section: "E", active: 1, password_hash: "$2b$10$hxgGJIo62xNUfUgFMZHuG.KFr/P3aKhctT9PJ04IwL.q.jeVIHiaW" },
        { id: 2, name: "Dr. Sharma", email: "sharma@college.edu", role: "teacher", department: "CSE", department_id: 1, semester: "3", section: "E", active: 1, password_hash: "$2b$10$hxgGJIo62xNUfUgFMZHuG.KFr/P3aKhctT9PJ04IwL.q.jeVIHiaW" },
        { id: 3, name: "Administrator", email: "admin@college.edu", role: "admin", department: "CSE", department_id: 1, semester: "3", section: "E", active: 1, password_hash: "$2b$10$hxgGJIo62xNUfUgFMZHuG.KFr/P3aKhctT9PJ04IwL.q.jeVIHiaW" }
      ],
      sessions: [],
      announcements: notices.map((n, i) => ({ id: i + 1, title: n.title, message: n.text, priority: n.priority.toLowerCase(), target_type: "all", target_value: "", target_department: null, target_semester: null, target_section: null, author_id: 3, by: n.by, time: n.time, category: n.category })),
      departments: [{ id: 1, name: "Computer Science and Engineering", code: "CSE" }, { id: 2, name: "Electronics and Communication Engineering", code: "ECE" }],
      courses: [{ id: 1, name: "B.Tech Computer Science and Engineering", code: "CSE", department_id: 1 }, { id: 2, name: "B.Tech Electronics and Communication Engineering", code: "ECE", department_id: 2 }]
    }, null, 2));
  }
  try { return JSON.parse(fs.readFileSync(store, "utf8")); } catch { return { users: [], sessions: [], announcements: [], departments: [], courses: [] }; }
}
function writeStore(data: any) { fs.writeFileSync(store, JSON.stringify(data, null, 2)); }

function materialRows(): Row[] {
  return materials.map((m) => ({ ...m, subject_id: subjects.find(s => s.name === m.subject)?.id ?? "CSE301", subject_id_text: subjects.find(s => s.name === m.subject)?.id ?? "CSE301", stored_name: "", filename: `${m.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.pdf`, department: "CSE", semester: "3", section: "E" }));
}
function subjectRows(): Row[] { return subjects.map((s) => ({ ...s, code: s.id, department: "CSE", semester: "3", section: s.section })); }
function userRows(): Row[] {
  const d = readStore();
  const seeded = students.map((s, i) => ({ id: 100 + i, name: s.name, email: s.email, role: "student", department: s.dept, department_id: 1, semester: s.sem, section: s.section, active: s.status === "Active" ? 1 : 0, password_hash: "" }));
  const ts = teachers.map((t, i) => ({ id: 200 + i, name: t.name, email: t.email, role: "teacher", department: t.dept, department_id: 1, semester: "3", section: "E", active: t.status === "Active" ? 1 : 0, password_hash: "" }));
  const byEmail = new Map<string, Row>();
  [...seeded, ...ts, ...(d.users || [])].forEach(u => byEmail.set(String(u.email).toLowerCase(), u));
  return [...byEmail.values()];
}

function rowsFor(sql: string): Row[] {
  const q = sql.replace(/\s+/g, " ").toLowerCase();
  if (q.includes("from sessions")) return readStore().sessions || [];
  if (q.includes("from users")) return userRows();
  if (q.includes("from announcements")) return readStore().announcements || [];
  if (q.includes("from departments")) return readStore().departments || [];
  if (q.includes("from courses")) return (readStore().courses || []).map((c: Row) => ({ ...c, department_code: readStore().departments?.find((d: Row) => d.id === c.department_id)?.code }));
  if (q.includes("from notes")) return materialRows().filter(m => m.type === "notes");
  if (q.includes("from material_targets")) return [];
  if (q.includes("from materials")) return materialRows();
  if (q.includes("from subjects")) return subjectRows();
  if (q.includes("from students")) return userRows().filter(u => u.role === "student");
  if (q.includes("from teachers")) return userRows().filter(u => u.role === "teacher");
  if (q.includes("from events")) return events as Row[];
  if (q.includes("from assignments")) return assignments as Row[];
  return [];
}

function filterRows(rows: Row[], sql: string, params: unknown[]): Row[] {
  const q = sql.replace(/\s+/g, " ").toLowerCase();
  let out = [...rows];
  if (q.includes("lower(email)=lower(?)") || q.includes("email = ?")) out = out.filter(r => String(r.email).toLowerCase() === String(params[0] ?? "").toLowerCase());
  else if (q.includes("where id=?") || q.includes("where id = ?")) out = out.filter(r => String(r.id) === String(params[0]));
  if (q.includes("role='student'")) out = out.filter(r => r.role === "student");
  if (q.includes("role='teacher'")) out = out.filter(r => r.role === "teacher");
  if (q.includes("department=?")) out = out.filter(r => String(r.department) === String(params[0]));
  if (q.includes("semester=?")) out = out.filter(r => String(r.semester) === String(params[1] ?? params[0]));
  if (q.includes("section=?")) out = out.filter(r => String(r.section) === String(params[2] ?? params[0]));
  const limit = q.match(/limit (\d+)/); if (limit) out = out.slice(0, Number(limit[1]));
  if (q.includes("order by name")) out.sort((a,b) => String(a.name).localeCompare(String(b.name)));
  return out;
}

export const db = {
  exec(_sql: string) { return this; },
  prepare(sql: string) {
    return {
      all: (...params: unknown[]) => filterRows(rowsFor(sql), sql, params),
      get: (...params: unknown[]) => filterRows(rowsFor(sql), sql, params)[0],
      run: (...params: unknown[]) => {
        const q = sql.replace(/\s+/g, " ").toLowerCase();
        const data = readStore();
        if (q.includes("insert into sessions")) {
          data.sessions = data.sessions || [];
          data.sessions.push({ id: params[0], user_id: Number(params[1]), expires_at: Number(params[2]) });
        } else if (q.includes("delete from sessions")) {
          data.sessions = (data.sessions || []).filter((s: Row) => s.id !== params[0]);
        } else if (q.includes("update users set active")) {
          const user = (data.users || []).find((u: Row) => u.id === Number(params[1]));
          if (user) user.active = Number(params[0]);
        } else if (q.includes("insert into users")) {
          data.users = data.users || [];
          const [name,email,password_hash,role,department,department_id,semester,section] = params;
          data.users.push({ id: Date.now(), name, email, password_hash, role, department, department_id, semester, section, active: 1 });
        } else if (q.includes("insert into announcements")) {
          const [title,message,priority,target_type,target_value,target_department,target_semester,target_section,author_id] = params;
          data.announcements = data.announcements || [];
          data.announcements.unshift({ id: Date.now(), title, message, priority, target_type, target_value, target_department, target_semester, target_section, author_id });
        } else if (q.includes("insert into departments")) {
          data.departments = data.departments || [];
          data.departments.push({ id: Date.now(), name: params[0], code: params[1] });
        } else if (q.includes("insert into courses")) {
          data.courses = data.courses || [];
          data.courses.push({ id: Date.now(), name: params[0], code: params[1], department_id: params[2] });
        }
        writeStore(data);
        return { changes: 1, lastInsertRowid: Date.now() };
      }
    };
  }
};
export default db;
