'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

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
    if (!supabase) return
    loadCountries()
    loadProducts()
    loadRetailers()
  }, [])

  async function loadCountries() {
    if (!supabase) return
    const { data } = await supabase.from('countries').select('*')
    setCountries(data || [])
  }

  async function loadProducts() {
    if (!supabase) return
    const { data } = await supabase.from('products').select('*')
    setProducts(data || [])
  }

  async function loadRetailers() {
    if (!supabase) return
    const { data } = await supabase.from('retailers').select('*')
    setRetailers(data || [])
  }

  async function addProduct() {
    if (!supabase) return
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
    if (!supabase) return

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
    if (!supabase) return

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
      <p className="font-semibold">{message}</p>
    </main>
  )
}
