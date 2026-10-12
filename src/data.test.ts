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

  it('keeps every question unambiguous and fully explained', () => {
    const ids = new Set<string>()
    for (const lesson of lessons) {
      for (const question of lesson.quiz) {
        expect(ids.has(question.id)).toBe(false)
        ids.add(question.id)
        expect(question.question.trim().length).toBeGreaterThanOrEqual(10)
        expect(new Set(question.choices).size).toBe(3)
        expect(question.choices.every((choice) => choice.trim().length > 0)).toBe(true)
        expect(question.choiceExplanations.every((reason) => reason.trim().length > 4)).toBe(true)
      }
    }
  })

  it('includes comparison and practical judgment across the curriculum', () => {
    for (const lesson of lessons) {
      expect(lesson.quiz.some((question) => ['比較', '読解'].includes(question.skill))).toBe(true)
      expect(lesson.quiz.some((question) => ['実践', '診断'].includes(question.skill))).toBe(true)
    }
  })

  it('gives every lesson section enough explanatory context', () => {
    for (const lesson of lessons) {
      for (const section of lesson.sections) {
        expect(section.body.trim().length, `${lesson.id}:${section.role}`).toBeGreaterThanOrEqual(30)
        expect(section.items.length, `${lesson.id}:${section.role}`).toBeGreaterThanOrEqual(3)
        expect(section.items.every((item) => item.detail.trim().length >= 4), `${lesson.id}:${section.role}`).toBe(true)
      }
    }
  })

  it('does not concentrate correct answers in one position', () => {
    const totals = [0, 1, 2].map((position) => lessons.flatMap((lesson) => lesson.quiz).filter((question) => question.answer === position).length)
    expect(Math.max(...totals) - Math.min(...totals)).toBeLessThan(80)
    for (const lesson of lessons) expect(new Set(lesson.quiz.map((question) => question.answer)).size).toBeGreaterThanOrEqual(2)
  })
})
