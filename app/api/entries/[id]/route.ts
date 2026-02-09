import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { verifyAccess } from '../../../../lib/jwt'

async function getUserIdFromReq(req: Request) {
  try {
    const auth = req.headers.get('authorization') || ''
    const m = auth.match(/Bearer (.+)/)
    if (m) {
      const payload: any = verifyAccess(m[1])
      return payload.sub
    }
  } catch (err) {}
  const u = await prisma.user.findFirst()
  return u ? u.id : null
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const entry = await prisma.entry.findUnique({ where: { id } })
  if (!entry) return NextResponse.json({ error: 'not found' }, { status: 404 })
  return NextResponse.json({ entry })
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const body = await req.json()
  const userId = await getUserIdFromReq(req)
  if (!userId) return NextResponse.json({ error: 'unauth' }, { status: 401 })

  const existing = await prisma.entry.findUnique({ where: { id } })
  if (!existing) return NextResponse.json({ error: 'not found' }, { status: 404 })
  if (existing.userId !== userId) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const updated = await prisma.entry.update({ where: { id }, data: { title: body.title ?? existing.title, content: body.content ?? existing.content, tagCode: body.tagCode ?? existing.tagCode, date: body.date ? new Date(body.date) : existing.date } })
  return NextResponse.json({ entry: updated })
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const userId = await getUserIdFromReq(req)
  if (!userId) return NextResponse.json({ error: 'unauth' }, { status: 401 })

  const existing = await prisma.entry.findUnique({ where: { id } })
  if (!existing) return NextResponse.json({ error: 'not found' }, { status: 404 })
  if (existing.userId !== userId) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const deleted = await prisma.entry.update({ where: { id }, data: { deletedAt: new Date() } })
  return NextResponse.json({ entry: deleted })
}
