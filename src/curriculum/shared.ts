import type { ChapterId, LearningPath, Lesson, LessonSection, QuizQuestion, RegionGroup } from '../types'

export type Card = [string, string]

export type StandardSeed = {
  id: string; chapter: ChapterId; path: LearningPath; group: RegionGroup; number: number
  title: string; subtitle: string; minutes?: number; goal: string; prerequisite: string; takeaway: string
  overview: [string, string]; mechanism: [string, string]; use: [string, string]
  cards: [Card[], Card[], Card[]]; terms: Card[]; art?: LessonSection['art']
  sources?: { label: string; url: string }[]
}

const tones = ['green', 'gold', 'berry', 'brown']
const section = (role: LessonSection['role'], content: [string, string], cards: Card[], art?: LessonSection['art']): LessonSection => ({
  role,
  eyebrow: role === '前提' ? 'FOUNDATION' : role === '仕組み' ? 'HOW IT WORKS' : 'USE IT',
  title: content[0], body: content[1], visual: role === '使い方' ? 'adjust' : 'compare', art,
  items: cards.map(([label, detail], index) => ({ label, detail, tone: tones[index % tones.length] }))
})

const question = (id: string, skill: QuizQuestion['skill'], sectionRole: LessonSection['role'], prompt: string, choices: string[], answer: number, reasons: string[]): QuizQuestion => ({
  id, skill, sectionRole, question: prompt, choices, answer,
  explanation: reasons[answer], choiceExplanations: reasons
})

export function standardLesson(seed: StandardSeed): Lesson {
  const [a, b, c] = seed.cards
  const pick = (cards: Card[], index: number) => cards[index % cards.length]
  const q: QuizQuestion[] = [
    question(`${seed.id}-q1`, '知識', '前提', `「${pick(a, 0)[1]}」を表す言葉はどれですか？`, [pick(a, 0)[0], pick(a, 1)[0], pick(a, 2)[0]], 0, [`${pick(a, 0)[0]}は「${pick(a, 0)[1]}」を示します。`, `${pick(a, 1)[0]}は「${pick(a, 1)[1]}」を示すため異なります。`, `${pick(a, 2)[0]}は「${pick(a, 2)[1]}」を示すため異なります。`]),
    question(`${seed.id}-q2`, '比較', '前提', `${pick(a, 1)[0]}について、レッスンの説明と一致するものは？`, [pick(a, 2)[1], pick(a, 1)[1], pick(a, 0)[1]], 1, [`これは${pick(a, 2)[0]}の説明です。`, `${pick(a, 1)[0]}は「${pick(a, 1)[1]}」として学びました。`, `これは${pick(a, 0)[0]}の説明です。`]),
    question(`${seed.id}-q3`, '知識', '仕組み', `${pick(b, 0)[0]}を正しく説明しているものは？`, [pick(b, 1)[1], pick(b, 2)[1], pick(b, 0)[1]], 2, [`これは${pick(b, 1)[0]}の説明です。`, `これは${pick(b, 2)[0]}の説明です。`, `${pick(b, 0)[0]}の要点は「${pick(b, 0)[1]}」です。`]),
    question(`${seed.id}-q4`, '比較', '仕組み', `${pick(b, 2)[1]}に当てはまる項目は？`, [pick(b, 2)[0], pick(b, 0)[0], pick(b, 1)[0]], 0, [`${pick(b, 2)[0]}が該当します。`, `${pick(b, 0)[0]}は「${pick(b, 0)[1]}」です。`, `${pick(b, 1)[0]}は「${pick(b, 1)[1]}」です。`]),
    question(`${seed.id}-q5`, '実践', '使い方', `実際に試すとき、${pick(c, 0)[0]}として適切なのは？`, [pick(c, 1)[1], pick(c, 0)[1], pick(c, 2)[1]], 1, [`これは${pick(c, 1)[0]}の行動です。`, `${pick(c, 0)[0]}では「${pick(c, 0)[1]}」を行います。`, `これは${pick(c, 2)[0]}の行動です。`]),
    question(`${seed.id}-q6`, '実践', '使い方', `${pick(c, 2)[0]}として、このレッスンで勧めている行動は？`, [pick(c, 2)[1], pick(c, 1)[1], pick(c, 0)[1]], 0, [`${pick(c, 2)[0]}として学んだ具体的な使い方です。`, `これは${pick(c, 1)[0]}に対応する別の行動です。`, `これは${pick(c, 0)[0]}に対応する別の行動です。`])
  ]
  return {
    id: seed.id, chapter: seed.chapter, path: seed.path, group: seed.group, number: seed.number,
    title: seed.title, subtitle: seed.subtitle, minutes: seed.minutes ?? 7, goal: seed.goal,
    prerequisite: seed.prerequisite, takeaway: seed.takeaway,
    sections: [section('前提', seed.overview, a, seed.art), section('仕組み', seed.mechanism, b), section('使い方', seed.use, c)],
    terms: seed.terms.map(([term, meaning]) => ({ term, meaning })), quiz: q, sources: seed.sources ?? []
  }
}

export const commonSources = {
  sca: { label: 'Specialty Coffee Association', url: 'https://sca.coffee/' },
  wcr: { label: 'World Coffee Research 品種カタログ', url: 'https://varieties.worldcoffeeresearch.org/arabica' },
  ico: { label: 'International Coffee Organization', url: 'https://ico.org/' }
}
