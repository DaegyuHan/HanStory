'use client'
import { useEffect, useMemo, useState } from 'react'
import DayList from './DayList'
import EntryModal from './EntryModal'
import EntryEditor from './EntryEditor'
import { TAGS } from '../lib/tags'

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

function formatDateKey(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

type EntryMap = Record<string, Array<{ id: string; title: string; tagCode: string; content?: string }>>

export default function Calendar({ selectedTags = [], homeSignal = 0 }: { selectedTags?: string[]; homeSignal?: number }) {
  const [viewDate, setViewDate] = useState(() => startOfMonth(new Date()))
  const [monthAnimating, setMonthAnimating] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showEntryModal, setShowEntryModal] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null)
  const [showMonthPicker, setShowMonthPicker] = useState(false)
  const [pickerYear, setPickerYear] = useState<number>(viewDate.getFullYear())
  const [pickerMonth, setPickerMonth] = useState<number>(viewDate.getMonth() + 1)

  const [mockEntries, setMockEntries] = useState<EntryMap>(() => {
    // sample in-memory entries for design preview (one per tag for today)
    const today = new Date()
    const key = formatDateKey(today)
    const map: EntryMap = {}
    const sampleTitles: Record<string, string> = {
      DEV_LOG: 'OAuth 로그인 리팩터링 완료 및 회고',
      TODO: '릴리스 전 체크리스트 검토',
      DEV_PLAN: '다음 주 스프린트: 태그 필터 개선 계획',
    }
    const sampleContents: Record<string, string> = {
      DEV_LOG:
        '오늘은 OAuth 로그인 흐름을 리팩터링했습니다. 주요 변경사항: 리프레시 토큰 처리 개선, 예외 처리 보완, 토큰 만료 시 UX 가이드 추가. 다음에는 관련 통합 테스트를 작성할 예정입니다.',
      TODO:
        '다음 배포 전 확인할 항목을 정리했습니다: 데이터 마이그레이션, 환경변수 검증, CDN 캐시 무효화, 모니터링 알림 확인, 백업 스냅샷 생성.',
      DEV_PLAN:
        '목표: 태그 검색 성능 개선 및 UI 개선. 작업 항목: 1) 인덱스 추가 2) 태그 자동완성 3) 클라이언트 캐싱 정책 검토 4) 로드 테스트.',
    }
    for (const code of Object.keys(TAGS)) {
      map[key] = map[key] || []
      map[key].push({ id: `sample-${code}`, title: sampleTitles[code] || `샘플 - ${TAGS[code].label}`, tagCode: code, content: sampleContents[code] || `자동 생성된 샘플 게시물 (태그: ${TAGS[code].label})` })
    }
    return map
  })

  useMemo(() => {
    const from = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1)
    const to = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0)
    const fromStr = formatDateKey(from)
    const toStr = formatDateKey(to)
    fetch(`/api/entries?from=${fromStr}&to=${toStr}`)
      .then((r) => r.json())
        .then((data) => {
          const map: Record<string, Array<{ id: string; title: string; tagCode: string; content?: string }>> = {}
          for (const e of data.entries || []) {
            const key = formatDateKey(new Date(e.date))
            map[key] = map[key] || []
            map[key].push({ id: e.id, title: e.title, tagCode: e.tagCode, content: e.content })
          }
          // only replace mockEntries if backend returned entries; otherwise keep in-memory samples
          if ((data.entries || []).length > 0) setMockEntries(map)
        })
      .catch(() => {})
  }, [viewDate])

  const monthMatrix = useMemo(() => {
    const start = startOfMonth(viewDate)
    const end = endOfMonth(viewDate)
    const startDay = start.getDay()
    const days: (Date | null)[] = []
    for (let i = 0; i < startDay; i++) days.push(null)
    for (let d = 1; d <= end.getDate(); d++) days.push(new Date(viewDate.getFullYear(), viewDate.getMonth(), d))
    while (days.length % 7 !== 0) days.push(null)
    const weeks: (Date | null)[][] = []
    for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7))
    return weeks
  }, [viewDate])

  function prevMonth() {
    setMonthAnimating(true)
    setTimeout(() => {
      setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
      setMonthAnimating(false)
    }, 200)
  }

  function nextMonth() {
    setMonthAnimating(true)
    setTimeout(() => {
      setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))
      setMonthAnimating(false)
    }, 200)
  }

  function goToday() {
    setMonthAnimating(true)
    setTimeout(() => {
      setViewDate(startOfMonth(new Date()))
      setMonthAnimating(false)
    }, 200)
  }

  useEffect(() => {
    if (homeSignal > 0) goToday()
  }, [homeSignal])

  function handleCellClick(key: string) {
    if (selectedDate === key) {
      setSelectedDate(null)
      return
    }
    setSelectedDate(key)
    // show inline DayList immediately (no animation)
  }

  function handleCellMouseEnter(e: React.MouseEvent<HTMLDivElement>) {
    const container = e.currentTarget.querySelector('.cell-entries') as HTMLDivElement | null
    const inner = e.currentTarget.querySelector('.cell-entries-inner') as HTMLDivElement | null
    if (!container || !inner) return
    const diff = inner.scrollHeight - container.clientHeight
    if (diff > 0) {
      container.classList.add('cell-scroll-animate')
      container.style.setProperty('--scroll-distance', `${diff}px`)
      const duration = Math.max(4, Math.min(18, diff / 8))
      container.style.setProperty('--scroll-duration', `${duration}s`)
    } else {
      container.classList.remove('cell-scroll-animate')
      container.style.removeProperty('--scroll-distance')
      container.style.removeProperty('--scroll-duration')
    }
  }

  function handleCellMouseLeave(e: React.MouseEvent<HTMLDivElement>) {
    const container = e.currentTarget.querySelector('.cell-entries') as HTMLDivElement | null
    if (!container) return
    container.classList.remove('cell-scroll-animate')
    container.style.removeProperty('--scroll-distance')
    container.style.removeProperty('--scroll-duration')
  }

  return (
    <div className="calendar-card p-4">
      <div className="flex items-center justify-between mb-4 relative">
        <div />

        <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
          <div className="cursor-pointer select-none" onClick={() => { setShowMonthPicker((s) => !s); setPickerYear(viewDate.getFullYear()); setPickerMonth(viewDate.getMonth() + 1) }}>
            <div className="text-sm text-gray-500">{viewDate.getFullYear()}</div>
            <div className="text-4xl font-extrabold text-navy">{String(viewDate.getMonth() + 1)}월</div>
          </div>
          {showMonthPicker && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white border p-3 rounded shadow z-50 w-48">
              <div className="flex items-center justify-between mb-2">
                <button className="px-2 py-1 border rounded" onClick={() => setPickerYear((y) => y - 1)}>-</button>
                <div className="text-sm font-medium">{pickerYear}</div>
                <button className="px-2 py-1 border rounded" onClick={() => setPickerYear((y) => y + 1)}>+</button>
              </div>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <button key={m} onClick={() => setPickerMonth(m)} className={`px-2 py-1 rounded text-sm ${pickerMonth === m ? 'bg-gray-200 font-semibold' : 'bg-white'}`}>{String(m).padStart(2, '0')}</button>
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <button className="px-2 py-1 border rounded" onClick={() => setShowMonthPicker(false)}>닫기</button>
                <button className="px-2 py-1 btn-navy rounded" onClick={() => { setViewDate(new Date(pickerYear, pickerMonth - 1, 1)); setShowMonthPicker(false) }}>이동</button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="px-3 py-1 bg-white border rounded">◀</button>
          <button onClick={goToday} className="px-3 py-1 btn-navy rounded">오늘</button>
          <button onClick={nextMonth} className="px-3 py-1 bg-white border rounded">▶</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-sm mt-6">
        {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
          <div key={d} className="text-center font-medium py-1">{d}</div>
        ))}
      </div>

      <div className={`grid grid-cols-7 gap-1 mt-2 month-transition ${monthAnimating ? 'month-transition--anim' : ''}`}>
        {monthMatrix.flat().map((cell, idx) => {
          if (!cell) return <div key={idx} className="h-28 bg-white border p-1"></div>
          const key = formatDateKey(cell)
          const entriesAll = mockEntries[key] || []
          const entries = selectedTags.length > 0 ? entriesAll.filter((e) => selectedTags.includes(e.tagCode)) : entriesAll
          const isToday = formatDateKey(new Date()) === key
          const dayOfWeek = cell.getDay()
          let dateClass = 'text-sm'
          if (isToday) dateClass += ' text-navy font-semibold'
          else if (dayOfWeek === 0) dateClass += ' text-red-500'
          else if (dayOfWeek === 6) dateClass += ' text-blue-500'
          const isSelected = selectedDate === key
          const wrapperClass = `h-28 bg-white p-2 flex flex-col cursor-pointer calendar-day-hover ${isSelected ? 'selected-3d' : isToday ? 'today-3d' : 'border'} hover:bg-gray-50`
          return (
            <div
              key={key}
              className={wrapperClass}
              onClick={() => handleCellClick(key)}
              onMouseEnter={handleCellMouseEnter}
              onMouseLeave={handleCellMouseLeave}
            >
              <div className="flex justify-between items-start">
                <div className={dateClass}>{cell.getDate()}</div>
              </div>
              <div className="mt-1 flex-1 overflow-hidden cell-entries">
                <div className="cell-entries-inner">
                  {entries.map((e) => (
                    <div key={e.id} className="text-xs mt-1 flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full mt-1" style={{ background: TAGS[e.tagCode]?.color || '#ccc' }} />
                      <span className="truncate leading-snug">{e.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {selectedDate && (
        <DayList
          inline
          date={selectedDate}
          entries={selectedTags.length > 0 ? (mockEntries[selectedDate] || []).filter((e) => selectedTags.includes(e.tagCode)) : (mockEntries[selectedDate] || [])}
          onClose={() => setSelectedDate(null)}
          onCreate={() => setShowEntryModal(true)}
          onEdit={(id) => setSelectedEntry(id)}
        />
      )}

      {showEntryModal && selectedDate && (
        <EntryModal
          date={selectedDate}
          inline
          onClose={() => setShowEntryModal(false)}
          onSave={async (data) => {
            await fetch('/api/entries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ date: selectedDate, ...data }) })
            const from = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1)
            const to = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0)
            const fromStr = formatDateKey(from)
            const toStr = formatDateKey(to)
            const r = await fetch(`/api/entries?from=${fromStr}&to=${toStr}`)
            const data2 = await r.json()
            const map: Record<string, Array<{ id: string; title: string; tagCode: string; content?: string }>> = {}
            for (const e of data2.entries || []) {
              const key = formatDateKey(new Date(e.date))
              map[key] = map[key] || []
              map[key].push({ id: e.id, title: e.title, tagCode: e.tagCode, content: e.content })
            }
            setMockEntries(map)
            setShowEntryModal(false)
          }}
        />
      )}

      {selectedEntry && (
        <EntryEditor
          id={selectedEntry}
          inline
          onClose={() => setSelectedEntry(null)}
          onSaved={async () => {
            const from = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1)
            const to = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0)
            const fromStr = formatDateKey(from)
            const toStr = formatDateKey(to)
            const r = await fetch(`/api/entries?from=${fromStr}&to=${toStr}`)
            const data2 = await r.json()
            const map: Record<string, Array<{ id: string; title: string; tagCode: string; content?: string }>> = {}
            for (const e of data2.entries || []) {
              const key = formatDateKey(new Date(e.date))
              map[key] = map[key] || []
              map[key].push({ id: e.id, title: e.title, tagCode: e.tagCode, content: e.content })
            }
            setMockEntries(map)
          }}
        />
      )}
    </div>
  )
}
