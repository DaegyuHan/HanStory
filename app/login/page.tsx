'use client'
import { useState } from 'react'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-6 rounded shadow">
        <h1 className="text-xl font-bold mb-4">Jude 개발일지 로그인</h1>
        <input className="w-full mb-2 p-2 border rounded" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" className="w-full mb-4 p-2 border rounded" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full btn-navy py-2 rounded">로그인</button>
      </form>
    </div>
  )
}
