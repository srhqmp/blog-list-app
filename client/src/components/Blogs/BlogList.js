import React from 'react'
import { Link } from 'react-router-dom'

import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import { makeStyles } from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar'
import { pink, blue } from '@material-ui/core/colors'

const useStyles = makeStyles({
  avatar: {
    backgroundColor: (blog) => {
      if (blog.title[0].toLowerCase() === 's') {
        return pink[700]
      }
      return blue[500]
    },
  },
  link: {
    textDecoration: 'none',
  },
  card: {
    '&:hover': {
      transform: 'scale3d(1.05, 1.05, 1)',
    },
  },
})

const BlogList = ({ blog }) => {
  const classes = useStyles(blog)

  return (
    <div>
      <Link to={`/blogs/${blog.id}`} className={classes.link}>
        <Card elevation={1} className={classes.card}>
          <CardHeader
            avatar={
              <Avatar className={classes.avatar}>
                {blog.title[0].toUpperCase()}
              </Avatar>
            }
            title={blog.title}
            subheader={blog.author}
          />
        </Card>
      </Link>
    </div>
  )
}

export default BlogList
