import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = url.searchParams.get('q') || ''
  if (!q) return NextResponse.json({ entries: [] })

  const entries = await prisma.entry.findMany({ where: { OR: [{ title: { contains: q, mode: 'insensitive' } }, { content: { contains: q, mode: 'insensitive' } }], deletedAt: null }, orderBy: { date: 'desc' } })
  return NextResponse.json({ entries })
}
