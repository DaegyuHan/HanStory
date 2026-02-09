'use client'
import Header from '../../components/Header'
import Sidebar from '../../components/Sidebar'
import SearchResults from '../../components/SearchResults'

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <aside className="w-64">
          <Sidebar />
        </aside>
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-semibold">검색 결과</h2>
          <div className="mt-4">
            <SearchResults />
          </div>
        </main>
      </div>
    </div>
  )
}
