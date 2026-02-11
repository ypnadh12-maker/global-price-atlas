'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  async function reset() {
    if (!supabase) return

    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Password updated! Redirecting to login...')
      setTimeout(() => router.push('/login'), 2000)
    }
  }

  return (
    <main style={{ padding: 40, maxWidth: 400, margin: '0 auto' }}>
      <h1>Reset Password</h1>

      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: '100%', padding: 10, marginTop: 20 }}
      />

      <button
        onClick={reset}
        style={{
          marginTop: 20,
          padding: 10,
          width: '100%',
          background: 'black',
          color: 'white',
        }}
      >
        Update password
      </button>

      <p style={{ marginTop: 20 }}>{message}</p>
    </main>
  )
}
