'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useSearchParams } from 'next/navigation'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const params = useSearchParams()

  // 🔥 This captures the recovery session
  useEffect(() => {
    async function handleRecovery() {
      const hash = window.location.hash

      if (hash) {
        await supabase.auth.exchangeCodeForSession(hash)
      }
    }

    handleRecovery()
  }, [])

  async function updatePassword() {
    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) setMessage(error.message)
    else setMessage('Password updated! You can login now.')
  }

  return (
    <main style={{ padding: 40, maxWidth: 400, margin: '0 auto' }}>
      <h1>Reset Password</h1>

      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: '100%', padding: 10, marginBottom: 10 }}
      />

      <button
        onClick={updatePassword}
        style={{
          width: '100%',
          padding: 12,
          background: 'black',
          color: 'white',
          border: 'none',
        }}
      >
        Update password
      </button>

      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </main>
  )
}
