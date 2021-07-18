import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from '../../reducers/blogsReducer'
import { likeBlog, removeBlog, addComment } from '../../reducers/blogsReducer'
import { checkLogin } from '../../reducers/loginReducer'
import { useField } from '../../hooks'
import { format } from 'date-fns'

import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import LinkOutlinedIcon from '@material-ui/icons/LinkOutlined'
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined'
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined'
import Button from '@material-ui/core/Button'
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined'
import IconButton from '@material-ui/core/IconButton'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
//import Link from '@material-ui/core/Link'
import TextField from '@material-ui/core/TextField'
import Divider from '@material-ui/core/Divider'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import Avatar from '@material-ui/core/Avatar'
import { pink } from '@material-ui/core/colors'

const useStyles = makeStyles({
  paper: {
    padding: '30px 20px 50px 20px',
  },
  details: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: -5,
  },
  link: {
    maxWidth: 'auto',
  },
  icon: {
    marginRight: 10,
    width: 50,
  },
  removeBtn: {
    marginTop: 20,
    marginLeft: 12,
  },
  likeBtn: {
    marginTop: 5,
  },
  comments: {
    marginTop: 20,
    marginBottom: 10,
  },
  commentBtn: {
    marginTop: 15,
    marginBottom: 5,
  },
  divider: {
    marginTop: 30,
  },
  avatar: {
    backgroundColor: pink[700],
  },
  dateCreated: {
    marginTop: 10,
    display: 'flex',
  },
})

const Blog = () => {
  const classes = useStyles()
  const { id } = useParams()
  const loggedinUser = useSelector((state) => state.loggedinUser)
  const dispatch = useDispatch()
  const history = useHistory()
  const commentInput = useField('text')

  useEffect(() => {
    dispatch(checkLogin())
  }, [dispatch])

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  const blogs = useSelector((state) => state.blogs)
  const blog = blogs.find((blog) => blog.id === id)

  const handleLikes = () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    dispatch(likeBlog(updatedBlog))
  }

  const likeBtn = () => (
    <IconButton
      id="likeButton"
      onClick={handleLikes}
      color="secondary"
      className={classes.icon}
    >
      <ThumbUpAltOutlinedIcon />
    </IconButton>
  )

  const displayLikes = (likes) => {
    return (
      <Typography
        variant="subtitle1"
        color="textSecondary"
        className={classes.details}
      >
        {loggedinUser && loggedinUser.username !== blog.user.username ? (
          likeBtn()
        ) : (
          <IconButton
            id="likeButton"
            disabled
            color="default"
            className={classes.icon}
          >
            <ThumbUpAltOutlinedIcon />
          </IconButton>
        )}
        <span> {likes} </span>
      </Typography>
    )
  }

  const handleRemoveBlog = () => {
    const id = blog.id
    dispatch(removeBlog(id))
    history.push('')
  }

  const removeBtn = () => {
    return (
      <Button
        id="removeButton"
        color="secondary"
        variant="contained"
        onClick={handleRemoveBlog}
        className={classes.removeBtn}
        startIcon={<DeleteOutlinedIcon />}
      >
        remove
      </Button>
    )
  }

  const handleComment = (e) => {
    e.preventDefault()
    const blogObj = {
      id: blog.id,
      comment: commentInput.value,
    }
    dispatch(addComment(blogObj))
    commentInput.onReset()
  }

  const inputAddComment = () => {
    return (
      <form onSubmit={handleComment}>
        <TextField
          label="Add comment"
          variant="outlined"
          multiline
          color="secondary"
          {...commentInput}
          required
          rows={4}
          fullWidth
        />
        <Button
          type="submit"
          color="secondary"
          variant="contained"
          className={classes.commentBtn}
        >
          add comment
        </Button>
      </form>
    )
  }

  const displayComments = (comments) => {
    return (
      <Container>
        <Typography
          variant="h6"
          color="textSecondary"
          component="h2"
          gutterBottom
          className={classes.comments}
        >
          Anonymous Comments
        </Typography>
        {inputAddComment()}
        {comments ? (
          <Card elevation={0} className={classes.comments}>
            {comments.map((comment, index) => (
              <div key={index}>
                <CardHeader
                  title={comment}
                  avatar={
                    <Avatar className={classes.avatar}>
                      {comment[0].toUpperCase()}
                    </Avatar>
                  }
                />
                <Divider />
              </div>
            ))}
          </Card>
        ) : (
          'Be the first one to comment on this blog'
        )}
      </Container>
    )
  }

  return (
    <Container>
      <Typography variant="h4" component="h2" color="secondary" gutterBottom>
        {blog && blog.title}
      </Typography>
      <Paper className={classes.paper}>
        <Typography
          variant="subtitle1"
          color="textSecondary"
          className={classes.link}
        >
          {blog && (
            <a
              href={blog.url}
              target="_blank"
              rel="noreferrer"
              className={classes.details}
            >
              <LinkOutlinedIcon className={classes.icon} /> {blog.url}
            </a>
          )}
        </Typography>
        {blog && displayLikes(blog.likes)}
        <Typography
          variant="subtitle1"
          color="textSecondary"
          className={classes.details}
        >
          <PersonOutlineOutlinedIcon className={classes.icon} />
          {blog && `added by ${blog.author}`}
        </Typography>
        <Typography
          variant="subtitle1"
          color="textSecondary"
          className={(classes.details, classes.dateCreated)}
        >
          <CalendarTodayIcon className={classes.icon} />
          {blog &&
            `Posted on ${format(new Date(blog.dateCreated), ' MMMM do Y')}`}
        </Typography>
        {blog && loggedinUser && removeBtn()}
        <Divider className={classes.divider} />
        {blog && displayComments(blog.comments)}
      </Paper>
    </Container>
  )
}

export default Blog
