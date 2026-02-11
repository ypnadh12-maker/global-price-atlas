import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

const ADMIN_EMAIL = 'ypnadh@gmail.com'

export default async function AdminUsers() {

  // ✅ Next 16 cookies fix
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

  console.log('ADMIN CHECK USER:', user)

  if (!user || user.email !== ADMIN_EMAIL) {
    redirect('/')
  }

  // ✅ admin client (service role)
  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data } = await adminClient.auth.admin.listUsers()

  const users = data?.users || []

  return (
    <main style={{ padding: 40, maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: 32, marginBottom: 30 }}>
        User Management
      </h1>

      {users.map((u: any) => (
        <div key={u.id}
          style={{
            background: 'white',
            padding: 15,
            marginBottom: 10,
            borderRadius: 10,
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
          }}
        >
          <strong>{u.email}</strong>
          <p style={{ fontSize: 12, color: '#666' }}>
            ID: {u.id}
          </p>
        </div>
      ))}

    </main>
  )
}
