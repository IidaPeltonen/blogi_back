/* Iida Peltonern 2022 */

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const api = supertest(app)
const helper = require('./list_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('Bloglist is returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 10000)

test('There are four blogs in the list', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('The id-field in correctly named as id instead of _id', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

test('A correctly added blog is added to the database', async () => {
  const newBlog = {
    title: 'Lisätty blogi',
    author: 'Terävä testaaja',
    url: 'www.lisays.fi',
    likes: 5
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogitLopuksi = await helper.blogsInDb()
  expect(blogitLopuksi).toHaveLength(helper.initialBlogs.length + 1)

  const title = blogitLopuksi.map(n => n.title)
  expect(title).toContain('Testiblogi')
})

test('Blog without likes get a zero result for likes', async () => {
  const newBlog = {
    title: 'Testiblogi2',
    author: 'Testi Testaaja',
    url: 'www.eitykkayksia.fi'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogitLopuksi = await helper.blogsInDb()
  console.log('blogitLopuksi: ', blogitLopuksi)
  expect(blogitLopuksi[3].likes).toEqual(0)
})

test('Blog without title or url will not be added', async () => {
  const newBlog = {
    author: 'Testi Testaaja',
    likes: 3
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogitLopuksi = await helper.blogsInDb()

  expect(blogitLopuksi).toHaveLength(helper.initialBlogs.length)
})

test('Blog can be removed from the list', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

  const blogitLopuksi = await helper.blogsInDb()

  expect(blogitLopuksi).toHaveLength(helper.initialBlogs.length - 1)
  const contents = blogitLopuksi.map(r => r.id)
  console.log('contents: ', contents)
  console.log('blogs at end: ', blogitLopuksi)
  expect(contents).not.toContain(blogToDelete.id)
})

test('Modifying blog works', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToModify = blogsAtStart[1]
  const newBlog = {
    title: 'Muokattu nimi',
    author: 'Muokattu author',
    url: 'www.muokattuUrl.fi',
    likes: 20
  }
  await api
    .put(`/api/blogs/${blogToModify.id}`)
    .send(newBlog)
    .expect(200)

  const blogitLopuksi = await helper.blogsInDb()

  expect(blogitLopuksi).toHaveLength(
    helper.initialBlogs.length
  )

  expect(blogitLopuksi[1].title).toEqual(newBlog.title)
  expect(blogitLopuksi[1].author).toEqual(newBlog.author)
  expect(blogitLopuksi[1].url).toEqual(newBlog.url)
  expect(blogitLopuksi[1].likes).toEqual(newBlog.likes)
})

afterAll(() => {
  mongoose.connection.close()
})




