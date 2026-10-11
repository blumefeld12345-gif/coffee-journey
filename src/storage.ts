import type { AppData, BrewLog, Ratings } from './types'

export const STORAGE_KEY = 'coffee-journey-data-v1'

export const emptyData: AppData = { version: 1, completedLessons: [], quizScores: {}, activityDates: [], brewLogs: [] }

export function todayKey(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyData
    return validateBackup(JSON.parse(raw))
  } catch {
    return emptyData
  }
}

export function saveData(data: AppData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function validateBackup(value: unknown): AppData {
  if (!value || typeof value !== 'object') throw new Error('バックアップの形式が正しくありません。')
  const data = value as Partial<AppData>
  if (data.version !== 1 || !Array.isArray(data.completedLessons) || !Array.isArray(data.activityDates) || !Array.isArray(data.brewLogs) || !data.quizScores || typeof data.quizScores !== 'object') {
    throw new Error('Coffee Journey のバックアップファイルではありません。')
  }
  return data as AppData
}

export function calculateStreak(activityDates: string[], now = new Date()) {
  const dates = new Set(activityDates)
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  if (!dates.has(todayKey(cursor))) cursor.setDate(cursor.getDate() - 1)
  let streak = 0
  while (dates.has(todayKey(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export function suggestNext(ratings: Ratings) {
  if (ratings.liking >= 5) return 'この条件を基準レシピとして残し、次回も再現してみましょう。'
  if (ratings.bitterness >= 4) return '次回は湯温を2℃下げて、苦味が穏やかになるか試しましょう。'
  if (ratings.acidity >= 4 && ratings.sweetness <= 2) return '次回は挽き目を一段細かくして、甘さを引き出してみましょう。'
  if (ratings.body <= 2) return '次回は湯量を10g減らして、少し濃くしてみましょう。'
  if (ratings.body >= 5) return '次回は湯量を10g増やして、軽やかさを見てみましょう。'
  if (ratings.sweetness <= 2) return '次回は抽出時間を15秒長くして、甘さの変化を確かめましょう。'
  return '次回は同じ条件でもう一度淹れ、味が再現できるか確かめましょう。'
}

export function kindOf(log: BrewLog) {
  return log.kind ?? 'hand-drip'
}

export const kindLabels = { 'hand-drip': 'ハンドドリップ', 'drip-bag': 'ドリップバッグ', cafe: 'カフェの一杯' } as const

export function createBrewLog(values: Omit<BrewLog, 'id' | 'suggestion'>): BrewLog {
  return { ...values, id: crypto.randomUUID(), suggestion: suggestNext(values.ratings) }
}

export function formatDuration(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}
