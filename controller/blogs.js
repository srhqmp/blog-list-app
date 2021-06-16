const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

// GET all blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 2 })
  response.json(blogs)
})

// GET a specific blog
blogsRouter.get('/:id', async (request, response) => {
  const id = request.params.id
  const blog = await Blog.findById(id)
  blog ? response.json(blog) : response.status(404).end()
})

// CREATE new blog
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const token = request.token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    likes: body.likes,
    url: body.url,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  savedBlog ? response.status(200).json(savedBlog) : response.status(400).end()
})

// DELETE a blog
blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  await Blog.findByIdAndRemove(id)
  response.status(204).end()
})

// UPDATE blog likes
blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const likes = { likes: request.body.likes }

  const updatedBlog = await Blog.findByIdAndUpdate(id, likes, {
    new: true,
  })
  updatedBlog
    ? response.status(200).send(updatedBlog)
    : response.status(404).end()
})

module.exports = blogsRouter
