import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import bcrypt from 'bcrypt'
import { signAccess, signRefresh } from '../../../../lib/jwt'

export async function POST(req: Request) {
  const { username, password } = await req.json()
  const user = await prisma.user.findUnique({ where: { username } })
  if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

  const accessToken = signAccess({ sub: user.id })
  const refreshToken = signRefresh({ sub: user.id })

  const res = NextResponse.json({ ok: true })
  res.headers.append('Set-Cookie', `jid=${refreshToken}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict`)
  res.headers.set('Authorization', `Bearer ${accessToken}`)
  return res
}
