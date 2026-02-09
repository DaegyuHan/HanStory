'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchBar() {
  const [q, setQ] = useState('')
  const router = useRouter()

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    router.push(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="검색 (제목/내용)" className="border px-3 py-1.5 rounded w-56" />
      <button className="px-3 py-1.5 btn-navy rounded">검색</button>
    </form>
  )
}
