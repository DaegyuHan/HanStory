'use client'
import { useState } from 'react'
import { TAGS } from '../lib/tags'

export default function EntryModal({ date, onClose, onSave, inline = false }: { date: string; onClose: () => void; onSave: (data: { title: string; content: string; tagCode: string }) => void; inline?: boolean }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tagCode, setTagCode] = useState('DEV_LOG')

  if (inline) {
    return (
      <div className="bg-white border rounded p-4 mt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{date} - 새 항목</h3>
          <button onClick={onClose} className="px-3 py-1 border rounded">닫기</button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">태그 (필수)</label>
            <select value={tagCode} onChange={(e) => setTagCode(e.target.value)} className="border p-2 rounded w-full">
              {Object.entries(TAGS).map(([code, t]) => (
                <option key={code} value={code}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">제목</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border p-2 rounded" />
          </div>

          <div>
            <label className="block text-sm mb-1">내용 (Markdown)</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full h-52 border p-2 rounded" />
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={() => onSave({ title, content, tagCode })} className="px-4 py-2 btn-navy rounded">저장</button>
            <button onClick={onClose} className="px-4 py-2 border rounded">취소</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded p-4 max-h-screen overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{date} - 새 항목</h3>
          <button onClick={onClose} className="px-3 py-1 border rounded">닫기</button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">태그 (필수)</label>
            <select value={tagCode} onChange={(e) => setTagCode(e.target.value)} className="border p-2 rounded w-full">
              {Object.entries(TAGS).map(([code, t]) => (
                <option key={code} value={code}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">제목</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border p-2 rounded" />
          </div>

          <div>
            <label className="block text-sm mb-1">내용 (Markdown)</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full h-40 border p-2 rounded" />
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={() => onSave({ title, content, tagCode })} className="px-4 py-2 btn-navy rounded">저장</button>
            <button onClick={onClose} className="px-4 py-2 border rounded">취소</button>
          </div>
        </div>
      </div>
    </div>
  )
}
