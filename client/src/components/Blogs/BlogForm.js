import React from 'react'
import PropType from 'prop-types'
import { useDispatch } from 'react-redux'
import { useField } from '../../hooks'

import { addBlog } from '../../reducers/blogsReducer'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'
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
})

const BlogForm = ({ blogFormRef }) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const titleInput = useField('text')
  const authorInput = useField('text')
  const urlInput = useField('text')

  const handleNewBlog = (event) => {
    event.preventDefault()

    const blogObj = {
      title: titleInput.value,
      author: authorInput.value,
      url: urlInput.value,
    }

    console.log(blogObj)
    dispatch(addBlog(blogObj))
    titleInput.onReset()
    authorInput.onReset()
    urlInput.onReset()
    blogFormRef.current.toggleVisible()
  }

  return (
    <form
      id="blogForm"
      onSubmit={handleNewBlog}
      autoComplete="off"
      className={classes.form}
    >
      <Typography
        variant="h6"
        color="textSecondary"
        component="h2"
        gutterBottom
      >
        Create New
      </Typography>
      <TextField
        className={classes.field}
        label="Title"
        variant="outlined"
        color="secondary"
        required
        {...titleInput}
        fullWidth
        size="small"
      />
      <TextField
        className={classes.field}
        label="Author"
        variant="outlined"
        color="secondary"
        required
        {...authorInput}
        fullWidth
        size="small"
      />
      <TextField
        className={classes.field}
        label="Url"
        variant="outlined"
        color="secondary"
        required
        {...urlInput}
        fullWidth
        size="small"
      />
      <Button
        type="submit"
        color="secondary"
        variant="contained"
        endIcon={<KeyboardArrowRightIcon />}
        className={classes.submit}
        size="small"
      >
        Submit
      </Button>
    </form>
  )
}

BlogForm.propType = {
  addNewBlog: PropType.func.isRequired,
}

export default BlogForm
