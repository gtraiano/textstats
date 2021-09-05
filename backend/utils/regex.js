//const word = new RegExp(/\b['"]?\w+(?:[-']\w+){0,2}['"]?\b/g) // regular, quoted, with apostrophe, hyphenated (up to 2 hyphens) word
const word = new RegExp(/(?:\p{Alpha}|\p{N})+(?:-(\p{Alpha}|\p{N})+){0,2}/gu) // regular or hyphenated (up to 2 hyphens) word
const whiteSpace = new RegExp(/\s/gu)
//const alphabetic = new RegExp(/[a-zA-Z]/g)
const alphabetic = new RegExp(/\p{L}/gu)
const digit = new RegExp(/\d/gu)
//const punctuation = new RegExp(/\.|\?|\!|\,|\:|\;|\–|\-|\[|\]|\{|\}|\(|\)|\'|\"|\.{3}/g)
const punctuation = new RegExp(/\p{P}/gu)
const sentence = new RegExp(/[^.!?\s][^.!?]*(?:[.!?](?!['"]?\s|$)[^.!?]*)*[.!?]?['"]?(?=\s|$)/gu) // https://stackoverflow.com/questions/5553410/regular-expression-match-a-sentence
const newLine = new RegExp(/\n/gu)

module.exports = {
    word,
    whiteSpace,
    alphabetic,
    digit,
    punctuation,
    sentence,
    newLine
}
