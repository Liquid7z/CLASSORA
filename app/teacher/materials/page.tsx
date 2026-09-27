import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/UI";
import { Check, FileText, Users, ArrowUpRight } from "lucide-react";
import { getMaterials, typeName, formatSize } from "@/lib/academic";

export default function TeacherMaterials() {
  const rows = getMaterials();
  return <AppShell role="teacher">
    <PageHeader eyebrow="Distribution History" title="Sent Materials" subtitle="See exactly which academic sections received each material." action={<Link href="/teacher/upload" className="btn primary">+ Upload Material</Link>} />
    <div className="sent-summary"><div><span>Total distributed</span><strong>{rows.length}</strong></div><div><span>Sections targeted</span><strong>{new Set(rows.flatMap(r => r.targets.map(t => `${t.department}-${t.semester}-${t.section}`))).size}</strong></div><div><span>Subjects</span><strong>{new Set(rows.map(r => r.subjectId)).size}</strong></div></div>
    <section className="card">
      <div className="list">{rows.map(row => <div className="sent-material" key={row.id}>
        <div className="file-icon"><FileText size={17}/></div>
        <div className="grow"><strong>{row.title}</strong><span>{row.subject} · {typeName(row.type)} · {formatSize(row.size)} · {new Date(row.createdAt).toLocaleString()}</span></div>
        <div className="target-list">{row.targets.map(t => <span className="target-chip" key={`${t.department}-${t.semester}-${t.section}`}><Check size={12}/>{t.department} · Sem {t.semester} · {t.section}</span>)}</div>
        <ArrowUpRight size={16} className="muted" />
      </div>)}</div>
    </section>
  </AppShell>;
}
