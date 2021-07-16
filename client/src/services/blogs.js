import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  if (newToken) {
    token = `bearer ${newToken}`
  }
}

const getAll = async () => {
  return await axios.get(baseUrl)
}

const create = async (blog) => {
  const config = {
    headers: { Authorization: token },
  }
  return await axios.post(baseUrl, blog, config)
}

const updateBlog = async (id, blog) => {
  return await axios.put(`${baseUrl}/${id}`, blog)
}

const addComment = async (id, comment) => {
  return await axios.put(`${baseUrl}/${id}/comments`, comment)
}

const removeBlog = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  return await axios.delete(`${baseUrl}/${id}`, config)
}
// eslint-disable-next-line
export default { getAll, create, updateBlog, addComment, removeBlog, setToken }
