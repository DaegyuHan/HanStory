'use client'
import { TAGS } from '../lib/tags'

export default function DayList({ date, entries, onClose, onCreate, onEdit, inline = false }: { date: string; entries: Array<{ id: string; title: string; tagCode: string; content?: string }>; onClose: () => void; onCreate: () => void; onEdit?: (id: string) => void; inline?: boolean }) {
  if (inline) {
    return (
      <div className="bg-white border rounded p-4 mt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{date}의 항목</h3>
          <div className="flex items-center gap-2">
            <button onClick={onCreate} className="px-3 py-1 btn-navy rounded">새 글 작성</button>
            <button onClick={onClose} className="px-3 py-1 border rounded">닫기</button>
          </div>
        </div>

        {entries.length === 0 && <div className="text-sm text-gray-500">해당 날짜에 게시물이 없습니다.</div>}

        <ul className="space-y-3">
        {entries.map((e) => (
          <li key={e.id} className="p-3 border rounded flex items-start gap-3 cursor-pointer hover:bg-gray-50" onClick={() => onEdit?.(e.id)}>
            <div className="w-3 h-3 rounded-full mt-1" style={{ background: TAGS[e.tagCode]?.color }} />
            <div className="flex-1">
              <div className="font-medium">{e.title}</div>
              <div className="text-xs text-gray-500">{TAGS[e.tagCode]?.label}</div>
              {e.content && <div className="text-sm text-gray-600 mt-1 whitespace-pre-wrap break-words">{e.content}</div>}
            </div>
          </li>
        ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end md:items-center justify-center z-40">
      <div className="bg-white w-full md:w-3/5 h-3/4 rounded-t-lg md:rounded-lg p-4 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{date}의 항목</h3>
          <div className="flex items-center gap-2">
            <button onClick={onCreate} className="px-3 py-1 btn-navy rounded">새 글 작성</button>
            <button onClick={onClose} className="px-3 py-1 border rounded">닫기</button>
          </div>
        </div>

        {entries.length === 0 && <div className="text-sm text-gray-500">해당 날짜에 게시물이 없습니다.</div>}

        <ul className="space-y-3">
          {entries.map((e) => (
            <li key={e.id} className="p-3 border rounded flex items-start gap-3 cursor-pointer hover:bg-gray-50" onClick={() => onEdit?.(e.id)}>
              <div className="w-3 h-3 rounded-full mt-1" style={{ background: TAGS[e.tagCode]?.color }} />
              <div>
                <div className="font-medium">{e.title}</div>
                <div className="text-xs text-gray-500">{TAGS[e.tagCode]?.label}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
