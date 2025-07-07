import { describe, it, expect } from 'vitest'
import { normalizeBearerToken } from '../../src/utils/bearer'

describe('normalizeBearerToken', () => {
  it('should return a correctly formated bearer token', () => {
    const tokenArr = ['xxx', '  xxx  ', 'Bearer xxx', '   Bearer xxx ']
    tokenArr.forEach((token) => {
      expect(normalizeBearerToken(token)).toBe('Bearer xxx')
    })
  })
})
