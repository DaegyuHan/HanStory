'use client'
import Header from '../../components/Header'
import Sidebar from '../../components/Sidebar'
import TrashContent from '../../components/TrashContent'

export default function TrashPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <aside className="w-64">
          <Sidebar />
        </aside>
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-semibold">휴지통</h2>
          <div className="mt-4">
            <TrashContent />
          </div>
        </main>
      </div>
    </div>
  )
}
