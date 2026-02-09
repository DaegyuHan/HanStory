
"use client"
import Link from 'next/link'
import { useState } from 'react'
import TagFilter from './TagFilter'

type MenuKey = 'home' | 'calender' | 'setting'

export default function Sidebar({ selectedTags, onTagChange, onHomeClick }: { selectedTags: string[]; onTagChange: (next: string[]) => void; onHomeClick: () => void }) {
  const [activeMenu, setActiveMenu] = useState<MenuKey>('calender')

  function menuClass(key: MenuKey) {
    const base = 'flex items-center justify-between px-2 py-2 rounded text-sm font-medium'
    const active = key === activeMenu ? 'bg-gray-200 text-navy' : 'text-gray-700'
    const hover = 'hover:bg-gray-100'
    return `${base} ${active} ${hover}`
  }

  return (
    <nav className="h-full p-4 bg-white border-r overflow-y-auto">
      <div className="mt-2 space-y-1">
        <Link href="/" onClick={() => { setActiveMenu('home'); onHomeClick() }} className={menuClass('home')}>Home</Link>
        <Link href="/" onClick={() => { setActiveMenu('calender'); onHomeClick() }} className={menuClass('calender')}>Calender</Link>
        <button onClick={() => setActiveMenu('setting')} className={menuClass('setting')} type="button">Setting</button>
      </div>
      <div className="mt-6">
        <TagFilter selectedTags={selectedTags} onChange={onTagChange} />
      </div>
    </nav>
  )
}
