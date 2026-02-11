import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const body = await req.json()

  console.log('CLICK API HIT', body)

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  )

  const { error } = await supabase
    .from('affiliate_clicks')
    .insert(body)

  console.log('INSERT ERROR:', error)

  return NextResponse.json({ ok: true })
}
