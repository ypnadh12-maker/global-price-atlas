'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  async function signIn() {
    if (!supabase) {
      setMessage('Supabase not configured')
      return
    }

    const { error } = await supabase.auth.signInWithOtp({ email })

    if (error) setMessage(error.message)
    else setMessage('Check your email for login link!')
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Login</h1>

      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        style={{ padding: 8, width: 300 }}
      />

      <br /><br />

      <button onClick={signIn}>
        Send Magic Link
      </button>

      <p>{message}</p>
    </main>
  )
}
