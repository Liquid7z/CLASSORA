"use client";
import { AppShell } from "@/components/AppShell";
import { PageHeader, Select } from "@/components/UI";
import { UploadCloud, FileText, CheckCircle2, Users, X, Send } from "lucide-react";
import { useState } from "react";

const subjects = [
  ["CSE301", "Data Structures"], ["CSE302", "Python Programming"], ["CSE303", "Discrete Mathematics"],
  ["CSE304", "Computer Architecture"], ["CSE305", "Database Management Systems"]
] as const;
const sections = ["A", "B", "C", "D", "E"];
const types = [["notes", "📚 Notes"], ["exam_routine", "📅 Exam Routine"], ["assignment", "📝 Assignment"], ["practical", "🧪 Practical"]] as const;

export default function UploadPage() {
  const [type, setType] = useState("notes");
  const [subjectId, setSubjectId] = useState("CSE301");
  const [semester, setSemester] = useState("3");
  const [selected, setSelected] = useState<string[]>(["E"]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const subject = subjects.find(s => s[0] === subjectId)!;
  const toggle = (s: string) => setSelected(x => x.includes(s) ? x.filter(v => v !== s) : [...x, s]);
  const submit = async () => {
    setError("");
    if (!title.trim() || !file || !selected.length) { setError("Add a title, choose a file, and select at least one section."); return; }
    setBusy(true);
    const form = new FormData();
    form.set("title", title.trim()); form.set("description", description.trim()); form.set("type", type); form.set("subjectId", subjectId); form.set("subject", subject[1]);
    form.set("department", "CSE"); form.set("semester", semester); form.set("teacherId", "T001"); form.set("teacher", "Dr. Sharma");
    form.set("targets", JSON.stringify(selected.map(section => ({ department: "CSE", semester, section })))); form.set("file", file);
    try {
      const response = await fetch("/api/materials", { method: "POST", body: form });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Upload failed");
      setSent(true);
    } catch (e) { setError(e instanceof Error ? e.message : "Upload failed"); }
    finally { setBusy(false); }
  };

  return <AppShell role="teacher">
    <PageHeader eyebrow="Academic Distribution" title="Send academic material" subtitle="Choose what you're sending, the subject, and exactly which sections should receive it." />
    <section className="card upload-card">
      {sent ? <div className="empty"><CheckCircle2 size={52} color="#65dfb1"/><h2>Material distributed successfully</h2><p><strong>{title}</strong> is now mapped to CSE · Semester {semester} · Sections {selected.join(", ")} under {subject[1]}.</p><div className="actions center"><a className="btn" href="/teacher/materials">View Sent Materials</a><button className="btn primary" onClick={() => { setSent(false); setTitle(""); setDescription(""); setFile(null); }}>Upload another</button></div></div> : <div className="form-grid">
        <div className="field full"><label>Material type</label><div className="type-grid">{types.map(([value,label]) => <button key={value} type="button" className={`type-option ${type === value ? "selected" : ""}`} onClick={() => setType(value)}>{label}</button>)}</div></div>
        <Select label="Subject" value={subject[1]} options={subjects.map(s => s[1])} onChange={name => setSubjectId(subjects.find(s => s[1] === name)![0])}/>
        <Select label="Semester" value={`Semester ${semester}`} options={Array.from({length:8},(_,i)=>`Semester ${i+1}`)} onChange={value => setSemester(value.split(" ")[1])}/>
        <div className="field full"><label>Send to sections <span className="muted">({selected.length} selected)</span></label><div className="section-picker">{sections.map(s => <button type="button" key={s} onClick={() => toggle(s)} className={`section-option ${selected.includes(s) ? "selected" : ""}`}><span className="check-box">{selected.includes(s) ? "✓" : ""}</span><Users size={15}/>Section {s}</button>)}</div></div>
        <div className="field full"><label>Distribution preview</label><div className="distribution-preview"><div><span>Subject</span><strong>{subject[1]}</strong></div><div><span>Target</span><strong>CSE · Sem {semester} · {selected.length === 1 ? `Section ${selected[0]}` : `${selected.length} sections`}</strong></div><div><span>Delivery</span><strong>One file · multiple academic targets</strong></div></div></div>
        <div className="field full"><label>Material title</label><input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Unit III — Binary Trees"/></div>
        <div className="field full"><label>Description</label><textarea className="textarea" value={description} onChange={e => setDescription(e.target.value)} placeholder="Chapter notes, instructions, deadline, or any context…"/></div>
        <div className="field full"><label>File</label><label className="upload-box"><UploadCloud size={32}/><strong>{file ? file.name : "Select academic file"}</strong><span>{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB · Ready to send` : "PDF, DOCX, PPTX or image · local demo storage"}</span><input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg" hidden onChange={e => setFile(e.target.files?.[0] || null)}/>{file && <button type="button" className="remove-file" onClick={e => { e.preventDefault(); setFile(null); }}><X size={14}/>Remove</button>}</label></div>
        {error && <div className="full form-error">{error}</div>}
        <div className="full actions" style={{justifyContent:"flex-end"}}><button className="btn ghost" type="button" onClick={() => {setTitle("");setDescription("");setFile(null)}}>Clear</button><button className="btn primary" type="button" disabled={busy} onClick={submit}>{busy ? "Uploading…" : <><Send size={16}/>Upload & Send</>}</button></div>
      </div>}
    </section>
  </AppShell>;
}
