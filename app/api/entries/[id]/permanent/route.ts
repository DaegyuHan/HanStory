import { NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'
import { verifyAccess } from '../../../../../lib/jwt'

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params
  try {
    const auth = req.headers.get('authorization') || ''
    const m = auth.match(/Bearer (.+)/)
    let userId: string | null = null
    if (m) {
      const payload: any = verifyAccess(m[1])
      userId = payload.sub
    } else {
      const u = await prisma.user.findFirst()
      userId = u?.id ?? null
    }
    if (!userId) return NextResponse.json({ error: 'unauth' }, { status: 401 })

    const existing = await prisma.entry.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ error: 'not found' }, { status: 404 })
    if (existing.userId !== userId) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

    await prisma.entry.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: 'error' }, { status: 500 })
  }
}
