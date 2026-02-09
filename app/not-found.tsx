import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">페이지를 찾을 수 없습니다</h2>
        <p className="text-gray-600 mb-4">요청한 페이지가 존재하지 않습니다.</p>
        <Link href="/" className="px-4 py-2 btn-navy rounded">
          홈으로
        </Link>
      </div>
    </div>
  )
}
