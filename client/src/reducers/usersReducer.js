import usersService from '../services/users'
import { handleError } from './notificationReducer'

const reducer = (state = null, action) => {
  switch (action.type) {
    case 'GET_USERS':
      return action.content
    default:
      return state
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
