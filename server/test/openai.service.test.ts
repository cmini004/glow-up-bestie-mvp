import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// import the module under test
import * as openai from '../src/services/openai'

describe('generateGoalWithOpenAI', () => {
  const originalFetch = globalThis.fetch

  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  it('parses a multi-line assistant response into title and description', async () => {
    const fakeResponse = {
      choices: [{ message: { content: 'Title line\nThis is the description of the goal.' } }],
    }

    // mock fetch
    globalThis.fetch = vi.fn(async () => ({ ok: true, json: async () => fakeResponse })) as any

    // temporarily set OPENAI_KEY env var
    process.env.OPENAI_API_KEY = 'testkey'

    const res = await openai.generateGoalWithOpenAI({ goalText: 'test' })
    expect(res.title).toBe('Title line')
    expect(res.description).toContain('This is the description')
  })
})
