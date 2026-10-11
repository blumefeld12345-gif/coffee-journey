import { describe, expect, it } from 'vitest'
import { chapters, learningPaths, lessons } from './data'

describe('56-lesson curriculum', () => {
  it('contains the three named paths in fixed order', () => {
    expect(learningPaths.map((path) => path.title)).toEqual(['コーヒーの基礎', '世界の豆と産地', 'ハンドドリップ実践'])
    expect(lessons.filter((lesson) => lesson.path === 'foundation')).toHaveLength(8)
    expect(lessons.filter((lesson) => lesson.path === 'origins')).toHaveLength(36)
    expect(lessons.filter((lesson) => lesson.path === 'brewing')).toHaveLength(12)
  })

  it('contains 56 unique, sequentially numbered lessons', () => {
    expect(lessons).toHaveLength(56)
    expect(new Set(lessons.map((lesson) => lesson.id)).size).toBe(56)
    for (const path of learningPaths) {
      const list = lessons.filter((lesson) => lesson.path === path.id)
      expect(list.map((lesson) => lesson.number)).toEqual(Array.from({ length: list.length }, (_, index) => index + 1))
    }
  })

  it('contains 24 countries and exactly 384 explained questions', () => {
    const countries = lessons.filter((lesson) => lesson.countryCode)
    expect(countries).toHaveLength(24)
    expect(lessons.reduce((sum, lesson) => sum + lesson.quiz.length, 0)).toBe(384)
    for (const lesson of lessons) {
      expect(lesson.sections).toHaveLength(3)
      expect(lesson.quiz).toHaveLength(lesson.countryCode ? 8 : 6)
      for (const question of lesson.quiz) {
        expect(question.choices).toHaveLength(3)
        expect(question.choiceExplanations).toHaveLength(3)
        expect(question.answer).toBeGreaterThanOrEqual(0)
        expect(question.answer).toBeLessThan(3)
        expect(question.explanation).toBe(question.choiceExplanations[question.answer])
      }
    }
  })

  it('keeps every country question anchored to that country lesson', () => {
    for (const lesson of lessons.filter((item) => item.countryCode)) {
      const countryTerms = [lesson.title, ...lesson.sections.flatMap((section) => section.items.map((item) => item.label))]
      for (const question of lesson.quiz) expect(countryTerms.some((term) => question.question.includes(term) || question.choices.some((choice) => choice.includes(term)))).toBe(true)
    }
  })

  it('keeps all four knowledge themes represented', () => {
    expect(chapters).toHaveLength(4)
    for (const chapter of chapters) expect(lessons.some((lesson) => lesson.chapter === chapter.id)).toBe(true)
  })
})
