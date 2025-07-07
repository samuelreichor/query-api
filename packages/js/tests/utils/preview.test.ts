import { describe, it, expect, vi, afterEach } from 'vitest'
import { getPreviewParams } from '../../src/utils/preview'

describe('getPreviewParams', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should extract all preview params from a query string', () => {
    const str = '?x-craft-live-preview=value&value=123&x-craft-preview=true&xyz=123&token=xyz123'
    expect(getPreviewParams(str)).toBe(
      'x-craft-live-preview=value&x-craft-preview=true&token=xyz123',
    )
  })

  it('should extract only the preview params from a query string', () => {
    const str = '?other=value&x-craft-preview=true&token=xyz123'
    expect(getPreviewParams(str)).toBe('x-craft-preview=true&token=xyz123')
  })

  it('should extract only the preview params from a string record', () => {
    const strRecord = {
      other: 'value',
      'x-craft-preview': 'true',
      token: 'xyz123',
    }
    expect(getPreviewParams(strRecord)).toBe('x-craft-preview=true&token=xyz123')
  })

  it('should return an empty string if no preview params are found', () => {
    const search = '?foo=bar&baz=qux'
    expect(getPreviewParams(search)).toBe('')
  })

  it('should return an empty string for an empty string input', () => {
    expect(getPreviewParams('')).toBeNull()
  })

  it('should return null when no params are given and window is undefined', () => {
    vi.stubGlobal('window', undefined)
    expect(getPreviewParams()).toBeNull()
  })

  it('should fall back to window.location.search if no params are given', () => {
    vi.stubGlobal('window', {
      location: {
        search: '?token=abc&other=123',
      },
    })
    expect(getPreviewParams()).toBe('token=abc')
  })
})
