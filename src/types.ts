export type ChapterId = 'origin' | 'process' | 'roast' | 'brew'

export type LearningPath = 'foundation' | 'origins' | 'brewing'
export type RegionGroup = '基礎' | '共通知識' | '南米' | '中米・カリブ・ハワイ' | 'アフリカ・中東' | 'アジア・オセアニア' | '比較実践' | '抽出実践'

export type QuizQuestion = {
  id: string
  skill: '知識' | '地域' | '品種' | '生産' | '読解' | '比較' | '実践' | '診断'
  sectionRole: LessonSection['role']
  question: string
  choices: string[]
  answer: number
  explanation: string
  choiceExplanations: string[]
}

export type LessonSection = {
  role: '前提' | '仕組み' | '比較' | '使い方'
  eyebrow: string
  title: string
  body: string
  visual: 'altitude' | 'countries' | 'flavor' | 'process' | 'compare' | 'spectrum' | 'heat' | 'recipe' | 'variables' | 'adjust'
  art?: 'plant' | 'species' | 'taste' | 'climate' | 'processing' | 'roast' | 'basic-brew' | 'varieties' | 'terroir' | 'origin-map' | 'fermentation' | 'label' | 'flavor' | 'extraction' | 'grind' | 'ratio' | 'temperature' | 'pouring' | 'dial-in'
  items: { label: string; detail: string; tone?: string }[]
}

export type Lesson = {
  id: string
  chapter: ChapterId
  path: LearningPath
  group: RegionGroup
  countryCode?: string
  number: number
  title: string
  subtitle: string
  minutes: number
  goal: string
  prerequisite: string
  takeaway: string
  sections: LessonSection[]
  terms: { term: string; meaning: string }[]
  quiz: QuizQuestion[]
  sources: { label: string; url: string }[]
}

export type Ratings = { acidity: number; bitterness: number; sweetness: number; body: number; liking: number }

export type BrewKind = 'hand-drip' | 'drip-bag' | 'cafe'

export type BrewLog = {
  id: string
  kind?: BrewKind
  date: string
  bean: string
  cafeName?: string
  brand?: string
  origin?: string
  process?: string
  roast?: string
  dose: number
  water: number
  temperature: number
  duration: number
  grind: '細挽き' | '中細挽き' | '中挽き' | '粗挽き'
  ratings: Ratings
  note: string
  suggestion: string
}

export type AppData = {
  version: 3
  curriculumVersion: 3
  completedLessons: string[]
  quizScores: Record<string, number>
  activityDates: string[]
  brewLogs: BrewLog[]
}
