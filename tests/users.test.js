/* Iida Peltonen 2022 */

const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./list_helper')

describe('When there is only one user at db', () => {
  test('Creation fails if uname is taken', async () => {
    const Kayttajat = await helper.usersInDb()
    //annetaan uuden tiedot
    const newUser = {
      uname: 'Iida',
      name: 'Iida Peltonen',
      password: 'passeord'
    }
    //tarkistetaan tulos
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Username must be unique')

    const UserLista = await helper.usersInDb()
    expect(UserLista).toHaveLength(Kayttajat.length)
  })
})

describe('Adding bad info on user fails', () => {
  test('Creation fails if username is not given', async () => {
    const Kayttajat = await helper.usersInDb()

    const newUser = {
      uname: '',
      name: 'Ei käyttäjänimeä',
      password: 'salasana'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be given')
    const UserLista = await helper.usersInDb()
    expect(UserLista).toHaveLength(Kayttajat.length)
  })
  test('Creation fails if password is not given', async () => {
    const Kayttajat = await helper.usersInDb()

    const newUser = {
      uname: 'user',
      name: 'Ei salasanaa',
      password: ''
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Password must be given')
    const UserLista = await helper.usersInDb()
    expect(UserLista).toHaveLength(Kayttajat.length)
  })

  test('Creation fails if password is not at leats 3 chars', async () => {
    const Kayttajat = await helper.usersInDb()

    const newUser = {
      uname: 'user2',
      name: 'Liian lyhyt salasana',
      password: 'ly'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain(
      'Password must contain at least 3 chars'
    )
    const UserLista = await helper.usersInDb()
    expect(UserLista).toHaveLength(Kayttajat.length)
  })

  test('Creation fails if username is not 3 chars or longer', async () => {
    const Kayttajat = await helper.usersInDb()

    const newUser = {
      uname: 'ly',
      name: 'Liian Lyhyt Nini',
      password: 'salasana'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain(
      'Username must contain at least 3 chars'
    )
    const UserLista = await helper.usersInDb()
    expect(UserLista).toHaveLength(Kayttajat.length)
  })
})
