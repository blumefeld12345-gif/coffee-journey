export { getLesson, learningPaths, lessons } from './curriculum'

export const chapters = [
  { id: 'origin' as const, number: '01', title: '豆と産地', description: '植物・地域・品種をつなぐ', color: '#d68c52' },
  { id: 'process' as const, number: '02', title: 'つくり方', description: '精製と発酵を理解する', color: '#b85c47' },
  { id: 'roast' as const, number: '03', title: '味を読む', description: '焙煎と味の言葉を学ぶ', color: '#78513b' },
  { id: 'brew' as const, number: '04', title: '抽出する', description: '一杯を数字と技術で設計する', color: '#356859' }
]
