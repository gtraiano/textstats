// counts words in text
const wordCount = (text) => {
    if(text === null || text === undefined) return undefined
    //const word = new RegExp(/\w+[-']?\w+/gi)
    const word = new RegExp(/['"]\w+['"]|\w+'\w+|(\w+(?:[-]?\w+){0,3})/g) // quoted word|word with apostrophe|word[hyphenated]
    let count = 0
    const matches = text.matchAll(word)
    for(_ of matches) {
        count++
    }
    return count
}

//counts whitespace characters in text
const whitespaceCount = text => {
    if(text === null || text === undefined) return undefined
    const re = new RegExp(/\s/g)
    const matches = text.matchAll(re)
    let count = 0
    for(_ of matches) {
        count++
    }
    return count
}

//counts alphabetic characters in text
const alphabeticCount = (text) => {
    if(text === null || text === undefined) return undefined
    const re = new RegExp(/[a-zA-Z]/g)
    const matches = text.matchAll(re)
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
    const re = new RegExp(/\d/g)
    const matches = text.matchAll(re)
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
    const re = new RegExp(/\.|\?|\!|\,|\:|\;|\–|\-|\[|\]|\{|\}|\(|\)|\'|\"|\.{3}/g)
    const matches = text.matchAll(re)
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
// https://stackoverflow.com/questions/5553410/regular-expression-match-a-sentence
    const re = new RegExp(/[^.!?\s][^.!?]*(?:[.!?](?!['"]?\s|$)[^.!?]*)*[.!?]?['"]?(?=\s|$)/, 'gi')
    const matches = text.matchAll(re)
    let count = 0
    for(_ of matches) {
        count++
    }
    return count
}

// count lines of text
const linesCount = text => {
    if(text === null || text === undefined) return undefined
    const matches = text.matchAll(/\n/g)
    let count = 0
    for(_ of matches) {
        count++
    }
    return count + 1
}

// word frequency in text
const wordFrequencies = text => {
    const words = new Map()
    const re = new RegExp(/\w+[-']?\w+/g)
    const matches = text.matchAll(re)
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
        averageLength: [...words.entries()].map(w => w[0].length).reduce((acc, cur) => acc + cur, 0) / wordCount(text)                
    }
}

// character n-gram stats (for size n to m)
const charNgramFrequencies = (text, n, m = n+1) => {
    const ngrams = new Map()
    //const re = new RegExp(`(?<=\\s+)(\\w{${n},${m}})(?=\\s+|\\W+)`, 'gi')
    const re = new RegExp(`\\w{${n},${m}}`, 'gi')
    const matches = text.matchAll(re)
    let count = 0
    for(const ng of matches) {
        count++
        //ngrams.set(ng[1].toLowerCase(), ngrams.has(ng[1].toLowerCase()) ? ngrams.get(ng[1].toLowerCase()) + 1 : 1)
        ngrams.set(ng[0].toLowerCase(), ngrams.has(ng[0].toLowerCase()) ? ngrams.get(ng[0].toLowerCase()) + 1 : 1)
    }

    return {
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
const wordNgramsFrequencies = (text, n) => {
    const sentences = text.matchAll(/(.*)[.!?]+?/g)
    const ngrams = new Map()
    for(s of sentences) {
        const words = [...s[0].matchAll(/\b\w+['-]?\w*\b/g)].map(w => w[0])
        generateWordNgrams(words, n).forEach(
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
    //const re = new RegExp(/\w/g)
    const re = new RegExp(/[a-zA-Z]/g)
    const matches = text.matchAll(re)
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