import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { BookOpen, CalendarDays, ClipboardList, Download, FileText, FlaskConical, ArrowLeft } from "lucide-react";
import { subjects } from "@/lib/data";
import { formatSize, getSubjectMaterials, typeName, type MaterialType } from "@/lib/academic";

const tabs: { key: MaterialType; label: string; icon: typeof BookOpen }[] = [
  { key: "notes", label: "Notes", icon: BookOpen },
  { key: "exam_routine", label: "Exam Routine", icon: CalendarDays },
  { key: "assignment", label: "Assignment", icon: ClipboardList },
  { key: "practical", label: "Practical", icon: FlaskConical },
];

export default async function SubjectWorkspace({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = await params;
  const subject = subjects.find(s => s.id === subjectId);
  if (!subject) notFound();
  const rows = getSubjectMaterials(subject.id);
  return <AppShell>
    <Link href="/student/subjects" className="back-link"><ArrowLeft size={16}/> My Subjects</Link>
    <div className="workspace-head">
      <div><div className="eyebrow">Subject Workspace</div><h1>{subject.name}</h1><p>{subject.id} · CSE · Semester 3 · Section E · {subject.teacher}</p></div>
      <span className="target-pill">Section E</span>
    </div>
    <div className="material-tabs">
      {tabs.map(({key,label,icon:Icon}) => <a key={key} href={`#${key}`}><Icon size={16}/>{label}<span>{rows.filter(r => r.type === key).length}</span></a>)}
    </div>
    <div className="workspace-list">
      {tabs.map(({key,label,icon:Icon}) => {
        const sectionRows = rows.filter(r => r.type === key);
        return <section className="card" id={key} key={key}>
          <div className="card-head"><h2><Icon size={17}/> {label}</h2><span className="muted small">{sectionRows.length} materials</span></div>
          {!sectionRows.length ? <div className="mini-empty">No {label.toLowerCase()} have been distributed to Section E yet.</div> : sectionRows.map(row => <div className="material-row" key={row.id}>
            <div className="file-icon"><FileText size={17}/></div>
            <div className="grow"><strong>{row.title}</strong><span>{row.teacher} · {new Date(row.createdAt).toLocaleDateString()} · {formatSize(row.size)}</span>{row.description && <small>{row.description}</small>}</div>
            {row.filePath ? <a className="icon-btn" href={row.filePath} download={row.filename} title="Download"><Download size={15}/></a> : <span className="badge">Demo</span>}
          </div>)}
        </section>;
      })}
    </div>
  </AppShell>;
}
