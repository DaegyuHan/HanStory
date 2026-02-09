

"use client"
import { useState } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Calendar from '../components/Calendar'
import { TAGS } from '../lib/tags'

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedTags, setSelectedTags] = useState<string[]>(() => Object.keys(TAGS))
  const [homeSignal, setHomeSignal] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onToggleSidebar={() => setSidebarOpen((s) => !s)}
        sidebarOpen={sidebarOpen}
        onHomeClick={() => setHomeSignal((v) => v + 1)}
      />
      <div className="flex">
        <aside className={`fixed left-0 top-16 bottom-0 w-64 transition-transform duration-500 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <Sidebar selectedTags={selectedTags} onTagChange={setSelectedTags} onHomeClick={() => setHomeSignal((v) => v + 1)} />
        </aside>
        <main className={`flex-1 py-6 pr-6 transition-[padding-left] duration-500 ease-in-out ${sidebarOpen ? 'pl-[18rem]' : 'pl-6'}`}>
          <h2 className="text-2xl font-semibold">Calendar</h2>
          <div className="mt-4 bg-transparent">
            <Calendar selectedTags={selectedTags} homeSignal={homeSignal} />
          </div>
        </main>
      </div>
    </div>
  )
}
