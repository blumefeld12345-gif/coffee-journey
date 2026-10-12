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

const question = (id: string, skill: QuizQuestion['skill'], sectionRole: LessonSection['role'], prompt: string, choices: string[], answer: number, reasons: string[]): QuizQuestion => ({
  id, skill, sectionRole, question: prompt, choices, answer,
  explanation: reasons[answer], choiceExplanations: reasons
})

export function standardLesson(seed: StandardSeed): Lesson {
  const [a, b, c] = seed.cards
  const pick = (cards: Card[], index: number) => cards[index % cards.length]
  const q: QuizQuestion[] = [
    question(`${seed.id}-q1`, '知識', '前提', `「${pick(a, 0)[1]}」に当てはまる項目はどれですか？`, [pick(a, 1)[0], pick(a, 2)[0], pick(a, 0)[0]], 2, [`${pick(a, 1)[0]}は「${pick(a, 1)[1]}」を指します。`, `${pick(a, 2)[0]}は「${pick(a, 2)[1]}」を指します。`, `${pick(a, 0)[0]}は「${pick(a, 0)[1]}」を指します。`]),
    question(`${seed.id}-q2`, '比較', '前提', `${pick(a, 1)[0]}と${pick(a, 2)[0]}の説明の組み合わせとして正しいものは？`, [`${pick(a, 1)[0]}：${pick(a, 2)[1]}／${pick(a, 2)[0]}：${pick(a, 1)[1]}`, `${pick(a, 1)[0]}：${pick(a, 1)[1]}／${pick(a, 2)[0]}：${pick(a, 2)[1]}`, `${pick(a, 1)[0]}：${pick(a, 0)[1]}／${pick(a, 2)[0]}：${pick(a, 1)[1]}`], 1, [`二つの説明が入れ替わっています。`, `二つの項目と本文の説明が正しく対応しています。`, `一つ目は${pick(a, 0)[0]}、二つ目は${pick(a, 1)[0]}の説明です。`]),
    question(`${seed.id}-q3`, '知識', '仕組み', `${pick(b, 0)[0]}の働き・特徴として正しいものはどれですか？`, [pick(b, 0)[1], pick(b, 2)[1], pick(b, 1)[1]], 0, [`${pick(b, 0)[0]}は「${pick(b, 0)[1]}」と説明されています。`, `これは${pick(b, 2)[0]}の説明です。`, `これは${pick(b, 1)[0]}の説明です。`]),
    question(`${seed.id}-q4`, '比較', '仕組み', `「${pick(b, 2)[1]}」に対応する項目はどれですか？`, [pick(b, 1)[0], pick(b, 2)[0], pick(b, 0)[0]], 1, [`${pick(b, 1)[0]}は「${pick(b, 1)[1]}」です。`, `${pick(b, 2)[0]}が「${pick(b, 2)[1]}」に対応します。`, `${pick(b, 0)[0]}は「${pick(b, 0)[1]}」です。`]),
    question(`${seed.id}-q5`, '実践', '使い方', `${pick(c, 0)[0]}として本文で示している内容はどれですか？`, [pick(c, 2)[1], pick(c, 0)[1], pick(c, 1)[1]], 1, [`これは${pick(c, 2)[0]}として示した内容です。`, `${pick(c, 0)[0]}では「${pick(c, 0)[1]}」を扱います。`, `これは${pick(c, 1)[0]}として示した内容です。`]),
    question(`${seed.id}-q6`, '読解', '使い方', `${pick(c, 1)[0]}と${pick(c, 2)[0]}の対応として正しいものは？`, [`${pick(c, 1)[0]}：${pick(c, 1)[1]}／${pick(c, 2)[0]}：${pick(c, 2)[1]}`, `${pick(c, 1)[0]}：${pick(c, 2)[1]}／${pick(c, 2)[0]}：${pick(c, 0)[1]}`, `${pick(c, 1)[0]}：${pick(c, 0)[1]}／${pick(c, 2)[0]}：${pick(c, 1)[1]}`], 0, [`二つの項目と、本文で示した具体的な内容が正しく対応しています。`, `一つ目は${pick(c, 2)[0]}、二つ目は${pick(c, 0)[0]}の内容です。`, `一つ目は${pick(c, 0)[0]}、二つ目は${pick(c, 1)[0]}の内容です。`])
  ]
  return {
    id: seed.id, chapter: seed.chapter, path: seed.path, group: seed.group, number: seed.number,
    title: seed.title, subtitle: seed.subtitle, minutes: seed.minutes ?? 7, goal: seed.goal,
    prerequisite: seed.prerequisite, takeaway: seed.takeaway,
    sections: [section('前提', seed.overview, a, seed.art), section('仕組み', seed.mechanism, b), section('使い方', seed.use, c)],
    terms: seed.terms.map(([term, meaning]) => ({ term, meaning })), quiz: seed.quiz ?? q, sources: seed.sources ?? []
  }
}

export const commonSources = {
  sca: { label: 'Specialty Coffee Association', url: 'https://sca.coffee/' },
  wcr: { label: 'World Coffee Research 品種カタログ', url: 'https://varieties.worldcoffeeresearch.org/arabica' },
  ico: { label: 'International Coffee Organization', url: 'https://ico.org/' }
}
