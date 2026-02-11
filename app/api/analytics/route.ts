import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  if (!supabase) return NextResponse.json({ ok: false })

  const body = await req.json()

  await supabase.from('analytics_events').insert(body)

  return NextResponse.json({ ok: true })
}
