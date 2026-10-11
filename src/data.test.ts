import { describe, expect, it } from 'vitest'
import { chapters, lessons } from './data'

describe('lesson curriculum', () => {
  it('contains four chapters with three lessons each', () => {
    expect(chapters).toHaveLength(4)
    for (const chapter of chapters) expect(lessons.filter((lesson) => lesson.chapter === chapter.id)).toHaveLength(3)
  })

  it('contains 12 unique lessons with three valid questions each', () => {
    expect(lessons).toHaveLength(12)
    expect(new Set(lessons.map((lesson) => lesson.id)).size).toBe(12)
    for (const lesson of lessons) {
      expect(lesson.quiz).toHaveLength(3)
      for (const question of lesson.quiz) expect(question.answer).toBeLessThan(question.choices.length)
    }
  })
})
