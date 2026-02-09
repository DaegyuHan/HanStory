import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { verifyAccess } from '../../../lib/jwt'

function parseDate(d: string | null) {
  if (!d) return null
  const dt = new Date(d)
  if (Number.isNaN(dt.getTime())) return null
  return dt
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const from = url.searchParams.get('from')
  const to = url.searchParams.get('to')
  const tagCode = url.searchParams.get('tagCode')
  const includeDeleted = url.searchParams.get('includeDeleted') === 'true'

  let userId: string | null = null
  try {
    const auth = req.headers.get('authorization') || ''
    const m = auth.match(/Bearer (.+)/)
    if (m) {
      const payload: any = verifyAccess(m[1])
      userId = payload.sub
    }
  } catch (err) {}

  if (!userId) {
    const u = await prisma.user.findFirst()
    if (!u) return NextResponse.json({ error: 'no user' }, { status: 401 })
    userId = u.id
  }

  const where: any = { userId }
  if (!includeDeleted) where.deletedAt = null
  const fromDate = parseDate(from)
  const toDate = parseDate(to)
  if (fromDate && toDate) {
    where.date = { gte: fromDate, lte: toDate }
  } else if (fromDate) {
    where.date = { gte: fromDate }
  } else if (toDate) {
    where.date = { lte: toDate }
  }
  if (tagCode) where.tagCode = tagCode

  const entries = await prisma.entry.findMany({ where, orderBy: { date: 'asc' } })
  return NextResponse.json({ entries })
}

export async function POST(req: Request) {
  const body = await req.json()
  const { date, tagCode, title, content } = body

  let userId: string | null = null
  try {
    const auth = req.headers.get('authorization') || ''
    const m = auth.match(/Bearer (.+)/)
    if (m) {
      const payload: any = verifyAccess(m[1])
      userId = payload.sub
    }
  } catch (err) {}
  if (!userId) {
    const u = await prisma.user.findFirst()
    if (!u) return NextResponse.json({ error: 'no user' }, { status: 401 })
    userId = u.id
  }

  const dt = date ? new Date(date) : new Date()
  const entry = await prisma.entry.create({ data: { userId, date: dt, tagCode, title: title || '', content: content || '' } })
  return NextResponse.json({ entry })
}
