'use client'

export default function BuyButton({
  productId,
  retailerId,
  url
}: any) {
  async function handleClick() {
    await fetch('/api/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: productId,
        retailer_id: retailerId
      })
    })

    window.open(url, '_blank')
  }

  return (
    <button
      onClick={handleClick}
      style={{
        marginLeft: 10,
        padding: '6px 12px',
        background: 'green',
        color: 'white',
        borderRadius: 6,
        border: 'none',
        cursor: 'pointer'
      }}
    >
      Buy
    </button>
  )
}
