 "use client";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {LayoutDashboard, BookOpen, ClipboardList, Bell, CalendarDays, Search, UserCircle, Settings, Users, GraduationCap, Building2, LibraryBig, Layers3, LogOut, Upload, UserCog, ShieldCheck, Megaphone, Menu, X, Send} from "lucide-react";
import {useState, type ComponentType} from "react";

type NavItem = [string, string, ComponentType<{size?: number}>];

const studentNav: NavItem[] = [
  ["Dashboard","/student",LayoutDashboard],["Notices","/notices",Bell],["Events","/events",CalendarDays],["Study Materials","/student/subjects",BookOpen],["Assignments","/assignments",ClipboardList],["Academic Information","/academic",GraduationCap],["Search","/search",Search],["Profile","/profile",UserCircle]
];
const teacherNav: NavItem[] = [
  ["Dashboard","/teacher",LayoutDashboard],["My Subjects","/teacher",BookOpen],["Study Materials","/materials",LibraryBig],["Sent Materials","/teacher/materials",Send],["Assignments","/assignments",ClipboardList],["Notices","/notices",Bell],["Students","/teacher/students",Users],["Events","/events",CalendarDays],["Academic Information","/academic",GraduationCap],["Search","/search",Search],["Profile","/profile",UserCircle]
];
const adminNav: NavItem[] = [
  ["Dashboard","/admin",LayoutDashboard],["Students","/admin/students",GraduationCap],["Teachers","/admin/teachers",UserCog],["Administrators","/admin/users",ShieldCheck],["Departments","/admin/departments",Building2],["Courses","/admin/courses",Layers3],["Subjects","/admin/subjects",BookOpen],["Semesters","/admin/semesters",CalendarDays],["Sections","/admin/sections",Users],["Notices","/notices",Megaphone],["Events","/events",CalendarDays],["Reports","/admin/reports",LibraryBig],["Settings","/admin/settings",Settings]
];

export function AppShell({role="student",user,children}:{role?:string,user?:{id?:string|number,name?:string,email?:string,role?:string,department?:string,semester?:string|number,section?:string},children:React.ReactNode}){
  const path=usePathname(); const router=useRouter(); const [open,setOpen]=useState(false);
  const nav=role==="admin"?adminNav:role==="teacher"?teacherNav:studentNav;
  const title=role==="admin"?"Administrator":role==="teacher"?"Teacher":"Student";
  return <div className="app">
    <aside className={"sidebar "+(open?"open":"")}>
      <div className="brand"><span>CLASS</span><b>ORA</b></div>
      <div className="role-pill">{title} workspace</div>
      <nav>{nav.map(([label,href,Icon])=><Link key={href+label} href={href} onClick={()=>setOpen(false)} className={path===href?"active":""}><Icon size={17}/><span>{label}</span></Link>)}</nav>
      <div className="side-bottom"><Link href={role==="admin"?"/admin/settings":"/profile"}><Settings size={17}/>Settings</Link><button onClick={()=>router.push("/")}><LogOut size={17}/>Logout</button></div>
    </aside>
    {open&&<button className="scrim" onClick={()=>setOpen(false)} aria-label="Close menu"/>}
    <main className="main">
      <header className="topbar"><button className="icon-btn menu-btn" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button><div className="top-search"><Search size={16}/><input placeholder={role==="admin"?"Search users, subjects, departments…":"Search notes, assignments, notices…"}/></div><div className="top-user"><div className="avatar">{role==="admin"?"A":role==="teacher"?"S":"L"}</div><div><strong>{role==="admin"?"Admin":role==="teacher"?"Dr. Sharma":"Liquid"}</strong><small>{title}</small></div></div></header>
      <div className="content">{children}</div>
    </main>
  </div>
}
