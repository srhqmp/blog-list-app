import React, { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import LoginForm from './LoginForm'
import Togglable from '../Togglable'
import { useDispatch, useSelector } from 'react-redux'
import { checkLogin, logout } from '../../reducers/loginReducer'
import { handleSuccess } from '../../reducers/notificationReducer'
import { useHistory } from 'react-router'

import Button from '@material-ui/core/Button'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import Typography from '@material-ui/core/Typography'

const Login = () => {
  const history = useHistory()
  const loggedinUser = useSelector((state) => state.loggedinUser)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(checkLogin())
  }, [dispatch])

  const handleLogout = () => {
    const message = `Successfully logged out ${loggedinUser.username}`
    dispatch(logout())
    handleSuccess(dispatch, message)
    history.push('/')
  }
  const userLogout = () => (
    <Typography style={{ position: 'relative', top: 2 }}>
      <Link
        to={`/users/${loggedinUser.id}`}
        style={{
          textDecoration: 'none',
          color: 'purple',
          textTransform: 'capitalize',
          marginRight: 5,
        }}
      >{`Hi ${loggedinUser.name}!`}</Link>
      <Button
        color="secondary"
        variant="contained"
        onClick={handleLogout}
        style={{ marginLeft: 5 }}
      >
        <ExitToAppIcon />
      </Button>
    </Typography>
  )

  const loginFormRef = useRef()
  const loginForm = () => (
    <Togglable buttonLabel="login" ref={loginFormRef}>
      <LoginForm loginFormRef={loginFormRef} />
    </Togglable>
  )

  return <span>{loggedinUser ? userLogout() : loginForm()}</span>
}

export default Login
