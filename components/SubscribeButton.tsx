'use client'

import { supabase, getUser } from '../lib/supabase'

export default function SubscribeButton({ productId }: { productId: string }) {
  

async function subscribe() {
const session = await supabase.auth.getSession()
console.log('SESSION:', session)

    const user = await getUser()

    if (!user) {
      alert('Please login first')
      return
    }

  const { error } = await supabase.from('watchlists').insert({
  user_id: user.id,
  product_id: productId
})

console.log('Insert error:', error)


    alert('Subscribed to price alerts!')
  }

  return (
    <button
      onClick={subscribe}
      style={{
        padding: 10,
        background: 'green',
        color: 'white',
        borderRadius: 6,
        marginBottom: 20
      }}
    >
      Subscribe to price alerts
    </button>
  )
}
