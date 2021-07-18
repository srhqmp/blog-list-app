import React, { useEffect } from 'react'
import { useField } from '../hooks'
import { useHistory } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { addNewUser } from '../reducers/usersReducer'
import { checkLogin } from '../reducers/loginReducer'

import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'

const useStyles = makeStyles({
  field: {
    marginTop: 20,
    marginBottom: 20,
    display: 'block',
  },
  form: {
    display: 'inline',
  },
  submit: {
    marginRight: 5,
  },
  content: {
    padding: 20,
    maxWidth: 600
  },
  title: {
    marginTop: 70,
  },
})

export const RegisterUser = () => {
  const classes = useStyles()
  const usernameInput = useField('text')
  const nameInput = useField('text')
  const passwordInput = useField('password')
  const history = useHistory()
  const loggedinUser = useSelector((state) => state.loggedinUser)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(checkLogin())
  }, [dispatch])

  useEffect(() => {
    if (loggedinUser) {
      usernameInput.onReset()
      nameInput.onReset()
      passwordInput.onReset()
      history.push('/')
    }
  }, [loggedinUser])

  const handleSubmit = (e) => {
    e.preventDefault()
    const userObj = {
      username: usernameInput.value,
      name: nameInput.value,
      password: passwordInput.value,
    }
    dispatch(addNewUser(userObj))
  }

  return (
    <Container className={classes.container}>
      <Typography
        variant="h3"
        color="secondary"
        component="h2"
        gutterBottom
        className={classes.title}
      >
        Register
      </Typography>
      <Paper className={classes.content}>
        <form
          id="blogForm"
          onSubmit={handleSubmit}
          autoComplete="off"
          className={classes.form}
        >
          <TextField
            className={classes.field}
            label="Username"
            variant="outlined"
            color="secondary"
            required
            {...usernameInput}
            fullWidth
          />
          <TextField
            className={classes.field}
            label="Name"
            variant="outlined"
            color="secondary"
            required
            {...nameInput}
            fullWidth
          />
          <TextField
            className={classes.field}
            label="Password"
            variant="outlined"
            color="secondary"
            required
            {...passwordInput}
            fullWidth
          />
          <Button
            type="submit"
            color="secondary"
            variant="contained"
            className={classes.submit}
          >
            Submit
          </Button>
        </form>
      </Paper>
    </Container>
  )
}

export default RegisterUser
