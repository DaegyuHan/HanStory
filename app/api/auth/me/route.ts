import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import jwt from 'jsonwebtoken'

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access-secret'

export async function GET(req: Request) {
  const auth = req.headers.get('authorization') || ''
  const m = auth.match(/Bearer (.+)/)
  if (!m) return NextResponse.json({ user: null })
  try {
    const payload: any = jwt.verify(m[1], ACCESS_SECRET)
    const user = await prisma.user.findUnique({ where: { id: payload.sub } })
    if (!user) return NextResponse.json({ user: null })
    return NextResponse.json({ user: { id: user.id, username: user.username } })
  } catch (err) {
    return NextResponse.json({ user: null })
  }
}
