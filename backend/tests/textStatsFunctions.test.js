const {
    wordCount,
    whitespaceCount,
    alphabeticCount,
    digitCount,
    punctuationCount,
    sentencesCount,
    linesCount,
} = require('../utils/textStats')

describe('wordCount', () => {
    test('empty string', () => {
        expect(wordCount('')).toBe(0)
    })
    test('2 words string', () => {
        expect(wordCount('one two')).toBe(2)
    })
    test('2 single-hyphenated words string', () => {
        expect(wordCount('catch-all way-to')).toBe(2)
    })
    test('null string', () => {
        expect(wordCount(null)).toBe(undefined)
    })
    test('string with punctuation', () => {
        expect(wordCount('This, I dare say, contains punctuation.')).toBe(6)
    })
})

describe('whitespaceCount', () => {
    test('empty string', () => {
        expect(whitespaceCount('')).toBe(0)
    })
    test('null string', () => {
        expect(whitespaceCount(null)).toBe(undefined)
    })
    test('string with whitespace characters', () => {
        expect(whitespaceCount('this ought\tto')).toBe(2)
    })
    test('string with no whitespace characters', () => {
        expect(whitespaceCount('this')).toBe(0)
    })
})

describe('alphabeticCount', () => {
    test('empty string', () => {
        expect(alphabeticCount('')).toEqual({
            lowerCase: 0,
            upperCase: 0,
            total: 0
        })
    })
    test('null string', () => {
        expect(alphabeticCount(null)).toBe(undefined)
    })
    test('string with 5 lowercase characters', () => {
        expect(alphabeticCount('abcde')).toEqual({
            lowerCase: 5,
            upperCase: 0,
            total: 5
        })
    })
    test('string with 5 uppercase characters', () => {
        expect(alphabeticCount('ABCDE')).toEqual({
            lowerCase: 0,
            upperCase: 5,
            total: 5
        })
    })
    test('string with mixed upper and lower case (5 of each) characters, plus whitespace', () => {
        expect(alphabeticCount('abCde 12\tgREAT')).toEqual({
            lowerCase: 5,
            upperCase: 5,
            total: 10
        })
    })
})

describe('digitCount', () => {
    test('empty string', () => {
        expect(digitCount('')).toBe(0)
    })
    test('null string', () => {
        expect(digitCount(null)).toBe(undefined)
    })
    test('string with 5 numeric characters', () => {
        expect(digitCount('12345')).toBe(5)
    })
    test('string with non-numeric characters', () => {
        expect(digitCount('AB CDE')).toBe(0)
    })
    test('string with mixed numeric and alphabetic characters, plus whitespace', () => {
        expect(digitCount('abCde 1 2\tgREAT')).toBe(2)
    })
})

describe('punctuationCount', () => {
    test('empty string', () => {
        expect(punctuationCount('')).toEqual(expect.objectContaining({ count: 0 }))
    })
    test('null string', () => {
        expect(punctuationCount(null)).toBe(undefined)
    })
    test('string with 2 punctuation characters', () => {
        const punct = punctuationCount('Hail to the chief! Hooray.')
        expect(punct).toMatchObject({ count: 2 })
        expect(punct.punct.get('!')).toEqual(1)
        expect(punct.punct.get('.')).toEqual(1)
    })
    test('string with non-punctuation characters', () => {
        expect(punctuationCount('AB CDE')).toMatchObject({ count: 0 })
    })
    test('string with mixed punctutation, numeric and alphabetic characters, plus whitespace', () => {
        const punct = punctuationCount('This will pose a great opportunity, please reconsider. You have 2 days to make up your mind.')
        expect(punct).toMatchObject({ count: 3 })
        expect(punct.punct.get(',')).toEqual(1)
        expect(punct.punct.get('.')).toEqual(2)
    })
})

describe('sentencesCount', () => {
    test('empty string', () => {
        expect(sentencesCount('')).toBe(0)
    })
    test('null string', () => {
        expect(sentencesCount(null)).toBe(undefined)
    })
    test('string with 2 sentences', () => {
        expect(sentencesCount('One sentence. Two sentences.')).toBe(2)
    })
})

describe('linesCount', () => {
  test('empty string', () => {
      expect(linesCount('')).toBe(1)
  })
  test('null string', () => {
      expect(sentencesCount(null)).toBe(undefined)
  })
  test('string with 2 lines', () => {
      expect(sentencesCount('One line.\nTwo lines.')).toBe(2)
  })
})