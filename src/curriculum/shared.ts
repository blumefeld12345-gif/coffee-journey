import type { ChapterId, LearningPath, Lesson, LessonSection, QuizQuestion, RegionGroup } from '../types'

export type Card = [string, string]

export type StandardSeed = {
  id: string; chapter: ChapterId; path: LearningPath; group: RegionGroup; number: number
  title: string; subtitle: string; minutes?: number; goal: string; prerequisite: string; takeaway: string
  overview: [string, string]; mechanism: [string, string]; use: [string, string]
  cards: [Card[], Card[], Card[]]; terms: Card[]; art?: LessonSection['art']
  quiz?: QuizQuestion[]
  sources?: { label: string; url: string }[]
}

const tones = ['green', 'gold', 'berry', 'brown']
const section = (role: LessonSection['role'], content: [string, string], cards: Card[], art?: LessonSection['art']): LessonSection => ({
  role,
  eyebrow: role === '前提' ? 'FOUNDATION' : role === '仕組み' ? 'HOW IT WORKS' : 'USE IT',
  title: content[0], body: content[1], visual: role === '使い方' ? 'adjust' : 'compare', art,
  items: cards.map(([label, detail], index) => ({ label, detail, tone: tones[index % tones.length] }))
})

export function standardLesson(seed: StandardSeed): Lesson {
  if (!seed.quiz) throw new Error(`レッスン ${seed.id} に固有クイズが設定されていません。`)
  const [a, b, c] = seed.cards
  return {
    id: seed.id, chapter: seed.chapter, path: seed.path, group: seed.group, number: seed.number,
    title: seed.title, subtitle: seed.subtitle, minutes: seed.minutes ?? 7, goal: seed.goal,
    prerequisite: seed.prerequisite, takeaway: seed.takeaway,
    sections: [section('前提', seed.overview, a, seed.art), section('仕組み', seed.mechanism, b), section('使い方', seed.use, c)],
    terms: seed.terms.map(([term, meaning]) => ({ term, meaning })), quiz: seed.quiz, sources: seed.sources ?? []
  }
}

export const commonSources = {
  sca: { label: 'Specialty Coffee Association', url: 'https://sca.coffee/' },
  wcr: { label: 'World Coffee Research 品種カタログ', url: 'https://varieties.worldcoffeeresearch.org/arabica' },
  ico: { label: 'International Coffee Organization', url: 'https://ico.org/' }
}
