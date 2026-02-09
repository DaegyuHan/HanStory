'use client'
import { useEffect, useState } from 'react'

export default function EntryEditor({ id, onClose, onSaved, inline = false }: { id: string; onClose: () => void; onSaved?: () => void; inline?: boolean }) {
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tagCode, setTagCode] = useState('DEV_LOG')

  useEffect(() => {
    let mounted = true
    fetch(`/api/entries/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return
        const e = data.entry
        setTitle(e.title || '')
        setContent(e.content || '')
        setTagCode(e.tagCode || 'DEV_LOG')
      })
      .finally(() => setLoading(false))
    return () => {
      mounted = false
    }
  }, [id])

  async function save() {
    await fetch(`/api/entries/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, content, tagCode }) })
    onSaved?.()
    onClose()
  }

  async function softDelete() {
    await fetch(`/api/entries/${id}`, { method: 'DELETE' })
    onSaved?.()
    onClose()
  }

  if (loading) return <div className={inline ? 'bg-white border rounded p-4 mt-4' : 'p-4'}>로딩중...</div>

  if (inline) {
    return (
      <div className="bg-white border rounded p-4 mt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">게시글 편집</h3>
          <button onClick={onClose} className="px-3 py-1 border rounded">닫기</button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">태그</label>
            <input value={tagCode} onChange={(e) => setTagCode(e.target.value)} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm mb-1">제목</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm mb-1">내용</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full h-56 border p-2 rounded" />
          </div>

          <div className="flex justify-between">
            <div>
              <button onClick={softDelete} className="px-3 py-2 bg-red-600 text-white rounded">삭제 (휴지통)</button>
            </div>
            <div className="flex gap-2">
              <button onClick={save} className="px-3 py-2 btn-navy rounded">저장</button>
              <button onClick={onClose} className="px-3 py-2 border rounded">취소</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded p-4 max-h-screen overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">게시글 편집</h3>
          <button onClick={onClose} className="px-3 py-1 border rounded">닫기</button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">태그</label>
            <input value={tagCode} onChange={(e) => setTagCode(e.target.value)} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm mb-1">제목</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm mb-1">내용</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full h-48 border p-2 rounded" />
          </div>

          <div className="flex justify-between">
            <div>
              <button onClick={softDelete} className="px-3 py-2 bg-red-600 text-white rounded">삭제 (휴지통)</button>
            </div>
            <div className="flex gap-2">
              <button onClick={save} className="px-3 py-2 btn-navy rounded">저장</button>
              <button onClick={onClose} className="px-3 py-2 border rounded">취소</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
