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

describe('/letterFreqs', () => {

})

describe('/wordFreqs', () => {

})

describe('/textStats', () => {

})

describe('/charNgramFreqs', () => {

})

describe('/wordNgramFreqs', () => {

})

afterAll(function (done) {
    server.close(done)
})