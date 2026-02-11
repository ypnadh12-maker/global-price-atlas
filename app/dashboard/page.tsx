'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: session } = await supabase.auth.getSession()

      if (!session.session?.user) {
        alert('Please login')
        setLoading(false)
        return
      }

      const userId = session.session.user.id

      const { data } = await supabase
        .from('watchlists')
        .select('id, products(*)')
        .eq('user_id', userId)

      setItems(data || [])
      setLoading(false)
    }

    load()
  }, [])

  async function unsubscribe(id: string) {
    await supabase.from('watchlists').delete().eq('id', id)
    setItems(items.filter(i => i.id !== id))
  }

  if (loading) return <p style={{ padding: 40 }}>Loading...</p>

  return (
    <main style={styles.container}>
      <h1 style={styles.title}>My Subscriptions</h1>

      {items.length === 0 && (
        <p style={styles.empty}>No subscriptions yet</p>
      )}

      <div style={styles.grid}>
        {items.map(item => (
          <div key={item.id} style={styles.card}>
          {item.products.image_url && (
  <img
    src={item.products.image_url}
    alt={item.products.name}
    style={styles.image}
  />
)}

<h3 style={styles.productName}>
  {item.products.name}
</h3>


            <button
              onClick={() => unsubscribe(item.id)}
              style={styles.unsubscribe}
            >
              Unsubscribe
            </button>
          </div>
        ))}
      </div>
    </main>
  )
}

const styles: any = {
  container: {
    padding: 40,
    maxWidth: 900,
    margin: '0 auto'
  },
  title: {
    fontSize: 28,
    marginBottom: 30
  },
  empty: {
    opacity: 0.7
  },
  grid: {
    display: 'grid',
    gap: 20
  },
  card: {
    border: '1px solid #e5e5e5',
    padding: 20,
    borderRadius: 10,
    background: '#fafafa'
  },
  productName: {
    marginBottom: 12
  },
  unsubscribe: {
    padding: '8px 12px',
    background: '#d11a2a',
    color: 'white',
    borderRadius: 6,
    border: 'none',
    cursor: 'pointer'
  },   // ← IMPORTANT comma here

  image: {
    width: '100%',
    maxHeight: 180,
    objectFit: 'cover',
    borderRadius: 8,
    marginBottom: 12
  }
}
