const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

// GET all users
usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blog', {
    url: 1,
    title: 2,
    author: 3,
  })
  response.json(users)
})

// CREATE new user
usersRouter.post('/', async (request, response) => {
  const body = request.body
  const password = body.password

  if (!password || password.length < 3) {
    response
      .status(400)
      .send({ error: 'password must be at least 3 characters long' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()
  response.json(savedUser)
})

module.exports = usersRouter
