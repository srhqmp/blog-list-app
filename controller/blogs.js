const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const userExtractor = require('../utils/middleware').userExtractor

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
blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    likes: body.likes,
    url: body.url,
    user: user._id,
    username: user.username,
  })

  let savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  savedBlog ? response.status(200).json(savedBlog) : response.status(400).end()
})

const checkBlogInUser = (user, blogId) => {
  return user.blogs.find((blog) => blog.id === blogId)
}

// DELETE a blog
blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const id = request.params.id
  const user = request.user
  const blog = await Blog.findById(id)

  if (!blog) {
    return response.status(404).send('Blog not found')
  }

  // check if blog exists in username lists
  const blogExists = checkBlogInUser(user, id)

  if (blogExists) {
    await Blog.findByIdAndRemove(blog.id)

    user.blogs = user.blogs.filter((blog) => blog.id !== id)
    await user.save()

    return response.json(`Successfully deleted blog ${blog.title}`)
  } else {
    return response.status(404).send('You cannot delete blog of other user')
  }
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

//ADD comment to a blog
blogsRouter.put('/:id/comments?', async (request, response) => {
  const id = request.params.id
  const user = request.user
  const body = request.body

  const comment = body.comment
  const blog = await Blog.findById(id)

  if (!comment) {
    return response.status(400).send(`Can't add empty comment`)
  } else if (!blog) {
    return response.status(404).send(`Blog doesn't exist`)
  }

  const comments = blog.comments ? [...blog.comments, comment] : [comment]

  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    { comments },
    { new: true }
  )

  updatedBlog
    ? response.status(200).send(updatedBlog)
    : response.status(404).end()
})

module.exports = blogsRouter
