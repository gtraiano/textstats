const supertest = require('supertest')
const server = require('../index')
const api = supertest(server)

test('/ returns a welcome text message', async () => {
    await api
      .get('/')
      .expect(200)
      .expect('Content-Type', /text\/html/)
})

test('/routes are returned as json', async () => {
    await api
      .get('/routes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
})

test('/app serves index.html', async () => {
    await api
      .get('/app')
      .expect(200)
      .expect('Content-Type', /text\/html/)
})

test('non existent path returns 404', async () => {
  await api
    .get('/nonexistentpath')
    .expect(404)
})

afterAll(function (done) {
    server.close(done)
})