'use client'

import { useEffect, useState } from 'react'

export default function DarkToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('dark')
    if (saved === 'true') {
      document.documentElement.classList.add('dark')
      setDark(true)
    }
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    localStorage.setItem('dark', String(next))

    document.documentElement.classList.toggle('dark')
  }

  return (
    <button
      onClick={toggle}
      className="px-4 py-2 rounded bg-black text-white dark:bg-white dark:text-black"
    >
      {dark ? '☀ Light' : '🌙 Dark'}
    </button>
  )
}
