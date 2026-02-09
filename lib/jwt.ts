import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access-secret'
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret'

export function signAccess(payload: object, expiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m') {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn })
}

export function signRefresh(payload: object, expiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d') {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn })
}

export function verifyAccess(token: string) {
  return jwt.verify(token, ACCESS_SECRET)
}

export function verifyRefresh(token: string) {
  return jwt.verify(token, REFRESH_SECRET)
}
