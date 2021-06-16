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

describe('when there is initially some blogs saved', () => {
  test('returns correct amount of blog posts in JSON format', async () => {
    console.log('entered test')
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })
})

describe('viewing a specific blog', () => {
  test('returns unique identifier as "id"', async () => {
    const response = await api.get('/api/blogs')
    response.body.map((blog) => expect(blog.id).toBeDefined())
  })

  test('succeed with status code of 200 if blog is found', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]

    const result = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(result.body).toEqual(blogToView)
  })

  test('fails with status code 404 if blog does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()
    await api.get(`/api/blogs/${validNonexistingId}`).expect(404)
  })

  test('fails with statuscode 400 if id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'
    await api.get(`/api/blogs/${invalidId}`).expect(400)
  })
})

describe('addition of a new blog', () => {
  test('returns statuscode 200 if data is valid', async () => {
    const token = await helper.loginUser()
    const newBlog = {
      title: 'new blog',
      author: 'SJQ',
      url: 'http://google.com',
      likes: 1,
    }
    const blogsAtStart = await helper.blogsInDb()
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
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

  test('respond with status code 400 Bad Request if "title" and "url" properties are missing', async () => {
    const token = await helper.loginUser()

    const blogWithoutTitle = {
      author: 'Sarah Q.',
      url: 'http://google.com',
    }
    const blogWithoutUrl = {
      title: 'no likes :(',
      author: 'Sarah Q.',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blogWithoutTitle)
      .expect(400)
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blogWithoutUrl)
      .expect(400)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with a status code of 204 if id is valid', async () => {
    const token = await helper.loginUser()
    const newBlog = {
      title: 'new blog',
      author: 'SJQ',
      url: 'http://google.com',
      likes: 1,
    }
    const blogToDelete = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtStart = await helper.blogsInDb()

    await api
      .delete(`/api/blogs/${blogToDelete.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toEqual(blogsAtStart.length - 1)

    const titles = blogsAtEnd.map((blog) => blog.title)
    expect(titles).not.toContain(blogToDelete.title)
  })

  test('will fail with statuscode 401 Unauthorized if user try to delete post of other', async () => {
    const blogToDelete = await helper.blogsInDb()
    await api.delete(`/api/blogs/${blogToDelete[0].id}`).expect(401)
  })
})

describe('updating information of a specific blog', () => {
  test('update amount of likes', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const newLikes = { likes: blogToUpdate.likes + 1 }

    const updatedBlog = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newLikes)
      .expect(200)

    expect(updatedBlog.body.likes).toEqual(blogToUpdate.likes + 1)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
