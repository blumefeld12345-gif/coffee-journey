import { describe, expect, it } from 'vitest'
import { calculateStreak, kindOf, suggestNext, validateBackup } from './storage'

describe('calculateStreak', () => {
  it('counts through today', () => expect(calculateStreak(['2026-10-09', '2026-10-10', '2026-10-11'], new Date(2026, 9, 11, 12))).toBe(3))
  it('allows today to be absent and counts through yesterday', () => expect(calculateStreak(['2026-10-09', '2026-10-10'], new Date(2026, 9, 11, 12))).toBe(2))
  it('stops at a gap', () => expect(calculateStreak(['2026-10-08', '2026-10-10', '2026-10-11'], new Date(2026, 9, 11, 12))).toBe(2))
})

describe('suggestNext', () => {
  const base = { acidity: 3, bitterness: 3, sweetness: 3, body: 3, liking: 3 }
  it('lowers temperature for high bitterness', () => expect(suggestNext({ ...base, bitterness: 5 })).toContain('2℃下げ'))
  it('uses a finer grind for sharp acidity without sweetness', () => expect(suggestNext({ ...base, acidity: 5, sweetness: 1 })).toContain('細かく'))
})

describe('validateBackup', () => {
  it('migrates v1 learning state while preserving coffee logs', () => {
    const log = { id: 'old-log' }
    const migrated = validateBackup({ version: 1, completedLessons: ['old'], quizScores: { old: 3 }, activityDates: ['2026-10-11'], brewLogs: [log] })
    expect(migrated.version).toBe(2)
    expect(migrated.completedLessons).toEqual([])
    expect(migrated.quizScores).toEqual({})
    expect(migrated.brewLogs).toEqual([log])
  })
  it('rejects other data', () => expect(() => validateBackup({ hello: 'world' })).toThrow())
})

describe('record compatibility', () => {
  it('treats records created before record types as hand drip', () => {
    expect(kindOf({} as never)).toBe('hand-drip')
  })
})
