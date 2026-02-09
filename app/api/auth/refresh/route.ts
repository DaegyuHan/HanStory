import { NextResponse } from 'next/server'
import { verifyRefresh, signAccess } from '../../../../lib/jwt'

export async function POST(req: Request) {
  const cookie = req.headers.get('cookie') || ''
  const match = cookie.match(/jid=([^;]+)/)
  if (!match) return NextResponse.json({ error: 'No refresh token' }, { status: 401 })
  const token = match[1]
  try {
    const payload: any = verifyRefresh(token)
    const access = signAccess({ sub: payload.sub })
    return NextResponse.json({ access })
  } catch (err) {
    return NextResponse.json({ error: 'Invalid refresh' }, { status: 401 })
  }
}
