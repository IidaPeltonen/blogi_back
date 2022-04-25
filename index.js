/* Iida Peltonen 2022 */

const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const Blog = require('./models/blog')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.json())
app.use(requestLogger)
app.use(cors())
app.use(express.static('build'))

app.get('/', (req, res) => {
  res.send('<h1>Moi!</h1>')
})

//uuden luonti
app.post('/api/blogs', (request, response, next) => {
  const body = request.body

  Blog.find({})
    .then(result => {
      //tarkistetaan onko nimi jo luettelossa
      const checkBlogs = result.some(
        findBlog => findBlog.name.toLowerCase() === body.name.toLowerCase()
      )

      //jos on
      if (checkBlogs) {
        return response.status(400).json({
          error: 'Nimi on jo luettelossa!'
        })
      }
      //jos ei
      else {
        const newBlog = new Blog({
          name: body.name,
          number: body.number
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

//kaikkien luettelo
app.get('/api/blogs', (request, response, next) => {
  Blog.find({})
    .then(blog => {
      if (blog) {
        response.json(blog)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

//poisto id:n perusteella
app.delete('/api/blogs/:id', (request, response, next) => {
  Blog.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

//haku id-numerolla
app.get('/api/blogs/:id', (request, response, next) => {
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

//vanhan päivitys
app.put('/api/blogs/:id', (request, response, next) => {
  const { name, number } = request.body

  Blog.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(result => {
      response.json(result)
    })
    .catch(error => next(error))
})

//info-sivu
app.get('/info', (request, response, next) => {
  const today = new Date()
  //ajaksi utc
  const time = today.toUTCString()
  let maara = 0
  Blog.find({})
    .then(blog => {
      if (blog) {
        maara = blog.length
        response.send(
          `<p>Luettelossa on ${maara} henkilön tiedot </p>
        <p> ${time}</p>`
        )
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

/* const morgan = require('morgan')

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :type')
)

morgan.token('type', (request, response) => JSON.stringify(request.body))

morgan.token('param', function (request, response, param) {
  return request.params[param]
}) */
