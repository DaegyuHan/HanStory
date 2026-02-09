
"use client"
import Link from 'next/link'
import SearchBar from './SearchBar'

export default function Header({ onToggleSidebar, sidebarOpen, onHomeClick }: { onToggleSidebar: () => void; sidebarOpen: boolean; onHomeClick: () => void }) {
  return (
    <header className="bg-white shadow p-4 sticky top-0 z-50">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onToggleSidebar} className="w-10 h-10 -ml-4 flex items-center justify-center" aria-label={sidebarOpen ? '메뉴 숨기기' : '메뉴 보이기'}>
            <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M1 1H21" stroke="#0B2545" strokeWidth="2" strokeLinecap="round" />
              <path d="M1 8H21" stroke="#0B2545" strokeWidth="2" strokeLinecap="round" />
              <path d="M1 15H21" stroke="#0B2545" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <Link href="/" onClick={onHomeClick} className="text-xl font-bold">Jude 개발일지</Link>
        </div>
        <div>
          <SearchBar />
        </div>
      </div>
    </header>
  )
}
