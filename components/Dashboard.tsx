'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SearchBar from './SearchBar'
import { motion } from 'framer-motion'
import PriceGraph from './PriceGraph'
import { US, IN, AE } from 'country-flag-icons/react/3x2'

function Flag({ country }: any) {
  if (country === 'India') return <IN className="w-6 h-4 inline" />
  if (country === 'USA') return <US className="w-6 h-4 inline" />
  if (country === 'UAE') return <AE className="w-6 h-4 inline" />
  return null
}

export default function Dashboard({
  products,
  prices,
  retailers,
  countries,
  rates
}: any) {

  const [query, setQuery] = useState('')
  const [countryFilter, setCountryFilter] = useState('All')
  const [retailerFilter, setRetailerFilter] = useState('All')
  const [brandFilter, setBrandFilter] = useState('All')
  const [sortMode, setSortMode] = useState('cheap')

  const router = useRouter()

  const brands = Array.from(
    new Set(products.map((p: any) => p.name.split(' ')[0]))
  )

  const enriched = products.map((product: any) => {

    const productPrices = prices.filter(
      (p: any) => p.product_id === product.id
    )

    if (productPrices.length === 0) return null

    const countryMap: any = {}

    productPrices.forEach((p: any) => {
      const retailer = retailers.find((r: any) => r.id === p.retailer_id)
      const country = countries.find((c: any) => c.id === retailer?.country_id)
      if (!country) return

      const rate = rates.rates[p.currency] || 1
      const usdPrice = p.price / rate

      if (!countryMap[country.name] || usdPrice < countryMap[country.name].usd) {
        countryMap[country.name] = {
          price: p.price,
          currency: p.currency,
          usd: usdPrice,
          retailer: retailer?.name
        }
      }
    })

    const countryList = Object.entries(countryMap).sort(
      (a: any, b: any) => a[1].usd - b[1].usd
    )

    const bestCountry = countryList[0]

    return { product, productPrices, countryList, bestCountry }
  }).filter(Boolean)

  let filtered = enriched.filter((item: any) =>
    item.product.name.toLowerCase().includes(query.toLowerCase())
  )

  if (countryFilter !== 'All') {
    filtered = filtered.filter(
      (item: any) => item.bestCountry[0] === countryFilter
    )
  }

  if (retailerFilter !== 'All') {
    filtered = filtered.filter(
      (item: any) => item.bestCountry[1].retailer === retailerFilter
    )
  }

  if (brandFilter !== 'All') {
    filtered = filtered.filter(
      (item: any) => item.product.name.startsWith(brandFilter)
    )
  }

  filtered.sort((a: any, b: any) =>
    sortMode === 'cheap'
      ? a.bestCountry[1].usd - b.bestCountry[1].usd
      : b.bestCountry[1].usd - a.bestCountry[1].usd
  )

  return (
    <main className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <section className="bg-white shadow p-4 sm:p-6">
        <h1 className="text-2xl sm:text-4xl font-bold text-center mb-4">
          Global Price Atlas
        </h1>
        <SearchBar setQuery={setQuery} />
      </section>

      {/* MOBILE FILTER BAR */}
      <section className="bg-white p-3 border-b sm:hidden grid grid-cols-2 gap-2">
        <select className="border p-2" onChange={e => setCountryFilter(e.target.value)}>
          <option>All</option>
          <option>India</option>
          <option>USA</option>
          <option>UAE</option>
        </select>

        <select className="border p-2" onChange={e => setSortMode(e.target.value)}>
          <option value="cheap">Cheapest</option>
          <option value="expensive">Expensive</option>
        </select>
      </section>

      <div className="flex">

        {/* DESKTOP SIDEBAR */}
        <aside className="hidden sm:block w-64 bg-white border-r p-6 space-y-6">

          <div>
            <h2 className="font-semibold mb-2">Country</h2>
            <select className="w-full border p-2"
              value={countryFilter}
              onChange={e => setCountryFilter(e.target.value)}>
              <option>All</option>
              <option>India</option>
              <option>USA</option>
              <option>UAE</option>
            </select>
          </div>

          <div>
            <h2 className="font-semibold mb-2">Retailer</h2>
            <select className="w-full border p-2"
              value={retailerFilter}
              onChange={e => setRetailerFilter(e.target.value)}>
              <option>All</option>
              {retailers.map((r: any) => (
                <option key={r.id}>{r.name}</option>
              ))}
            </select>
          </div>

          <div>
            <h2 className="font-semibold mb-2">Brand</h2>
            <select className="w-full border p-2"
              value={brandFilter}
              onChange={e => setBrandFilter(e.target.value)}>
              <option>All</option>
              {brands.map((b: any) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </div>

          <div>
            <h2 className="font-semibold mb-2">Sort</h2>
            <select className="w-full border p-2"
              value={sortMode}
              onChange={e => setSortMode(e.target.value)}>
              <option value="cheap">Cheapest First</option>
              <option value="expensive">Most Expensive</option>
            </select>
          </div>

        </aside>

        {/* GRID */}
        <section className="
          flex-1 p-4 sm:p-8
          grid grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          gap-6
        ">

          {filtered.map((item: any) => (
            <motion.div
              key={item.product.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow p-4"
            >

              {item.product.image_url && (
                <img
                  src={item.product.image_url}
                  alt={item.product.name}
                  className="w-full h-40 object-cover rounded mb-3 cursor-pointer"
                  onClick={() => router.push(`/product/${item.product.id}`)}
                />
              )}

              <h3
                className="font-semibold mb-2 underline cursor-pointer"
                onClick={() => router.push(`/product/${item.product.id}`)}
              >
                {item.product.name}
              </h3>

              <div className="h-28 overflow-hidden mb-3">
                <PriceGraph prices={item.productPrices} />
              </div>

              <table className="w-full text-sm border mt-2">
                <tbody>
                  {item.countryList.map(([name, info]: any, i: number) => (
                    <tr key={i}
                      className={name === item.bestCountry[0]
                        ? 'bg-green-100 font-semibold'
                        : ''}>
                      <td className="p-1 flex items-center gap-2">
                        <Flag country={name} />
                        {name}
                        {name === item.bestCountry[0] && (
                          <span className="ml-2 text-xs bg-green-500 text-white px-2 rounded">
                            Cheapest
                          </span>
                        )}
                      </td>

                      <td className="p-1 text-right">
                        {info.price} {info.currency}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </motion.div>
          ))}

        </section>
      </div>
    </main>
  )
}
