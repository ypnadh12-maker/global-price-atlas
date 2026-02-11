import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import RunButton from './RunButton'

const ADMIN_EMAIL = 'ypnadh@gmail.com'

export default async function AdminScraper() {

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) {
    redirect('/')
  }

  const { data: targets } = await supabase
    .from('scrape_targets')
    .select('*')

  const { data: logs } = await supabase
    .from('scrape_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <main style={{ padding: 40, maxWidth: 1100, margin: '0 auto' }}>

      <h1 style={{ fontSize: 32, marginBottom: 10 }}>
        Scraper Dashboard
      </h1>

      <RunButton />

      <h2>Targets</h2>

      {targets?.map((t: any) => (
        <div key={t.id}
          style={{
            background: 'white',
            padding: 15,
            marginBottom: 10,
            borderRadius: 10
          }}>
          <p><strong>URL:</strong> {t.url}</p>
          <p><strong>Selector:</strong> {t.selector}</p>
          <p><strong>Adapter:</strong> {t.adapter}</p>
        </div>
      ))}

      <h2 style={{ marginTop: 40 }}>Recent Logs</h2>

      {logs?.map((log: any) => (
        <div key={log.id}
          style={{
            background: log.status === 'error' ? '#ffe6e6' : '#e6ffe6',
            padding: 12,
            marginBottom: 8,
            borderRadius: 8
          }}>
          <p><strong>Status:</strong> {log.status}</p>
          <p>{log.message}</p>
          <p>Price: {log.price ?? '-'}</p>
          <p style={{ fontSize: 12 }}>
            {new Date(log.created_at).toLocaleString()}
          </p>
        </div>
      ))}

    </main>
  )
}
