"use client"
import { useState } from 'react'
import Header from '../../components/Header'
import Sidebar from '../../components/Sidebar'
import TrashContent from '../../components/TrashContent'
import { TAGS } from '../../lib/tags'

export default function TrashPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedTags, setSelectedTags] = useState<string[]>(() => Object.keys(TAGS))

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onToggleSidebar={() => setSidebarOpen((s) => !s)}
        sidebarOpen={sidebarOpen}
        onHomeClick={() => {}}
      />
      <div className="flex">
        <aside className={`fixed left-0 top-16 bottom-0 w-64 transition-transform duration-500 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <Sidebar selectedTags={selectedTags} onTagChange={setSelectedTags} onHomeClick={() => {}} />
        </aside>
        <main className={`flex-1 py-6 pr-6 transition-[padding-left] duration-500 ease-in-out ${sidebarOpen ? 'pl-[18rem]' : 'pl-6'}`}>
          <h2 className="text-2xl font-semibold">휴지통</h2>
          <div className="mt-4">
            <TrashContent />
          </div>
        </main>
      </div>
    </div>
  )
}
