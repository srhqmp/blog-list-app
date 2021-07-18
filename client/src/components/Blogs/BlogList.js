import React from 'react'
import { Link } from 'react-router-dom'
import format from 'date-fns/format'

import Card from '@material-ui/core/Card'
import Container from '@material-ui/core/Container'
import CardHeader from '@material-ui/core/CardHeader'
import { CardContent, makeStyles } from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar'
import { pink, blue, green, yellow, red } from '@material-ui/core/colors'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles({
  avatar: {
    backgroundColor: (blog) => {
      switch (blog.author[0].toLowerCase()) {
        case 's':
          return red[700]
        case 'b':
          return pink[300]
        case 'g':
          return green[500]
        case 'e':
          return yellow[500]
        default:
          return blue[700]
      }
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
        <Card elevation={1} className={classes.card} style={{ width: 400 }}>
          <CardHeader
            avatar={
              <Avatar className={classes.avatar}>
                {blog.author[0].toUpperCase()}
              </Avatar>
            }
            title={blog.author}
            subheader={format(new Date(blog.dateCreated), ' MMMM do Y')}
          />
          <CardContent>
            <Container>
              <Typography color="textSecondary" noWrap>
                {blog.title}
              </Typography>
            </Container>
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}

export default BlogList
