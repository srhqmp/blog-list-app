import React from 'react'
import { Link } from 'react-router-dom'

import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar'
import { pink, blue } from '@material-ui/core/colors'

const useStyles = makeStyles({
  avatar: {
    backgroundColor: (blog) => {
      if (blog.author[0].toLowerCase() === 's') {
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
                {blog.author[0].toUpperCase()}
              </Avatar>
            }
            title={blog.author}
            subheader={blog.url}
          />
          <CardContent>
            <Typography variant="body2" color="textSecondary">
              {blog.title}
            </Typography>
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}

export default BlogList
