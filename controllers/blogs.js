/* Iida Peltonen 2022 */

const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

//kaikkien luettelo
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

//haku id-numerolla
blogsRouter.get('/:id', (request, response, next) => {
  Blog.findById(request.params.id)
    .then(blog => {
      if (blog) {
        response.json(blog)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

//uuden luonti
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findById(body.userId)
  console.log('user: ', user)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })
  //jos tykkäykset on tyhjä
  if (blog.likes === undefined){
    blog.likes = 0
  }
  //jos otsikko tai url puuttuu
  if (blog.title === undefined || blog.url === undefined){
    response.status(400).json(request.body)
  } else {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    response.status(201).json(savedBlog)
  }
})

//poisto id:n perusteella
blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

//vanhan päivitys
blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }
  console.log('put: ', blog)
  console.log('request.params: ', request.params)
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})

module.exports = blogsRouter
















module.exports = blogsRouter