'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  async function logout() {
    await supabase.auth.signOut()
    location.reload()
  }

  return (
    <nav style={{
      background: '#111',
      color: 'white',
      padding: 12,
      display: 'flex',
      justifyContent: 'space-between'
    }}>

      <Link href="/" style={{ fontWeight: 'bold' }}>
        Global Price Atlas
      </Link>

      <div style={{ display: 'flex', gap: 16 }}>

        {user && (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/admin-analytics">Admin</Link>
            <Link href="/admin-users">Users</Link>

            <button onClick={logout}
              style={{
                background: 'red',
                border: 'none',
                color: 'white',
                padding: '6px 10px',
                cursor: 'pointer',
                borderRadius: 6
              }}>
              Logout
            </button>
          </>
        )}

        {!user && (
          <Link href="/login">Login</Link>
        )}

      </div>
    </nav>
  )
}
