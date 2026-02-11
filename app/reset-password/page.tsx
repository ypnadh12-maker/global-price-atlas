'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    async function init() {
      // Convert recovery link into session
      const { error } = await supabase.auth.exchangeCodeForSession(
        window.location.href
      )

      if (error) {
        setMessage('Invalid or expired reset link.')
      } else {
        setReady(true)
      }
    }

    init()
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

      {!ready ? (
        <p>Verifying reset link...</p>
      ) : (
        <>
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
        </>
      )}

      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </main>
  )
}
