import { supabase } from './supabase'

async function authHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  try {
    const s = await supabase.auth.getSession()
    const token = (s as any)?.data?.session?.access_token
    if (token) headers.Authorization = `Bearer ${token}`
  } catch (err) {
    // ignore
  }
  return headers
}

export async function generateGoal(payload: any) {
  const headers = await authHeaders()
  const res = await fetch('/api/generate-goal', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  })
  return res.json()
}

export async function getToday() {
  const headers = await authHeaders()
  const res = await fetch('/api/today', { headers })
  return res.json()
}

export async function completeCommitment(id: string) {
  const headers = await authHeaders()
  const res = await fetch(`/api/commitment/${id}/complete`, { method: 'POST', headers })
  return res.json()
}

export async function rescheduleCommitment(id: string, to: string) {
  const headers = await authHeaders()
  const res = await fetch(`/api/commitment/${id}/reschedule`, { method: 'POST', headers, body: JSON.stringify({ rescheduled_to: to }) })
  return res.json()
}

export async function getMe() {
  const headers = await authHeaders()
  const res = await fetch('/api/auth/me', { headers })
  return res.json()
}
