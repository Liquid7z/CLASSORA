import Link from "next/link";
export default function Home(){return <main className="login"><section className="login-card" style={{maxWidth:780}}>
  <div className="brand"><span>CLASS</span><b>ORA</b></div>
  <div className="hero" style={{marginTop:25}}><div className="eyebrow">Campus Academic Workspace</div><h1>Everything your class needs. <span style={{color:"#9b78ff"}}>In one space.</span></h1><p>Notes, assignments, notices, events and academic information organized by subject and class.</p></div>
  <div className="grid-3"><Link className="btn primary" href="/login">Sign in</Link><Link className="btn" href="/student">Student demo</Link><Link className="btn" href="/admin">Admin demo</Link></div>
</section></main>}
