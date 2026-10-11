import { describe, expect, it } from 'vitest'
import { chapters, lessons } from './data'

describe('lesson curriculum', () => {
  it('keeps all four knowledge themes represented', () => {
    expect(chapters).toHaveLength(4)
    for (const chapter of chapters) expect(lessons.some((lesson) => lesson.chapter === chapter.id)).toBe(true)
  })

  it('contains six lessons at each learning level', () => {
    for (const level of ['beginner', 'intermediate', 'advanced']) {
      expect(lessons.filter((lesson) => lesson.level === level)).toHaveLength(6)
    }
  })

  it('numbers the new intermediate path from one through six', () => {
    expect(lessons.filter((lesson) => lesson.level === 'intermediate').map((lesson) => lesson.number).sort()).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('contains 18 unique lessons with three valid questions each', () => {
    expect(lessons).toHaveLength(18)
    expect(new Set(lessons.map((lesson) => lesson.id)).size).toBe(18)
    for (const lesson of lessons) {
      expect(lesson.quiz).toHaveLength(3)
      for (const question of lesson.quiz) expect(question.answer).toBeLessThan(question.choices.length)
    }
  })
})
