import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getUsers } from '../../reducers/usersReducer'

import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import { ListItemIcon, ListItemText } from '@material-ui/core'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'

const User = () => {
  const { id } = useParams()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getUsers())
  }, [])

  const users = useSelector((state) => state.users)
  const user = users.find((user) => user.id === id)

  const displayBlogs = () => {
    if (user.blogs.length) {
      return (
        <List>
          {user.blogs.map((blog) => (
            <ListItem key={blog.id}>
              <ListItemIcon>
                <ArrowForwardIosIcon />
              </ListItemIcon>
              <ListItemText
                primary={<Link to={`/blogs/${blog.id}`}>{blog.title}</Link>}
              />
            </ListItem>
          ))}
        </List>
      )
    } else {
      return (
        <List>
          <ListItem>
            <ListItemIcon>
              <ArrowForwardIosIcon />
            </ListItemIcon>
            <ListItemText primary="No blogs to show" />
          </ListItem>
        </List>
      )
    }
  }
  return (
    <Container>
      <Typography variant="h3" component="h2" color="secondary" gutterBottom>
        {user && user.name}
      </Typography>
      <div>
        <Typography variant="h5" component="h3">
          added blogs
        </Typography>
        {user && displayBlogs()}
      </div>
    </Container>
  )
}

export default User
