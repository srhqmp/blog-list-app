import blogsService from '../services/blogs'
import { handleSuccess, handleError } from './notificationReducer'

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_BLOGS':
      return action.content
    case 'ADD_BLOG':
      return state.concat(action.content)
    case 'REMOVE_BLOG':
      return state.filter((blog) => blog.id !== action.content.id)
    case 'UPDATE_BLOG':
      return state.map((blog) =>
        blog.id === action.content.id ? action.content : blog
      )
    default:
      return state
  }
}

export const initializeBlogs = () => {
  return async (dispatch) => {
    try {
      const response = await blogsService.getAll()
      dispatch({
        type: 'INIT_BLOGS',
        content: response.data.sort(
          (a, b) => parseInt(b.likes) - parseInt(a.likes)
        ),
      })
    } catch (e) {
      handleError(dispatch, e)
    }
  }
}

export const addBlog = (data) => {
  return async (dispatch) => {
    try {
      const response = await blogsService.create(data)
      dispatch({
        type: 'ADD_BLOG',
        content: response.data,
      })
      const newBlog = response.data
      const message = `a new blog ${newBlog.title} by ${newBlog.author} added`
      handleSuccess(dispatch, message)
    } catch (e) {
      handleError(dispatch, e)
    }
  }
}

export const removeBlog = (id) => {
  return async (dispatch) => {
    try {
      const response = await blogsService.removeBlog(id)
      dispatch({
        type: 'REMOVE_BLOG',
        content: { id },
      })
      handleSuccess(dispatch, response.data)
    } catch (e) {
      handleError(dispatch, e)
    }
  }
}

export const likeBlog = (data) => {
  return async (dispatch) => {
    try {
      const response = await blogsService.updateBlog(data.id, data)
      const updatedBlog = response.data
      dispatch({
        type: 'UPDATE_BLOG',
        content: updatedBlog,
      })
      const message = `You liked ${updatedBlog.title} by ${updatedBlog.author}`
      handleSuccess(dispatch, message)
    } catch (e) {
      handleError(dispatch, e)
    }
  }
}

export const addComment = (data) => {
  return async (dispatch) => {
    try {
      const response = await blogsService.addComment(data.id, data)
      const updatedBlog = response.data
      dispatch({
        type: 'UPDATE_BLOG',
        content: updatedBlog,
      })
      const message = `You've successfully added a comment on ' ${updatedBlog.title} by ${updatedBlog.author}`
      handleSuccess(dispatch, message)
    } catch (e) {
      handleError(dispatch, e)
    }
  }
}

export default reducer
