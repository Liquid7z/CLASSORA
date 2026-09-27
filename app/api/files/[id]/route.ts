export const runtime = "nodejs";
import {NextResponse} from 'next/server'
import {currentUser} from '@/lib/auth'
import {db} from '@/lib/db'
import fs from 'fs'
import path from 'path'
export async function GET(_req:Request,{params}:{params:Promise<{id:string}>}){if(!await currentUser())return NextResponse.json({error:'Unauthorized'},{status:401});const {id}=await params;const n=db.prepare('SELECT * FROM notes WHERE id=?').get(Number(id)) as any;if(!n)return NextResponse.json({error:'Not found'},{status:404});const file=path.join(process.cwd(),'uploads/notes',n.stored_name);if(!fs.existsSync(file))return NextResponse.json({error:'File missing'},{status:404});const data=fs.readFileSync(file);const ext=path.extname(n.filename).toLowerCase();const types:any={'.pdf':'application/pdf','.txt':'text/plain','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.doc':'application/msword','.docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document','.ppt':'application/vnd.ms-powerpoint','.pptx':'application/vnd.openxmlformats-officedocument.presentationml.presentation'};return new NextResponse(data,{headers:{'Content-Type':types[ext]||'application/octet-stream','Content-Disposition':`inline; filename="${n.filename.replace(/"/g,'')}"`}})}
