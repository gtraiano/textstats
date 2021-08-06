const word = new RegExp(/\b['"]?\w+(?:[-']\w+){0,2}['"]?\b/g) // regular, quoted, with apostrophe, hyphenated (up to 2 hyphens) word
const whiteSpace = new RegExp(/\s/g)
const alphabetic = new RegExp(/[a-zA-Z]/g)
const digit = new RegExp(/\d/g)
const punctuation = new RegExp(/\.|\?|\!|\,|\:|\;|\–|\-|\[|\]|\{|\}|\(|\)|\'|\"|\.{3}/g)
const sentence = new RegExp(/[^.!?\s][^.!?]*(?:[.!?](?!['"]?\s|$)[^.!?]*)*[.!?]?['"]?(?=\s|$)/g) // https://stackoverflow.com/questions/5553410/regular-expression-match-a-sentence
const newLine = new RegExp(/\n/g)

module.exports = {
    word,
    whiteSpace,
    alphabetic,
    digit,
    punctuation,
    sentence,
    newLine
}
