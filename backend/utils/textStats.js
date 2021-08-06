const regex = require('../utils/regex')

// counts words in text
const wordCount = (text) => {
    if(text === null || text === undefined) return undefined

    let count = 0
    const matches = text.matchAll(regex.word)
    for(_ of matches) {
        count++
    }
    return count
}

//counts whitespace characters in text
const whitespaceCount = text => {
    if(text === null || text === undefined) return undefined

    const matches = text.matchAll(regex.whiteSpace)
    let count = 0
    for(_ of matches) {
        count++
    }
    return count
}

//counts alphabetic characters in text
const alphabeticCount = (text) => {
    if(text === null || text === undefined) return undefined

    const matches = text.matchAll(regex.alphabetic)
    let upperCount = lowerCount = 0
    for(c of matches) {
        c[0] === c[0].toUpperCase() ? upperCount++ : lowerCount++
    }
    return {
        upperCase: upperCount,
        lowerCase: lowerCount,
        total: upperCount+lowerCount
    }

}

//counts digit characters in text
const digitCount = text => {
    if(text === null || text === undefined) return undefined

    const matches = text.matchAll(regex.digit)
    let count = 0
    for(_ of matches) {
        count++
    }
    return count
}

// punctuation characters stats
const punctuationCount = text => {
    if(text === null || text === undefined) return undefined
    const punct = new Map()

    const matches = text.matchAll(regex.punctuation)
    let count = 0
    for(const p of matches) {
        count++
        punct.set(p[0], punct.has(p[0]) ? punct.get(p[0]) + 1 : 1)
    }
    return {
        punct,
        count
    }
}

// count sentences of text
const sentencesCount = text => {
    if(text === null || text === undefined) return undefined

    const matches = text.matchAll(regex.sentence)
    let count = 0
    for(_ of matches) {
        count++
    }
    return count
}

// count lines of text
const linesCount = text => {
    if(text === null || text === undefined) return undefined

    const matches = text.matchAll(regex.newLine)
    let count = 0
    for(_ of matches) {
        count++
    }
    return count + 1
}

// word frequency in text
const wordFrequencies = text => {
    const words = new Map()

    const matches = text.matchAll(regex.word)
    const wordsTotal = wordCount(text)
    for(const w of matches) {
        words.set(
            w[0].toLowerCase(),
            words.has(w[0].toLowerCase())
                ? {
                    absolute: words.get(w[0].toLowerCase()).absolute + 1,
                    relative: words.get(w[0].toLowerCase()).relative + (1 / wordsTotal),
                    relativeWithWhiteSpace: words.get(w[0].toLowerCase()).relativeWithWhiteSpace + (1 / text.length)
                }
                : {
                    absolute: 1,
                    relative: 1 / wordsTotal,
                    relativeWithWhiteSpace: 1 / text.length
                }
        )
    }

    return {
        wordFreqs:
            [...words.entries()]
                .sort((a,b) => {
                    return b[1].absolute - a[1].absolute
                })
                .sort((a, b) => { // sort equal frequencies by key ascending
                    if(b[1].absolute === a[1].absolute) {
                        return b[0] < a[0] ? 1 : -1
                        //return b[0].localeCompare(a[0])
                    }
                })
                .reduce(
                    (acc, cur) => ({ ...acc, [cur[0]]: cur[1] }),
                    {}
                )
        ,
        wordCount: wordsTotal,
        shortestLength: Math.min(...[...words.entries()].map(w => w[0].length)),
        longestLength: Math.max(...[...words.entries()].map(w => w[0].length)),
        averageLength: [...words.entries()].map(w => w[0].length*w[1].absolute).reduce((acc, cur) => acc + cur, 0) / wordsTotal
    }
}

// generates character n-grams from word for given n
const generateCharNgrams = (word, n) => {
    let ngrams = []
    for(let i = 0; i < word.length - n+1; i++) {
        ngrams.push(word.substring(i, i+n))
    }
    return ngrams
}

// character n-gram stats (for size n to m)
const charNgramFrequencies = (text, n, m = n+1) => {
    const ngrams = new Map()

    const matches = text.matchAll(regex.word)
    let count = 0
    let wng = []
    for(const ng of matches) {
        for(let i = n; i <= m; i++) {
            wng = generateCharNgrams(ng[0], i)
            wng.forEach(ng => {
                count++
                ngrams.set(ng.toLowerCase(), ngrams.has(ng.toLowerCase()) ? ngrams.get(ng.toLowerCase()) + 1 : 1)
            })
        }
    }

    return {
        n,
        m,
        ngrams: 
            [...ngrams.entries()]
                .sort((a, b) => b[1] === a[1] ? -b[0].localeCompare(a[0]) : b[1] - a[1])
                .reduce(
                    (acc, cur) => ({ ...acc, [cur[0]]: cur[1] }),
                    {}
                ),
        unique: ngrams.size,
        total: count
    }
}

// generate word n-grams from list of words
const generateWordNgrams = (words, n) => {
    return words.flatMap((w, wi, arr) => {
        return wi + n <= words.length
            ? [Array.apply(0, Array(n)).map((_, i) => wi + i)]
            : []
    })
    .map(indices => indices.reduce((acc, cur) => `${acc} ${words[cur]}`, '').trim())
}

// calculate word n-gram of size n frequency
const wordNgramsFrequencies = (text, n, m) => {
    const sentences = text.matchAll(regex.sentence)
    const ngrams = new Map()
    for(s of sentences) {
        const words = [...s[0].matchAll(regex.word)].map(w => w[0])
        generateWordNgrams(words, n, m).forEach(
            ng => ngrams.set(ng, ngrams.has(ng) ? ngrams.get(ng)+1 : 1)
        )
    }
    return {
        n,
        ngrams:
            [...ngrams.entries()]
                .sort((a, b) => b[1] !== a[1] ? b[1] - a[1] : a[0].localeCompare(b[0]))
                .reduce(
                    (acc, cur) => ({ ...acc, [cur[0]]: cur[1] }),
                    {}
                ),
        unique: ngrams.size,
        total: [...ngrams.values()].reduce((acc, cur) => acc + cur, 0)
    }
}

// word n-grams of size n to m
const wordNgrams = (text, n, m = n+1) => {
    let ngrams = []
    for(let i = n; i <= m; ++i) {
        ngrams.push(wordNgramsFrequencies(text, i))
    }
    return ngrams
}

//alphabetic characters stats
const letterFrequencies = (text) => {
    if(!text){
        return null
    }
    const letters = new Map()
    const matches = text.matchAll(regex.alphabetic)
    const lettersTotal = alphabeticCount(text).total
    //let upperCount = 0
    //let lowerCount = 0
    for(const l of matches) {
        //l[0] === l[0].toUpperCase() ? upperCount++ : lowerCount++
        letters.set(
            l[0].toLowerCase(),
            //letters.has(l[0]) ? letters.get(l[0]) + 1 : 1
            letters.has(l[0].toLowerCase())
                ? {
                    absolute: letters.get(l[0].toLowerCase()).absolute + 1,
                    relative: letters.get(l[0].toLowerCase()).relative + (1 / lettersTotal),
                    relativeWithWhiteSpace: letters.get(l[0].toLowerCase()).relative + (1 / text.length),
                  }
                : {
                    absolute: 1,
                    relative: 1 / lettersTotal,
                    relativeWithWhiteSpace: 1 / text.length
                  }
        )
    }
    const punctuation = punctuationCount(text)
    
    return {
        letterFreqs: 
            [...letters.entries()]
                .sort((a, b) => {
                    return b[1].absolute - a[1].absolute
                })
                .sort((a, b) => { // sort equal frequencies by key ascending
                    if(b[1].absolute === a[1].absolute) {
                        return b[0] < a[0] ? 1 : -1
                    }
                })
                .reduce(
                    (acc, cur) => ({ ...acc, [cur[0]]: cur[1] }),
                    {}
                )
        ,
        charCount: {
            total: text.length,
            whitespace: whitespaceCount(text),
            alphabetic: alphabeticCount(text),
            digits: digitCount(text)
        },
        punctuationCount: {
            ...[...punctuation.punct.entries()]
            .reduce(
                (acc, cur) => ({ ...acc, [cur[0]]: cur[1] }),
                {}
            ),
            total: punctuation.count
        },
        wordCount: wordCount(text),
    }
}

// text statistics
const textStats = text => {
    return {
        length: text.length,
        'length without whitespace': text.length - whitespaceCount(text),
        lines: linesCount(text),
        words: wordCount(text),
        sentences: sentencesCount(text),
        words: wordCount(text),
    }
}

module.exports = {
    wordCount,
    whitespaceCount,
    alphabeticCount,
    digitCount,
    punctuationCount,
    sentencesCount,
    linesCount,
    charNgramFrequencies,
    letterFrequencies,
    wordFrequencies,
    wordNgramsFrequencies,
    wordNgrams,
    textStats
}