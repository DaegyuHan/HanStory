'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function SearchResults() {
  const params = useSearchParams()
  const q = params.get('q') || ''
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(!!q)

  useEffect(() => {
    if (!q) {
      setLoading(false)
      return
    }
    fetch(`/api/search?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((d) => {
        setResults(d.entries || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [q])

  if (!q) return <div className="text-sm text-gray-500">검색어를 입력하세요.</div>
  if (loading) return <div>검색중...</div>
  if (results.length === 0) return <div className="text-sm text-gray-500">검색 결과가 없습니다.</div>

  return (
    <ul className="space-y-3">
      {results.map((e: any) => (
        <li key={e.id} className="p-3 border rounded">
          <div className="font-medium">{e.title}</div>
          <div className="text-sm text-gray-500">{new Date(e.date).toISOString().slice(0, 10)}</div>
        </li>
      ))}
    </ul>
  )
}
