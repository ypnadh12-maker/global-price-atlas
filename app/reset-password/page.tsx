'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [ready, setReady] = useState(false)

  // Convert recovery URL into session
  useEffect(() => {
    async function init() {
      const { error } = await supabase.auth.getSession()

      // Supabase automatically reads hash and restores session
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
    else setMessage('Password updated! Login again.')
  }

  return (
    <main style={{ padding: 40, maxWidth: 400, margin: '0 auto' }}>
      <h1>Reset Password</h1>

      {!ready ? (
        <p>Verifying link...</p>
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
