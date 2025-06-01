import { describe, it, expect } from 'vitest'
import { getPreviewParams } from '../../src/utils/helper.js'
describe('query-api/js - helper tests', () => {
  describe('getPreviewParams - Return preview tokens in query param format', () => {
    it('Should filter out the correct preview tokens and return it as query params', () => {
      const url =
        'https://craft.com/v1/api/queryApi/customQuery/elementType=entries&section=home&one=1&x-craft-preview=abcd&token=abcdef&x-craft-live-preview=absdefg'
      const previewParams = getPreviewParams(url)
      expect(previewParams).toBe('x-craft-preview=abcd&token=abcdef&x-craft-live-preview=absdefg')
    })

    it('Should return empty string because no preview params are set', () => {
      const url =
        'https://craft.com/v1/api/queryApi/customQuery/elementType=entries&section=home&one=1'
      const previewParams = getPreviewParams(url)
      expect(previewParams).toBe('')
    })
  })
})
