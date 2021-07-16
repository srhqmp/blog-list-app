import axios from 'axios'
const baseUrl = '/api/users'

const getAll = async () => {
  return await axios.get(baseUrl)
}

const getUser = async (id) => {
  return await axios.get(`${baseUrl}/${id}`)
}

export default { getAll, getUser }
