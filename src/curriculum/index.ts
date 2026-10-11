import type { LearningPath } from '../types'
import { foundationLessons } from './foundation'
import { originLessons } from './origins'
import { brewingLessons } from './brewing'

export const learningPaths: { id: LearningPath; number: string; title: string; description: string; color: string }[] = [
  { id: 'foundation', number: '01', title: 'コーヒーの基礎', description: '一杯の中身を知る', color: '#c98550' },
  { id: 'origins', number: '02', title: '世界の豆と産地', description: '産地から味を読み解く', color: '#557764' },
  { id: 'brewing', number: '03', title: 'ハンドドリップ実践', description: '好みの味を自分でつくる', color: '#544238' }
]

export const lessons = [...foundationLessons, ...originLessons, ...brewingLessons]
export const getLesson = (id: string) => lessons.find((lesson) => lesson.id === id)
