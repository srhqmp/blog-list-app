import React from 'react'
import { useDispatch } from 'react-redux'
import { useField } from '../../hooks'

import { login } from '../../reducers/loginReducer'

import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'

const useStyles = makeStyles({
  field: {
    marginLeft: 5,
    display: 'inline-block',
    padding: 0
  },
  form: {
    display: 'inline',
  },
  login: {
    marginRight: 15,
    marginLeft: 15,
    display: 'inline'
  },
})

const LoginForm = ({ loginFormRef }) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const usernameInput = useField('text')
  const passwordInput = useField('password')

  const handleLogin = (e) => {
    e.preventDefault()

    const userObj = {
      username: usernameInput.value,
      password: passwordInput.value,
    }
    dispatch(login(userObj))
    usernameInput.onReset()
    passwordInput.onReset()
    loginFormRef.current.toggleVisible()
  }

  return (
    <form
      noValidate
      autoComplete="off"
      onSubmit={handleLogin}
      className={classes.form}
    >
      <TextField
        className={classes.field}
        label="username"
        variant="outlined"
        color="secondary"
        required
        {...usernameInput}
        size="small"
      />
      <TextField
        className={classes.field}
        label="password"
        variant="outlined"
        color="secondary"
        required
        {...passwordInput}
        size="small"
      />
      <Button
        type="submit"
        color="secondary"
        variant="contained"
        className={classes.login}
        size="small"
      >
        Login
      </Button>
    </form>
  )
}

export default LoginForm
