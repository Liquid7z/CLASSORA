import {NextResponse} from 'next/server'
import {currentUser} from '@/lib/auth'
import {db} from '@/lib/db'
import fs from 'fs'
import path from 'path'
export async function POST(req:Request){const u=await currentUser();if(!u||!['teacher','admin'].includes(u.role))return NextResponse.json({error:'Forbidden'},{status:403});const f=await req.formData(),id=Number(f.get('id'));const n=db.prepare('SELECT * FROM notes WHERE id=?').get(id) as any;if(!n)return NextResponse.json({error:'Not found'},{status:404});if(u.role==='teacher'&&n.uploaded_by!==u.id)return NextResponse.json({error:'You can only delete your own notes'},{status:403});try{fs.unlinkSync(path.join(process.cwd(),'uploads/notes',n.stored_name))}catch{}db.prepare('DELETE FROM notes WHERE id=?').run(id);return NextResponse.redirect(new URL('/notes',req.url))}
