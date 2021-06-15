const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// GET all blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
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
  const blog = new Blog(request.body)
  const savedBlog = await blog.save()
  response.status(200).json(savedBlog)
})

// DELETE a blog
blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  await Blog.findByIdAndRemove(id)
  response.status(204).end()
})

// UPDATE a blog likes
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
