'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminPage() {
  const [message, setMessage] = useState('')
const [image, setImage] = useState<File | null>(null)

  const [product, setProduct] = useState('')
  const [description, setDescription] = useState('')
  const [products, setProducts] = useState<any[]>([])

  const [retailer, setRetailer] = useState('')
  const [affiliate, setAffiliate] = useState('')
  const [countryId, setCountryId] = useState('')
  const [countries, setCountries] = useState<any[]>([])
  const [retailers, setRetailers] = useState<any[]>([])

  const [productId, setProductId] = useState('')
  const [retailerId, setRetailerId] = useState('')
  const [price, setPrice] = useState('')
  const [currency, setCurrency] = useState('USD')

  useEffect(() => {
    loadCountries()
    loadProducts()
    loadRetailers()
  }, [])

  async function loadCountries() {
    const { data } = await supabase.from('countries').select('*')
    setCountries(data || [])
  }

  async function loadProducts() {
    const { data } = await supabase.from('products').select('*')
    setProducts(data || [])
  }

  async function loadRetailers() {
    const { data } = await supabase.from('retailers').select('*')
    setRetailers(data || [])
  }

  async function addProduct() {
  let imageUrl = ''

  if (image) {
    const fileName = Date.now() + '-' + image.name

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(fileName, image)

    if (uploadError) {
      setMessage(uploadError.message)
      return
    }

    const { data } = supabase.storage
      .from('products')
      .getPublicUrl(fileName)

    imageUrl = data.publicUrl
  }

  const { error } = await supabase
    .from('products')
    .insert({
      name: product,
      description,
      image_url: imageUrl
    })

  if (error) setMessage(error.message)
  else {
    setMessage('Product added!')
    setProduct('')
    setDescription('')
    setImage(null)
    loadProducts()
  }
}


  async function addRetailer() {
    const { error } = await supabase
      .from('retailers')
      .insert({
        name: retailer,
        affiliate_url: affiliate,
        country_id: countryId
      })

    if (error) setMessage(error.message)
    else {
      setMessage('Retailer added!')
      setRetailer('')
      setAffiliate('')
      setCountryId('')
      loadRetailers()
    }
  }

  async function addPrice() {
    const { error } = await supabase
      .from('price_history')
      .insert({
        product_id: productId,
        retailer_id: retailerId,
        price: Number(price),
        currency
      })

    if (error) setMessage(error.message)
    else {
      setMessage('Price added!')
      setProductId('')
      setRetailerId('')
      setPrice('')
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-10 space-y-10">

      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* PRODUCT */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Add Product</h2>

        <div className="space-y-2">
          <input
            value={product}
            onChange={e => setProduct(e.target.value)}
            placeholder="Product name"
            className="border p-2 rounded w-full"
          />

          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Short description"
            className="border p-2 rounded w-full"
          />

          <button
            onClick={addProduct}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Product
          </button>
        </div>
      </div>

      {/* RETAILER */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Add Retailer</h2>

        <div className="space-y-2">
          <input
            value={retailer}
            onChange={e => setRetailer(e.target.value)}
            placeholder="Retailer name"
            className="border p-2 rounded w-full"
          />

          <input
            value={affiliate}
            onChange={e => setAffiliate(e.target.value)}
            placeholder="Affiliate URL"
            className="border p-2 rounded w-full"
          />

          <select
            value={countryId}
            onChange={e => setCountryId(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">Select country</option>
            {countries.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={addRetailer}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Retailer
          </button>
        </div>
      </div>

      {/* PRICE */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Add Price</h2>

        <div className="space-y-2">
          <select
            value={productId}
            onChange={e => setProductId(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">Select product</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            value={retailerId}
            onChange={e => setRetailerId(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">Select retailer</option>
            {retailers.map(r => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          <input
            value={price}
            onChange={e => setPrice(e.target.value)}
            placeholder="Price"
            className="border p-2 rounded w-full"
          />

          <input
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            placeholder="Currency"
            className="border p-2 rounded w-full"
          />

          <button
            onClick={addPrice}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Price
          </button>
        </div>
      </div>

      <p className="font-semibold">{message}</p>

    </main>
  )
}
