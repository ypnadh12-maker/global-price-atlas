'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  async function signIn() {
    if (!supabase) return

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setMessage(error.message)
      return
    }

    router.push('/admin-analytics')
  }

  return (
    <main style={{ padding: 40, maxWidth: 400, margin: '0 auto' }}>
      <h1>Admin Login</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={styles.input}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={styles.input}
      />

      <button onClick={signIn} style={styles.button}>
        Login
      </button>

      <p>{message}</p>
    </main>
  )
}

const styles = {
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    border: '1px solid #ccc',
    borderRadius: 6
  },
  button: {
    width: '100%',
    padding: 12,
    background: 'black',
    color: 'white',
    borderRadius: 6,
    cursor: 'pointer'
  }
}
