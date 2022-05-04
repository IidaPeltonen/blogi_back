/* Iida Peltonern 2022 */

const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Testiblogi',
    author: 'Terävä testaaja',
    url: 'www.testi.fi',
    likes: 5
  },
  {
    title: 'malli',
    author: 'Tyyris Tyllerö',
    url: 'www.tyllerofi',
    likes: 11
  },
  {
    title: 'Toinen malli',
    author: 'Pilli Piipari',
    url: 'www.tays.fi',
    likes: 4
  }
]

const nonExistingId = async () => {
  const note = new User({ content: 'willremovethissoon', date: new Date() })
  await note.save()
  await note.remove()

  return note._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb
}
