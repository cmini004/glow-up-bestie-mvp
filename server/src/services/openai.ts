import fetch from 'node-fetch'

const OPENAI_KEY = process.env.OPENAI_API_KEY || ''

export async function generateGoalWithOpenAI(payload: any) {
  if (!OPENAI_KEY) throw new Error('no_openai_key')

  const prompt = `Create a SMART goal from: ${JSON.stringify(payload)}`
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], max_tokens: 500 }),
  })
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`openai_error:${res.status}:${txt}`)
  }
  const j = await res.json()
  const text = j?.choices?.[0]?.message?.content ?? ''
  // Return parsed fields where possible, fall back to raw
  const lines = text.split('\n').map((l: string) => l.trim()).filter(Boolean)
  const title = lines[0] || payload.goalText || 'New goal'
  const description = lines.slice(1).join('\n') || payload.why || ''
  return { title, description, raw: text }
}

// lightweight rate limiter in-memory (per-process)
const calls: Record<string, { ts: number; count: number }> = {}
export function checkRateLimit(key = 'global', maxPerMinute = 60) {
  const now = Date.now()
  const bucket = calls[key] || { ts: now, count: 0 }
  if (now - bucket.ts > 60_000) {
    bucket.ts = now
    bucket.count = 0
  }
  bucket.count += 1
  calls[key] = bucket
  return bucket.count <= maxPerMinute
}
