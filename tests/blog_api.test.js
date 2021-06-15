const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObject = helper.initialBlogs.map((blog) => new Blog(blog))
  const promiseArray = blogObject.map((blog) => blog.save())
  await Promise.all(promiseArray)
})

test('blog list returns correct amount of blog posts in JSON format', async () => {
  console.log('entered test')
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('blog post returns unique identifier as "id"', async () => {
  const response = await api.get('/api/blogs')
  response.body.map((blog) => expect(blog.id).toBeDefined())
})

test('a blog can be added', async () => {
  const newBlog = {
    title: 'new blog',
    author: 'SJQ',
    url: 'http://google.com',
    likes: 1,
  }
  const blogsAtStart = await helper.blogsInDb()

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd.length).toEqual(blogsAtStart.length + 1)

  const titles = blogsAtEnd.map((blog) => blog.title)
  expect(titles).toContain(newBlog.title)
})

test('likes is "0" when likes property is missing', async () => {
  const nonExistingLikes = await helper.nonExistingLikes()
  expect(nonExistingLikes.likes).toEqual(0)
})

afterAll(() => {
  mongoose.connection.close()
})
