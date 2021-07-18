import usersService from '../services/users'
import { handleError, handleSuccess } from './notificationReducer'
import blogService from '../services/blogs'
import { checkLogin } from './loginReducer'

const reducer = (state = null, action) => {
  switch (action.type) {
    case 'GET_USERS':
      return action.content
    default:
      return state
  }
}

export const addNewUser = (userObj) => {
  return async (dispatch) => {
    try {
      const response = await usersService.addNewUser(userObj)
      blogService.setToken(response.data.token)
      window.localStorage.setItem(
        'BlogAppLoggedinUser',
        JSON.stringify(response.data)
      )
      dispatch(checkLogin())
      const message = `Successfully registered user ${response.data.username}`
      handleSuccess(dispatch, message)
    } catch (e) {
      handleError(dispatch, e)
    }
  }
}

export const getUsers = () => {
  return async (dispatch) => {
    try {
      const response = await usersService.getAll()
      dispatch({
        type: 'GET_USERS',
        content: response.data,
      })
    } catch (e) {
      handleError(dispatch, e)
    }
  }
}

export default reducer
