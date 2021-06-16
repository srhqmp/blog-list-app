const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Day 1',
    author: 'Sarah Q.',
    url: 'http://github.com/srhqmp',
    likes: 1,
  },
  {
    title: 'Day 2',
    author: 'Sarah Q.',
    url: 'http://github.com/srhqmp',
    likes: 2,
  },
  {
    title: 'Day 3',
    author: 'Sarah Q.',
    url: 'http://github.com/srhqmp',
    likes: 3,
  },
]

const nonExistingLikes = async () => {
  const blog = new Blog({
    title: 'no likes :(',
    author: 'Sarah Q.',
    url: 'http://google.com',
  })

  return await blog.save()
}

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'will remove soon :(',
    author: 'Sarah Q.',
    url: 'http://google.com',
  })

  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

const loginUser = async () => {
  const user = {
    username: 'root',
    password: 'secret',
  }
  const userLogIn = await api.post('/api/login').send(user)
  return userLogIn.body.token
}

module.exports = {
  initialBlogs,
  nonExistingLikes,
  nonExistingId,
  blogsInDb,
  usersInDb,
  loginUser,
}
