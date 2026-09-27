import {redirect} from "next/navigation";
import Link from "next/link";
import {currentUser} from "@/lib/auth";
import {db} from "@/lib/db";
import {AppShell} from "@/components/AppShell";
import {Download,FileText,Upload,CalendarDays,ClipboardList,FlaskConical} from "lucide-react";

const labels:any={notes:["📚","Notes"],exam_routine:["📅","Exam Routine"],assignment:["📝","Assignments"],practical:["🧪","Practical"]};

export default async function Notes(){
 const u=await currentUser(); if(!u)redirect("/login");
 const rows=db.prepare(`
  SELECT m.*,s.name subject,s.code subject_code
  FROM materials m JOIN subjects s ON s.id=m.subject_id
  JOIN material_targets t ON t.material_id=m.id
  WHERE t.department=? AND t.semester=? AND t.section=?
  ORDER BY m.id DESC
 `).all(u.department,u.semester,u.section) as any[];
 const counts=db.prepare(`SELECT m.type,COUNT(DISTINCT m.id) count FROM materials m JOIN material_targets t ON t.material_id=m.id WHERE t.department=? AND t.semester=? AND t.section=? GROUP BY m.type`).all(u.department,u.semester,u.section) as any[];
 const map:any={};counts.forEach((x:any)=>map[x.type]=x.count);
 return <AppShell user={u}><div className="mx-auto max-w-[1200px]">
  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs uppercase tracking-[.24em] text-indigo-300">Study Materials</p><h1 className="mt-2 text-3xl font-bold sm:text-4xl">Study Materials</h1><p className="mt-1 text-sm text-slate-500">Materials sent to {u.department} · Semester {u.semester} · Section {u.section}.</p></div>{u.role!=="student"&&<Link href="/teacher/upload" className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold"><Upload className="h-4 w-4"/> Upload</Link>}</div>
  <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">{Object.entries(labels).map(([type,v]:any)=><div key={type} className="glass rounded-2xl p-4"><div className="text-xl">{v[0]}</div><p className="mt-3 text-sm text-slate-400">{v[1]}</p><p className="mt-1 text-2xl font-semibold">{map[type]||0}</p></div>)}</div>
  <section className="glass mt-6 overflow-hidden rounded-2xl"><div className="divide-y divide-white/5">{rows.map((m:any)=><div key={m.id} className="flex min-w-0 items-center gap-3 p-4 sm:gap-4"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-500/10 text-indigo-300"><FileText className="h-5 w-5"/></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="truncate text-sm font-medium">{m.title}</p><span className="rounded-full bg-white/5 px-2 py-1 text-[9px] text-slate-500">{labels[m.type]?.[1]||m.type}</span></div><p className="mt-1 truncate text-xs text-slate-500">{m.subject} · {m.filename}</p></div><a aria-label={`Download ${m.title}`} href={`/api/materials/${m.id}`} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/8 text-slate-400 hover:text-white"><Download className="h-4 w-4"/></a></div>)}{!rows.length&&<div className="p-10 text-center text-sm text-slate-500">No study materials have been sent to your section yet.</div>}</div></section>
 </div></AppShell>
}