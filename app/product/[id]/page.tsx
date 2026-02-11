import { supabase } from '../../../lib/supabase'
import PriceGraph from '../../../components/PriceGraph'
import SubscribeButton from '../../../components/SubscribeButton'
import BuyButton from '../../../components/BuyButton'

export default async function ProductPage({ params }: any) {
  const { id } = await params

  // fetch product
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  // fetch prices
  const { data: prices } = await supabase
    .from('price_history')
    .select('*')
    .eq('product_id', id)
    .order('recorded_at', { ascending: true })

  // fetch retailers
  const { data: retailers } = await supabase
    .from('retailers')
    .select('*')

  if (!product) {
    return <h1>Product not found</h1>
  }

  return (
    <main style={{ padding: 40, maxWidth: 900, margin: '0 auto' }}>

      {/* IMAGE */}
      {product.image_url && (
        <img
          src={product.image_url}
          alt={product.name}
          style={{
            width: '100%',
            maxHeight: 300,
            objectFit: 'cover',
            borderRadius: 10,
            marginBottom: 20
          }}
        />
      )}

      {/* TITLE */}
      <h1 style={{ marginBottom: 10 }}>{product.name}</h1>

      <SubscribeButton productId={product.id} />

      {/* DESCRIPTION */}
      {product.description && (
        <p style={{ margin: '20px 0' }}>{product.description}</p>
      )}

      {/* PRICE GRAPH */}
      <PriceGraph prices={prices || []} />

      {/* BUY OPTIONS */}
      <h2 style={{ marginTop: 30 }}>Buy Options</h2>

      {prices?.map((p: any, i: number) => {
        const retailer = retailers?.find(
          (r: any) => r.id === p.retailer_id
        )

        return (
          <div key={i} style={{ marginBottom: 12 }}>
            {p.price} {p.currency}

            {retailer?.affiliate_url && (
              <BuyButton
                productId={product.id}
                retailerId={retailer.id}
                url={retailer.affiliate_url}
              />
            )}
          </div>
        )
      })}

    </main>
  )
}
