'use client'

export default function RunButton() {
  return (
    <button
      onClick={async () => {
        await fetch('/api/run-scraper', { method: 'POST' })
        alert('Scraper started!')
      }}
      style={{
        padding: 12,
        background: 'black',
        color: 'white',
        borderRadius: 8,
        marginBottom: 20
      }}
    >
      Run Scraper Now
    </button>
  )
}
