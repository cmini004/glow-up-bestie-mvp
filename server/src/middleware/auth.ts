import { Request, Response, NextFunction } from 'express'

const SUPABASE_URL = process.env.SUPABASE_URL || ''
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = (req.headers.authorization as string) || ''
  const token = auth.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'unauthenticated' })
  try {
    const url = `${SUPABASE_URL.replace(/\/$/, '')}/auth/v1/user`
    const r = await fetch(url, { headers: { Authorization: `Bearer ${token}`, apikey: SUPABASE_SERVICE_ROLE } })
    if (!r.ok) return res.status(401).json({ error: 'unauthenticated' })
    const j = await r.json()
    // attach user to request
    ;(req as any).user = j
    return next()
  } catch (err) {
    console.warn('auth check failed', err)
    return res.status(401).json({ error: 'unauthenticated' })
  }
}

export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const auth = (req.headers.authorization as string) || ''
  const token = auth.split(' ')[1]
  if (!token) return next()
  try {
    const url = `${SUPABASE_URL.replace(/\/$/, '')}/auth/v1/user`
    const r = await fetch(url, { headers: { Authorization: `Bearer ${token}`, apikey: SUPABASE_SERVICE_ROLE } })
    if (r.ok) {
      const j = await r.json()
      ;(req as any).user = j
    }
  } catch (err) {
    // ignore
  }
  return next()
}
