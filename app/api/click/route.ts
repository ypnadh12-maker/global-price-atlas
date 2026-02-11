import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()

  console.log('CLICK API HIT', body)

  const { error } = await supabase
    .from('affiliate_clicks')
    .insert(body)

  console.log('INSERT ERROR:', error)

  return NextResponse.json({ ok: true })
}
