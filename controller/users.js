const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const usersRouter = require('express').Router()
const User = require('../models/user')

// GET all users
usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    url: 1,
    title: 2,
    author: 3,
  })
  response.json(users)
})

//GET USER
usersRouter.get('/:id', async (request, response) => {
  const user = await User.findById(request.params.id).populate('blogs', {
    url: 1,
    title: 2,
    author: 3,
  })
  return user ? response.json(user) : response.status(404).end()
})

// CREATE new user
usersRouter.post('/', async (request, response) => {
  const body = request.body
  const password = body.password

  if (!password || password.length < 3) {
    response.status(400).send('password must be at least 3 characters long')
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()

  const userForToken = {
    username: savedUser.username,
    id: savedUser._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({
      token,
      username: savedUser.username,
      name: savedUser.name,
      id: savedUser._id,
    })
})

module.exports = usersRouter
