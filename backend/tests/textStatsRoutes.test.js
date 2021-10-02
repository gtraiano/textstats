const supertest = require('supertest')
const server = require('../index')
const api = supertest(server)
let apiRoutes = null

beforeAll(() => {
    return api.get('/routes').then(response => {
        apiRoutes = { ...response.body }
    })
})

test('/routes are returned as json', async () => {
    await api
        .get('/routes')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

describe('/letterfreqs', () => {
    test('results returned as json', async () => {
        await api
            .post(apiRoutes.letterFreqs)
            .send({ text: 'abcdefg'})
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('empty body returns 400', async () => {
        await api
            .post(apiRoutes.letterFreqs)
            .send()
            .expect(400)
    })

    test('empty body.text returns 400', async () => {
        await api
            .post(apiRoutes.letterFreqs)
            .send({ text: '' })
            .expect(400)
    })

    test('only lowercase letters', async () => {
        const response = await api
            .post(apiRoutes.letterFreqs)
            .send({ text: 'abc abcd'})

        expect(response.status).toBe(200)

        expect(response.body.letterFreqs.find(l => l[0] === 'a')[1].absolute).toBe(2)
        expect(response.body.letterFreqs.find(l => l[0] === 'b')[1].absolute).toBe(2)
        expect(response.body.letterFreqs.find(l => l[0] === 'c')[1].absolute).toBe(2)
        expect(response.body.letterFreqs.find(l => l[0] === 'd')[1].absolute).toBe(1)
        
        expect(response.body.charCount.total).toBe('abc abcd'.length)
        expect(response.body.charCount.whitespace).toBe(1)
        expect(response.body.charCount.alphabetic.lowerCase).toBe(7)
        expect(response.body.charCount.alphabetic.upperCase).toBe(0)
        
        expect(response.body.charCount.digits).toBe(0)
        expect(response.body.punctuationCount.total).toBe(0)
        expect(response.body.wordCount).toBe(2)
    })

    test('only uppercase letters', async () => {
        const response = await api
            .post(apiRoutes.letterFreqs)
            .send({ text: 'abc abcd'.toUpperCase()})

        expect(response.status).toBe(200)

        expect(response.body.letterFreqs.find(l => l[0] === 'a')[1].absolute).toBe(2)
        expect(response.body.letterFreqs.find(l => l[0] === 'b')[1].absolute).toBe(2)
        expect(response.body.letterFreqs.find(l => l[0] === 'c')[1].absolute).toBe(2)
        expect(response.body.letterFreqs.find(l => l[0] === 'd')[1].absolute).toBe(1)
        
        expect(response.body.charCount.total).toBe('abc abcd'.length)
        expect(response.body.charCount.whitespace).toBe(1)
        expect(response.body.charCount.alphabetic.lowerCase).toBe(0)
        expect(response.body.charCount.alphabetic.upperCase).toBe(7)
        
        expect(response.body.charCount.digits).toBe(0)
        expect(response.body.punctuationCount.total).toBe(0)
        expect(response.body.wordCount).toBe(2)
    })

    test('mixed case letters', async () => {
        const response = await api
            .post(apiRoutes.letterFreqs)
            .send({ text: 'abc ABCd'})

            expect(response.status).toBe(200)

            expect(response.body.letterFreqs.find(l => l[0] === 'a')[1].absolute).toBe(2)
            expect(response.body.letterFreqs.find(l => l[0] === 'b')[1].absolute).toBe(2)
            expect(response.body.letterFreqs.find(l => l[0] === 'c')[1].absolute).toBe(2)
            expect(response.body.letterFreqs.find(l => l[0] === 'd')[1].absolute).toBe(1)
            
            expect(response.body.charCount.total).toBe('abc ABCd'.length)
            expect(response.body.charCount.whitespace).toBe(1)
            expect(response.body.charCount.alphabetic.lowerCase).toBe(4)
            expect(response.body.charCount.alphabetic.upperCase).toBe(3)
            
            expect(response.body.charCount.digits).toBe(0)
            expect(response.body.punctuationCount.total).toBe(0)
            expect(response.body.wordCount).toBe(2)
    })

    test('only non-alphabetic characters', async () => {
        const response = await api
            .post(apiRoutes.letterFreqs)
            .send({ text: '123 1234,.!'.toUpperCase()})

        expect(response.status).toBe(200)
        
        expect(response.body.charCount.total).toBe('123 1234,.!'.length)
        expect(response.body.charCount.whitespace).toBe(1)
        expect(response.body.charCount.alphabetic.lowerCase).toBe(0)
        expect(response.body.charCount.alphabetic.upperCase).toBe(0)
        
        expect(response.body.charCount.digits).toBe(7)
        expect(response.body.punctuationCount.total).toBe(3)
        expect(response.body.wordCount).toBe(2)
    })
})

describe('/wordfreqs', () => {
    test('results returned as json', async () => {
        await api
            .post(apiRoutes.wordFreqs)
            .send({ text: 'abcdefg'})
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('empty body returns 400', async () => {
        await api
            .post(apiRoutes.wordFreqs)
            .send()
            .expect(400)
    })

    test('empty body.text returns 400', async () => {
        await api
            .post(apiRoutes.wordFreqs)
            .send({ text: '' })
            .expect(400)
    })

    test('text including digits and punctuation', async () => {
        const text = 'one word two word 1,2!'
        const response = await api
            .post(apiRoutes.wordFreqs)
            .send({ text })
        
            expect(response.status).toBe(200)
            
            expect(response.body.wordCount).toBe(6)
            expect(response.body.shortestLength).toBe(1)
            expect(response.body.longestLength).toBe(4)
            expect(response.body.averageLength).toBe(
                text
                    .split(/\s|,|!/gi)
                    .filter(w => w !== '')
                    .reduce((acc, cur, i, arr) => i < arr.length - 1 ? acc + cur.length : (acc + cur.length)/arr.length, 0)
            )

            expect(response.body.wordFreqs.find(w => w[0] === 'one')[1].absolute).toBe(1)
            expect(response.body.wordFreqs.find(w => w[0] === 'two')[1].absolute).toBe(1)
            expect(response.body.wordFreqs.find(w => w[0] === 'word')[1].absolute).toBe(2)

            expect(response.body.wordFreqs.find(w => w[0] === '1')[1].absolute).toBe(1)
            expect(response.body.wordFreqs.find(w => w[0] === '2')[1].absolute).toBe(1)
    })
})

describe('/textstats', () => {
    test('results returned as json', async () => {
        await api
            .post(apiRoutes.textStats)
            .send({ text: 'abcdefg'})
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('empty body returns 400', async () => {
        await api
            .post(apiRoutes.textStats)
            .send()
            .expect(400)
    })

    test('empty body.text returns 400', async () => {
        await api
            .post(apiRoutes.textStats)
            .send({ text: '' })
            .expect(400)
    })

    test('text including digits and punctuation', async () => {
        const text = 'one word two word 1,2!\n'
        const response = await api
            .post(apiRoutes.textStats)
            .send({ text })
        
        expect(response.status).toBe(200)
        expect(response.body.length).toBe(text.length)
        expect(response.body['length without whitespace']).toBe(text.replace(/\s/g, '').length)
        expect(response.body.lines).toBe(text.match(/\n/g).length + 1)
        expect(response.body.words).toBe(text.match(/\w+/g).length)
        expect(response.body.sentences).toBe(text.match(/[.!]/gi).length)
    })
})

describe('/charngramfreqs', () => {
    test('results returned as json', async () => {
        await api
            .post(apiRoutes.charNgramFreqs)
            .send({ text: 'abcdefg', n: 2 })
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('empty body returns 400', async () => {
        await api
            .post(apiRoutes.charNgramFreqs)
            .send()
            .expect(400)
    })

    test('empty body.text returns 400', async () => {
        await api
            .post(apiRoutes.charNgramFreqs)
            .send({ text: '', n: 2 })
            .expect(400)
    })

    test('text including digits and punctuation', async () => {
        const text = 'one word one word two word 1,2!\n'
        const n = 2, m = 3
        const response = await api
            .post(apiRoutes.charNgramFreqs)
            .send({ text, n, m })
        
        let ngrams = []
        text.match(/\b\w+\b/g).forEach(word => {
            for(let i = n; i <= m; i++) {
                for(let j = 0; j < word.length - i+1; j++) {
                    ngrams.push(word.substring(j, j+i))
                }
            }
        })
        
        expect(response.status).toBe(200)
        expect(response.body.unique).toBe((new Set(ngrams)).size)
        expect(response.body.total).toBe(ngrams.length)
    })
})

describe('/wordngramfreqs', () => {
    test('results returned as json', async () => {
        await api
            .post(apiRoutes.wordNgramFreqs)
            .send({ text: 'abcdefg', n: 2})
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('empty body returns 400', async () => {
        await api
            .post(apiRoutes.wordNgramFreqs)
            .send()
            .expect(400)
    })

    test('empty body.text returns 400', async () => {
        await api
            .post(apiRoutes.wordNgramFreqs)
            .send({ text: '', n: 2 })
            .expect(400)
    })

    test('text including digits and punctuation', async () => {
        const text = 'one word one-word two word 1,2!\n'
        const n = 2, m = 3
        const response = await api
            .post(apiRoutes.wordNgramFreqs)
            .send({ text, n, m })
        // n=2 ['one word', 'word one-word', 'one-word two', 'two word', 'word 1', '1 2'] => 6 total, 6 unique
        expect(response.status).toBe(200)
        expect(response.body[0].unique).toBe(6)
        expect(response.body[0].total).toBe(6)
        // n=3 ['one word one-word', 'word one-word two', 'one-word two word', 'two word 1', 'word 1 2'] => 5 total, 5 unique
        expect(response.body[1].unique).toBe(5)
        expect(response.body[1].total).toBe(5)
    })
})

afterAll(function (done) {
    server.close(done)
})