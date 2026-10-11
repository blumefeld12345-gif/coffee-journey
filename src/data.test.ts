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

  it('numbers every learning level from one through six', () => {
    for (const level of ['beginner', 'intermediate', 'advanced']) expect(lessons.filter((lesson) => lesson.level === level).map((lesson) => lesson.number).sort()).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('contains 18 illustrated lessons with four categorized questions each', () => {
    expect(lessons).toHaveLength(18)
    expect(new Set(lessons.map((lesson) => lesson.id)).size).toBe(18)
    for (const lesson of lessons) {
      expect(lesson.goal).toBeTruthy()
      expect(lesson.prerequisite).toBeTruthy()
      expect(lesson.sections.some((section) => section.art)).toBe(true)
      expect(lesson.quiz).toHaveLength(4)
      expect(lesson.quiz.map((question) => question.skill)).toEqual(['用語', '仕組み', '比較', '実践'])
      for (const question of lesson.quiz) expect(question.answer).toBeLessThan(question.choices.length)
    }
  })
})
