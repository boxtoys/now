import hello from '../src'
import { describe, test ,expect } from '@jest/globals'

describe('Hello cases', () => {
  test('must be return the string value', () => {
    expect(hello('World!')).toBe('Hello World!')
  })
})
