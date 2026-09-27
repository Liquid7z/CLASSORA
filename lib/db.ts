/**
 * CLASSORA compatibility data layer.
 *
 * This intentionally does NOT use better-sqlite3. The previous native SQLite
 * dependency can crash or fail to resolve on some Node/Next combinations.
 * CLASSORA's current demo uses lib/data.ts + lib/academic.ts instead.
 *
 * The small prepare()/all()/get() surface is kept only so older local pages
 * that still import `@/lib/db` do not fail module resolution while migrating.
 */
import { assignments, events, materials, notices, students, subjects, teachers } from "./data";

type Row = Record<string, unknown>;

function rowsFor(sql: string): Row[] {
  const normalized = sql.toLowerCase();
  if (normalized.includes("from notes")) {
    return materials
      .filter((m) => m.type === "notes")
      .map((m) => ({ ...m, stored_name: "", filename: `${m.title}.pdf` }));
  }
  if (normalized.includes("from materials") || normalized.includes("from study_materials")) return materials as Row[];
  if (normalized.includes("from assignments")) return assignments as Row[];
  if (normalized.includes("from notices")) return notices as Row[];
  if (normalized.includes("from events")) return events as Row[];
  if (normalized.includes("from subjects")) return subjects as Row[];
  if (normalized.includes("from students")) return students as Row[];
  if (normalized.includes("from teachers")) return teachers as Row[];
  return [];
}

function filterByParams(rows: Row[], sql: string, params: unknown[]): Row[] {
  const normalized = sql.toLowerCase();
  if (normalized.includes("where email = ?") && params[0]) {
    return rows.filter((row) => row.email === params[0]);
  }
  if (normalized.includes("where id = ?") && params[0]) {
    return rows.filter((row) => row.id === params[0]);
  }
  return rows;
}

export const db = {
  prepare(sql: string) {
    return {
      all: (...params: unknown[]) => filterByParams(rowsFor(sql), sql, params),
      get: (...params: unknown[]) => filterByParams(rowsFor(sql), sql, params)[0],
      run: (..._params: unknown[]) => ({ changes: 0, lastInsertRowid: 0 }),
    };
  },
};

export default db;
