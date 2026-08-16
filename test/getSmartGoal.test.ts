import { describe, it, expect } from 'vitest'
import { getSmartGoal } from '../src/App'

describe('getSmartGoal', () => {
  it('returns content goal for content category', () => {
    const data: any = { categories: ['content'] }
    const goal = getSmartGoal(data)
    expect(goal.title).toContain('camera')
  })

  it('returns default goal when category unknown', () => {
    const data: any = { categories: ['unknown'] }
    const goal = getSmartGoal(data)
    expect(goal.title).toContain('Build a consistent daily habit')
  })
})
