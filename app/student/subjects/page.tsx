import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/UI";
import { BookOpen, ClipboardList, FlaskConical, CalendarDays, ArrowRight } from "lucide-react";
import { subjects } from "@/lib/data";
import { countsForSubject } from "@/lib/academic";

const items = [
  ["notes", "Notes", BookOpen], ["exam_routine", "Exam Routine", CalendarDays],
  ["assignment", "Assignments", ClipboardList], ["practical", "Practicals", FlaskConical]
] as const;

export default function StudentSubjects() {
  return <AppShell>
    <PageHeader eyebrow="Academic File System" title="My Subjects" subtitle="Every material is automatically organized by your department, semester and section." />
    <div className="subject-workspace-grid">
      {subjects.map(subject => {
        const counts = countsForSubject(subject.id);
        return <Link href={`/student/subjects/${subject.id}`} className="academic-subject-card" key={subject.id}>
          <div className="subject-top"><div><span className="subject-code">{subject.id}</span><h2>{subject.name}</h2><p>CSE · Semester 3 · Section E</p></div><span className="open-arrow"><ArrowRight size={18}/></span></div>
          <div className="academic-counts">
            {items.map(([key, label, Icon]) => <div key={key}><Icon size={15}/><span>{label}</span><strong>{counts[key as keyof typeof counts]}</strong></div>)}
          </div>
          <div className="subject-footer"><span>{subject.teacher}</span><span>Open Subject →</span></div>
        </Link>;
      })}
    </div>
  </AppShell>;
}
