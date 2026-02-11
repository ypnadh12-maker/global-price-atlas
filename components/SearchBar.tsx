'use client'

export default function SearchBar({ setQuery }: any) {
  return (
    <input
      placeholder="Search products..."
      onChange={e => setQuery(e.target.value)}
      className="w-full p-3 rounded border mb-8 text-black"
    />
  )
}
