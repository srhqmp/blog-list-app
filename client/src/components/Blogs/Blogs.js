import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import BlogList from './BlogList'

import { checkLogin } from '../../reducers/loginReducer'
import { initializeBlogs } from '../../reducers/blogsReducer'
import Togglable from '../Togglable'
import BlogForm from './BlogForm'

import Container from '@material-ui/core/Container'
import Masonry from 'react-masonry-css'

const Blogs = () => {
  const blogs = useSelector((state) => state.blogs)
  const loggedinUser = useSelector((state) => state.loggedinUser)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(checkLogin())
  }, [dispatch])

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  const blogFormRef = useRef()

  const blogForm = () => (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <BlogForm blogFormRef={blogFormRef} />
    </Togglable>
  )

  const blogList = () =>
    blogs.map((blog) => (
      <BlogList key={blog.id} blog={blog} loggedinUser={loggedinUser} />
    ))

  const breakpoints = {
    default: 3,
    1100: 2,
    700: 1,
  }

  return (
    <Container>
      <Masonry
        breakpointCols={breakpoints}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {loggedinUser && blogForm()}
        {blogList()}
      </Masonry>
    </Container>
  )
}

export default Blogs
