import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const ADMIN_EMAIL = 'admin@gmail.com'

const commissionMap: any = {
  Amazon: 0.03,
  Apple: 0.01,
  Flipkart: 0.02,
  Default: 0.02
}

export default async function AdminAnalytics() {

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        }
      }
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) {
    redirect('/')
  }

  // SYSTEM COUNTS
  const { count: products } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })

  const { count: prices } = await supabase
    .from('price_history')
    .select('*', { count: 'exact', head: true })

  const { count: alerts } = await supabase
    .from('alerts')
    .select('*', { count: 'exact', head: true })

  const { count: subscribers } = await supabase
    .from('watchlists')
    .select('*', { count: 'exact', head: true })

  const { count: clicksCount } = await supabase
    .from('affiliate_clicks')
    .select('*', { count: 'exact', head: true })

  const { count: analytics } = await supabase
    .from('analytics_events')
    .select('*', { count: 'exact', head: true })

  const cards = [
    { title: 'Products', value: products },
    { title: 'Price Records', value: prices },
    { title: 'Alerts Sent', value: alerts },
    { title: 'Subscribers', value: subscribers },
    { title: 'Affiliate Clicks', value: clicksCount },
    { title: 'Page Views', value: analytics },
  ]

  // REVENUE
  const { data: clicks } = await supabase
    .from('affiliate_clicks')
    .select('*')

  const { data: retailers } = await supabase
    .from('retailers')
    .select('*')

  let totalRevenue = 0
  const retailerRevenue: any = {}

  clicks?.forEach((click: any) => {
    const retailer = retailers?.find(
      (r: any) => r.id === click.retailer_id
    )

    const rate =
      commissionMap[retailer?.name] ??
      commissionMap.Default

    const revenue = 100 * rate

    totalRevenue += revenue

    retailerRevenue[retailer?.name || 'Unknown'] =
      (retailerRevenue[retailer?.name || 'Unknown'] || 0) + revenue
  })

  const leaderboard = Object.entries(retailerRevenue)
    .sort((a: any, b: any) => b[1] - a[1])

  return (
    <main style={{ padding: 40, maxWidth: 1000, margin: '0 auto' }}>

      <h1 style={{ fontSize: 32, marginBottom: 30 }}>
        Admin Analytics Dashboard
      </h1>

      {/* METRICS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 20,
        marginBottom: 40
      }}>
        {cards.map((c, i) => (
          <div key={i}
            style={{
              background: 'white',
              padding: 20,
              borderRadius: 12,
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
            }}
          >
            <h2 style={{ fontSize: 14, color: '#666' }}>
              {c.title}
            </h2>

            <p style={{ fontSize: 32, fontWeight: 'bold' }}>
              {c.value || 0}
            </p>
          </div>
        ))}
      </div>

      {/* REVENUE */}
      <div style={{
        background: 'white',
        padding: 20,
        borderRadius: 12,
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        marginBottom: 30
      }}>
        <h2>Total Estimated Revenue</h2>
        <p style={{
          fontSize: 36,
          fontWeight: 'bold',
          color: 'green'
        }}>
          ${totalRevenue.toFixed(2)}
        </p>
      </div>

      {/* LEADERBOARD */}
      <h2>Retailer Revenue Leaderboard</h2>

      {leaderboard.map(([name, value]: any, i: number) => (
        <div key={i}
          style={{
            background: 'white',
            padding: 15,
            marginBottom: 10,
            borderRadius: 10,
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
          }}
        >
          {name} — ${value.toFixed(2)}
        </div>
      ))}

    </main>
  )
}
