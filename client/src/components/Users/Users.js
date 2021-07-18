import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getUsers } from '../../reducers/usersReducer'
import format from 'date-fns/format'

import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'

import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

const useStyles = makeStyles({
  link: {
    textDecoration: 'none',
  },
})

const UserList = ({ user }) => {
  const classes = useStyles()
  return (
    <TableRow>
      <TableCell>
        <Link className={classes.link} to={`/users/${user.id}`}>
          <Typography color="secondary" variant="h6">
            {user.name}
          </Typography>
        </Link>
      </TableCell>
      <TableCell>{user.blogs.length}</TableCell>
      <TableCell>{format(new Date(user.dateCreated), ' MMMM do Y')}</TableCell>
    </TableRow>
  )
}

const Users = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getUsers())
  }, [dispatch])

  const users = useSelector((state) => state.users)
  if (users) {
    return (
      <Container>
        <Typography
          variant="h4"
          color="textSecondary"
          component="h2"
          gutterBottom
        >
          Users
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Blogs Created</TableCell>
                <TableCell>User Since</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <UserList key={user.id} user={user} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    )
  } else {
    return <div></div>
  }
}

export default Users
