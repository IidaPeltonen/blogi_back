/* Iida Peltonen 2022 */

const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

//kaikki käyttäjät
usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs')
  response.json(users)
})

//uuden luonti
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response.status(400).json({
      error: 'username must be unique'
    })
  }
  if (!password) {
    return response.status(400).json({
      error: 'password must be given'
    })
  }
  if (password.length < 3){
    return response.status(400).json({
      error: 'password must be 3 chars or longer'
    })
  }
  if (!username){
    return response.status(400).json({
      error: 'username must be given'
    })
  }
  if (username.length < 3){
    return response.status(400).json({
      error: 'username must be 3 chars or longer'
    })
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter