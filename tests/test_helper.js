const Blog = require('../models/blog')

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

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'willremovethissoon',
    author: 'Sarah Q.',
    likes: 0,
  })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await new Blog({})
  return blogs.map((blog) => blog.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
}
