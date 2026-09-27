import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/UI";
import { BookOpen, CalendarDays, ClipboardList, FlaskConical, ArrowRight } from "lucide-react";
import { subjects } from "@/lib/data";
import { countsForSubject } from "@/lib/academic";

export default function Materials() {
  return <AppShell>
    <PageHeader eyebrow="Academic File System" title="Study Materials" subtitle="Materials are organized by subject, type, semester and section — not by a flat file list." />
    <div className="identity-strip"><strong>CSE</strong><span>Semester 3</span><span>Section E</span><span>Materials available to your class</span></div>
    <div className="subject-workspace-grid">
      {subjects.map(s => { const c = countsForSubject(s.id); return <Link href={`/student/subjects/${s.id}`} className="academic-subject-card" key={s.id}>
        <div className="subject-top"><div><span className="subject-code">{s.id}</span><h2>{s.name}</h2><p>{s.teacher} · CSE · Sem 3 · E</p></div><span className="open-arrow"><ArrowRight size={18}/></span></div>
        <div className="academic-counts"><div><BookOpen size={15}/><span>Notes</span><strong>{c.notes}</strong></div><div><CalendarDays size={15}/><span>Routine</span><strong>{c.exam_routine}</strong></div><div><ClipboardList size={15}/><span>Assignments</span><strong>{c.assignment}</strong></div><div><FlaskConical size={15}/><span>Practical</span><strong>{c.practical}</strong></div></div>
      </Link> })}
    </div>
  </AppShell>;
}
