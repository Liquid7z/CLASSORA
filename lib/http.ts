import {NextResponse} from 'next/server'
export function redirect(path:string,req:Request){return NextResponse.redirect(new URL(path,req.url))}
