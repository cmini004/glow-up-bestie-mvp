import { Application, Request, Response } from 'express'
import { createClient } from '@supabase/supabase-js'
import { requireAuth, optionalAuth } from './middleware/auth'

const SUPABASE_URL = process.env.SUPABASE_URL || ''
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const OPENAI_KEY = process.env.OPENAI_API_KEY || ''

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)

function simpleGoalFromPayload(payload: any) {
  const cat = payload.category || 'general'
  const title = payload.desired_outcome || payload.goalText || `Build a consistent ${cat} habit`
  const description = payload.why || payload.whyText || 'Practice consistently for 30 days.'
  const frequency = payload.preferred_frequency || '5x / week'
  const time = payload.preferred_time || '9:00 AM'
  return { title, description, frequency, time }
}

export function createServerRoutes(app: Application) {
  app.get('/api/health', (_req: Request, res: Response) => res.json({ ok: true }))

  app.get('/api/auth/me', requireAuth, async (req: Request, res: Response) => {
    const user = (req as any).user
    return res.json({ user })
  })

  async function getUserFromRequest(req: Request) {
    const auth = req.headers.authorization || ''
    const token = auth.split(' ')[1]
    if (!token) return null
    try {
      // Call Supabase auth user endpoint to validate token
      const url = `${SUPABASE_URL.replace(/\/$/, '')}/auth/v1/user`
      const r = await fetch(url, { headers: { Authorization: `Bearer ${token}`, apikey: SUPABASE_SERVICE_ROLE } })
      if (!r.ok) return null
      const j = await r.json()
      return j
    } catch (err) {
      console.warn('auth check failed', err)
      return null
    }
  }

  app.post('/api/generate-goal', requireAuth, async (req: Request, res: Response) => {
    const body = req.body || {}
    try {
      // If OpenAI key present, call OpenAI; otherwise fallback to simple generator
      let goal = simpleGoalFromPayload(body)

      if (OPENAI_KEY && body.useAI) {
        try {
          const { generateGoalWithOpenAI, checkRateLimit } = await import('./services/openai')
          if (!checkRateLimit('generate_goal', 30)) {
            return res.status(429).json({ error: 'rate_limited' })
          }
          const ai = await generateGoalWithOpenAI(body)
          goal = { title: body.goalText || ai.title || goal.title, description: ai.description || goal.description, frequency: body.preferred_frequency || goal.frequency, time: body.preferred_time || goal.time }

          // log conversation to ai_conversations table when possible
          try {
            const user = (req as any).user
            if (user && user.id && SUPABASE_URL && SUPABASE_SERVICE_ROLE) {
              await supabase.from('ai_conversations').insert([{ user_id: user.id, goal_id: null, role: 'assistant', content: ai.raw, created_at: new Date().toISOString() }])
            }
          } catch (e) {
            console.warn('failed to log ai conversation', e)
          }
        } catch (err) {
          console.warn('OpenAI call failed, falling back', err)
        }
      }


      // persist goal in Supabase
      if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
        return res.json({ demo: true, goal })
      }

      const user = (req as any).user
      if (!user || !user.id) return res.status(401).json({ error: 'unauthenticated' })

      const now = new Date().toISOString()
      const { data: g, error: ge } = await supabase.from('goals').insert([{ user_id: user.id || body.user_id || null, title: goal.title, category: body.category || null, why: body.why || null, obstacle: body.obstacle || null, desired_outcome: body.desired_outcome || null, start_date: now, end_date: null, status: 'active', created_at: now, updated_at: now }]).select().single()
      if (ge) throw ge

      const goalId = g.id

      // generate simple commitments: next N weekdays according to commitment_days
      const days = body.commitmentDays || 30
      const commitments = []
      for (let i = 0; i < days; i++) {
        const dt = new Date()
        dt.setDate(dt.getDate() + i)
        const scheduled_at = dt.toISOString()
        commitments.push({ goal_id: goalId, title: goal.title, scheduled_at, duration_minutes: body.duration_minutes || 10, status: 'scheduled', created_at: now, updated_at: now })
      }

      const { error: ce } = await supabase.from('commitments').insert(commitments)
      if (ce) throw ce

      return res.json({ goal: g, commitments: commitments.slice(0, 20) })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'server_error' })
    }
  })

  app.get('/api/today', requireAuth, async (_req: Request, res: Response) => {
    try {
      // naive: return next 7 scheduled commitments
      if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) return res.json({ demo: true })
      const user = (_req as any).user
      if (!user || !user.id) return res.status(401).json({ error: 'unauthenticated' })
      const now = new Date().toISOString()
      const { data } = await supabase.from('commitments').select().lt('scheduled_at', new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString()).eq('user_id', user.id).order('scheduled_at', { ascending: true }).limit(50)
      res.json({ commitments: data })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'server_error' })
    }
  })

  app.post('/api/commitment/:id/complete', requireAuth, async (req: Request, res: Response) => {
    const id = req.params.id
    try {
      if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) return res.json({ demo: true })
      const user = (req as any).user
      if (!user || !user.id) return res.status(401).json({ error: 'unauthenticated' })

      // ensure the commitment belongs to the user
      const { data: existing } = await supabase.from('commitments').select().eq('id', id).limit(1).single()
      if (!existing) return res.status(404).json({ error: 'not_found' })
      // fetch goal to verify ownership
      const { data: g2 } = await supabase.from('goals').select().eq('id', existing.goal_id).limit(1).single()
      if (!g2 || g2.user_id !== user.id) return res.status(403).json({ error: 'forbidden' })

      const now = new Date().toISOString()
      const { data, error } = await supabase.from('commitments').update({ status: 'completed', completed_at: now, updated_at: now }).eq('id', id).select().single()
      if (error) throw error
      res.json({ commitment: data })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'server_error' })
    }
  })

  app.post('/api/commitment/:id/reschedule', requireAuth, async (req: Request, res: Response) => {
    const id = req.params.id
    const { rescheduled_to } = req.body
    try {
      if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) return res.json({ demo: true })
      const user = (req as any).user
      if (!user || !user.id) return res.status(401).json({ error: 'unauthenticated' })

      const { data: existing } = await supabase.from('commitments').select().eq('id', id).limit(1).single()
      if (!existing) return res.status(404).json({ error: 'not_found' })
      const { data: g2 } = await supabase.from('goals').select().eq('id', existing.goal_id).limit(1).single()
      if (!g2 || g2.user_id !== user.id) return res.status(403).json({ error: 'forbidden' })

      const now = new Date().toISOString()
      const { data, error } = await supabase.from('commitments').update({ status: 'rescheduled', rescheduled_to, scheduled_at: rescheduled_to, updated_at: now }).eq('id', id).select().single()
      if (error) throw error
      res.json({ commitment: data })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'server_error' })
    }
  })
}
