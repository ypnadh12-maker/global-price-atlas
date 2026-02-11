export const dynamic = 'force-dynamic'

import { supabase } from '../lib/supabase'
import Dashboard from '../components/Dashboard'


async function getRates() {
  try {
    const res = await fetch(
      'https://api.exchangerate.host/latest?base=USD',
      { cache: 'no-store' }
    )

    const data = await res.json()

    if (!data?.rates) throw new Error()

    return data
  } catch {
    return {
      rates: {
        USD: 1,
        INR: 83,
        AED: 3.67
      }
    }
  }
}

export default async function Home() {
  const { data: prices } = await supabase
    .from('price_history')
    .select('*')

  const { data: products } = await supabase
    .from('products')
    .select('id, name, description, image_url') // ✅ explicit

  const { data: retailers } = await supabase
    .from('retailers')
    .select('*')

  const { data: countries } = await supabase
    .from('countries')
    .select('*')

  console.log('PRODUCTS:', products) // debug

  const rates = await getRates()

  return (
    <Dashboard
      products={products}
      prices={prices}
      retailers={retailers}
      countries={countries}
      rates={rates}
    />
  )
}
