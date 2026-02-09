'use client'
import { useEffect, useState } from 'react'

export default function TrashContent() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/entries?includeDeleted=true')
      .then((r) => r.json())
      .then((d) => {
        const deleted = (d.entries || []).filter((e: any) => e.deletedAt)
        setItems(deleted)
      })
      .finally(() => setLoading(false))
  }, [])

  async function restore(id: string) {
    await fetch(`/api/entries/${id}/restore`, { method: 'POST' })
    setItems((s) => s.filter((x) => x.id !== id))
  }

  async function permanent(id: string) {
    await fetch(`/api/entries/${id}/permanent`, { method: 'DELETE' })
    setItems((s) => s.filter((x) => x.id !== id))
  }

  if (loading) return <div>로딩중...</div>
  if (items.length === 0) return <div className="text-sm text-gray-500">휴지통이 비어 있습니다.</div>

  return (
    <ul className="space-y-3">
      {items.map((e) => (
        <li key={e.id} className="p-3 border rounded flex justify-between items-center">
          <div>
            <div className="font-medium">{e.title}</div>
            <div className="text-sm text-gray-500">{new Date(e.date).toISOString().slice(0, 10)}</div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => restore(e.id)} className="px-3 py-1 bg-green-600 text-white rounded">복구</button>
            <button onClick={() => permanent(e.id)} className="px-3 py-1 bg-red-600 text-white rounded">영구삭제</button>
          </div>
        </li>
      ))}
    </ul>
  )
}
