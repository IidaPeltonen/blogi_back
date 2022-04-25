/* Iida Peltonen 2022 */

const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

//kaikkien luettelo
blogsRouter.get('/', (request, response) => {
  Blog.find({}).then(blogs => {
    console.log('huhuu')
    response.json(blogs)
  })
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
blogsRouter.post('/', (request, response, next) => {
  const body = request.body

  Blog.find({})
    .then(result => {
      //tarkistetaan onko nimi jo luettelossa
      const checkBlogs = result.some(
        findBlog => findBlog.title.toLowerCase() === body.title.toLowerCase()
      )

      //jos on
      if (checkBlogs) {
        return response.status(400).json({
          error: 'Blogi on jo luettelossa!'
        })
      }
      //jos ei
      else {
        const newBlog = new Blog({
          title: body.title,
          author: body.author,
          url: body.url,
          likes: body.likes
        })
        newBlog
          .save()
          .then(savedBlog => {
            response.json(savedBlog)
          })
          .catch(error => next(error))
      }
    })
    .catch(error => next(error))
})

//poisto id:n perusteella
blogsRouter.delete('/:id', (request, response, next) => {
  Blog.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

//vanhan päivitys
blogsRouter.put('/:id', (request, response, next) => {
  const { title, author, url, likes } = request.body

  Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, url, likes },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(result => {
      response.json(result)
    })
    .catch(error => next(error))
})

module.exports = blogsRouter
