
'use client'
import { TAGS } from '../lib/tags'

export default function TagFilter({ selectedTags, onChange }: { selectedTags: string[]; onChange: (next: string[]) => void }) {
  function toggle(code: string) {
    if (selectedTags.includes(code)) {
      onChange(selectedTags.filter((t) => t !== code))
    } else {
      onChange([...selectedTags, code])
    }
  }

  return (
    <div className="space-y-2">
      <div className="text-sm font-semibold">태그 필터</div>
      <div className="space-y-2">
        {Object.entries(TAGS).map(([code, t]) => {
          const checked = selectedTags.includes(code)
          return (
            <label key={code} className="flex items-center justify-between gap-3 px-2 py-1 border rounded text-sm cursor-pointer">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ background: t.color }} />
                <span>{t.label}</span>
              </span>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(code)}
                className="w-4 h-4"
              />
            </label>
          )
        })}
      </div>
    </div>
  )
}
