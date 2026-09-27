"use client";

import { ChevronDown, Search, BookOpen, ClipboardList, Bell, CalendarDays, Users, GraduationCap, Upload, Layers3, Building2, UserCog, ShieldCheck, LibraryBig, Settings, Megaphone, BarChart3, FileText } from "lucide-react";
import { useState, type ReactNode } from "react";

const icons = {
  book: BookOpen,
  assignments: ClipboardList,
  notices: Bell,
  calendar: CalendarDays,
  users: Users,
  students: GraduationCap,
  upload: Upload,
  courses: Layers3,
  departments: Building2,
  teachers: UserCog,
  admin: ShieldCheck,
  materials: LibraryBig,
  settings: Settings,
  megaphone: Megaphone,
  reports: BarChart3,
  file: FileText,
} as const;

export type StatIcon = keyof typeof icons;

export function Select({ label, value, options, onChange }: { label?: string; value: string; options: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="field">
      {label && <label>{label}</label>}
      <div className="select-wrap">
        <button type="button" className="select-btn" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          <span>{value}</span><ChevronDown size={17} />
        </button>
        {open && <>
          <button className="select-overlay" onClick={() => setOpen(false)} aria-label="Close menu" />
          <div className="select-menu" role="listbox">
            {options.map((option) => (
              <button type="button" role="option" aria-selected={option === value} key={option} className={option === value ? "selected" : ""} onClick={() => { onChange(option); setOpen(false); }}>
                {option}
              </button>
            ))}
          </div>
        </>}
      </div>
    </div>
  );
}

export function PageHeader({ eyebrow, title, subtitle, action }: { eyebrow?: string; title: string; subtitle?: string; action?: ReactNode }) {
  return <div className="page-head"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>{action && <div className="page-actions">{action}</div>}</div>;
}

export function Stat({ label, value, icon, delta }: { label: string; value: string | number; icon: StatIcon; delta?: string }) {
  const Icon = icons[icon] ?? FileText;
  return <div className="stat"><div className="stat-icon"><Icon size={20} /></div><div><span>{label}</span><strong>{value}</strong>{delta && <small>{delta}</small>}</div></div>;
}

export function Empty({ title = "No data yet", text = "Items will appear here when they are added." }: { title?: string; text?: string }) {
  return <div className="empty"><div className="empty-icon">◎</div><strong>{title}</strong><p>{text}</p></div>;
}

export function SearchBox({ placeholder = "Search…" }: { placeholder?: string }) {
  return <div className="search-box"><Search size={17} /><input placeholder={placeholder} aria-label={placeholder} /></div>;
}
