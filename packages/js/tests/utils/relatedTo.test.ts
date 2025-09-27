import { describe, it, expect } from 'vitest'
import { shortenRelationParam } from '../../src/utils/relatedTo'

describe('shortenRelationParam', () => {
  // Test suite for basic, non-transformable inputs
  describe('simple cases', () => {
    it('should return a number as is', () => {
      const input = 42
      expect(shortenRelationParam(input)).toBe(42)
    })

    it('should return an array of numbers as is', () => {
      const input = [10, 20, 30]
      expect(shortenRelationParam(input)).toEqual([10, 20, 30])
    })
  })

  // Test suite for arrays containing logical operators
  describe('array operators', () => {
    it('should handle the "and" operator with numbers', () => {
      const input = ['and', 15, 25]
      expect(shortenRelationParam(input)).toEqual(['and', 15, 25])
    })

    it('should handle the "or" operator with numbers', () => {
      const input = ['or', 15, 25]
      expect(shortenRelationParam(input)).toEqual(['or', 15, 25])
    })

    it('should handle the "not" operator with numbers', () => {
      const input = ['not', 15, 25]
      expect(shortenRelationParam(input)).toEqual(['not', 15, 25])
    })
  })

  // Test suite for shortening object keys
  describe('object shortening', () => {
    it('should shorten an object with a single "targetElement" key', () => {
      const input = { targetElement: 123 }
      expect(shortenRelationParam(input)).toEqual({ tE: 123 })
    })

    it('should shorten an object with a single "sourceElement" key', () => {
      const input = { sourceElement: 456 }
      expect(shortenRelationParam(input)).toEqual({ sE: 456 })
    })

    it('should shorten an object with a single "element" key', () => {
      const input = { element: 789 }
      expect(shortenRelationParam(input)).toEqual({ e: 789 })
    })

    it('should shorten an object with all possible keys', () => {
      const input = {
        targetElement: [1, 2],
        field: ['tags', 'categories'],
      }
      expect(shortenRelationParam(input)).toEqual({
        tE: [1, 2],
        f: ['tags', 'categories'],
      })
    })

    it('should ignore keys with undefined values', () => {
      const input = { targetElement: 123, field: undefined }
      expect(shortenRelationParam(input)).toEqual({ tE: 123 })
    })
  })

  // Test suite for complex, nested, and mixed structures
  describe('complex and nested cases', () => {
    it('should handle a mixed array of numbers and objects', () => {
      const input = [
        12,
        { sourceElement: 50, field: 'test' },
        { targetElement: 75 },
        { element: 12 },
      ]
      expect(shortenRelationParam(input)).toEqual([
        12,
        { sE: 50, f: 'test' },
        { tE: 75 },
        { e: 12 },
      ])
    })

    it('should handle an array with an operator and mixed criteria', () => {
      const input = [
        'and',
        { sourceElement: 50, field: 'test' },
        { targetElement: 75 },
        { element: 12 },
      ]
      expect(shortenRelationParam(input)).toEqual([
        'and',
        { sE: 50, f: 'test' },
        { tE: 75 },
        { e: 12 },
      ])
    })
  })

  // Test suite for invalid inputs that should throw an error
  describe('error handling', () => {
    it('should throw an error for null input', () => {
      const input = null
      // @ts-expect-error: unit test for error handling
      expect(() => shortenRelationParam(input)).toThrow(
        'RelatedTo validation failed. Please check your relatedTo() input.',
      )
    })

    it('should throw an error for undefined input', () => {
      const input = undefined
      // @ts-expect-error: unit test for error handling
      expect(() => shortenRelationParam(input)).toThrow(
        'RelatedTo validation failed. Please check your relatedTo() input.',
      )
    })

    it('should throw an error for a non-object, non-array, non-number input', () => {
      const input = 'a string is invalid'
      // @ts-expect-error: unit test for error handling
      expect(() => shortenRelationParam(input)).toThrow(
        'RelatedTo validation failed. Please check your relatedTo() input.',
      )
    })
  })
})
