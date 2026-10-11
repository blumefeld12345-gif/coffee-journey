import { describe, expect, it } from 'vitest'
import { origins, processEffects, roastEffects } from './exploreData'

describe('coffee finder data', () => {
  it('contains searchable origin guides with complete taste data', () => {
    expect(origins.length).toBeGreaterThanOrEqual(12)
    expect(new Set(origins.map((origin) => origin.id)).size).toBe(origins.length)
    for (const origin of origins) {
      expect(origin.flavors.length).toBeGreaterThanOrEqual(4)
      expect(origin.acidity).toBeGreaterThanOrEqual(1)
      expect(origin.acidity).toBeLessThanOrEqual(5)
      expect(origin.body).toBeGreaterThanOrEqual(1)
      expect(origin.body).toBeLessThanOrEqual(5)
    }
  })

  it('offers optional processing and roast choices', () => {
    expect(Object.keys(processEffects)).toEqual(['unknown', 'washed', 'natural', 'honey', 'anaerobic'])
    expect(Object.keys(roastEffects)).toEqual(['unknown', 'light', 'medium', 'dark'])
  })
})
