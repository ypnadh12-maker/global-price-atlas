

'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'


export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  async function signIn() {
    const { error } = await supabase.auth.signInWithOtp({ email })

    if (error) setMessage(error.message)
    else setMessage('Check your email for login link!')
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setMessage('Logged in successfully!')
      }
    })
  }, [])

  return (
    <main style={{ padding: 40 }}>
      <h1>Login</h1>

      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ padding: 8, marginRight: 10 }}
      />

      <button onClick={signIn} style={{ padding: 8 }}>
        Sign in
      </button>

      <p>{message}</p>
    </main>
  )
}
