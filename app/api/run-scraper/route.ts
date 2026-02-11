import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

const ADMIN_EMAIL = 'ypnadh@gmail.com'

export async function POST() {

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  exec('node scraper/playwright.js', (err, stdout, stderr) => {
    if (err) console.log(err)
    if (stdout) console.log(stdout)
    if (stderr) console.log(stderr)
  })

  return NextResponse.json({ success: true })
}
