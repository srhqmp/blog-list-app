import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { checkLogin } from '../reducers/loginReducer'

import { makeStyles, useTheme } from '@material-ui/core'
import Drawer from '@material-ui/core/Drawer'
import Typography from '@material-ui/core/Typography'
import { Link, useHistory, useLocation } from 'react-router-dom'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { Reorder, PeopleOutline } from '@material-ui/icons'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import { format } from 'date-fns'
import Hidden from '@material-ui/core/Hidden'
import MenuIcon from '@material-ui/icons/Menu'
import IconButton from '@material-ui/core/IconButton'
import BlogForm from './Blogs/BlogForm'
import Togglable from './Togglable'
import { Divider } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import GitHubIcon from '@material-ui/icons/GitHub'

import Login from './Login/Login'

const drawerWidth = 240

const useStyles = makeStyles((theme) => {
  return {
    page: {
      [theme.breakpoints.up('sm')]: {
        width: '100%',
        marginLeft: drawerWidth,
      },
      margin: 'auto',
    },
    root: {
      display: 'flex',
    },
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    drawerPaper: {
      width: drawerWidth,
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    active: {
      background: '#f4f4f4',
    },
    titleBox: {
      height: 44,
    },
    title: {
      position: 'relative',
      top: 15,
      left: 15,
      textDecoration: 'none',
    },
    appBar: {
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
    },
    date: {
      flexGrow: 1,
    },
    toolbar: theme.mixins.toolbar,
    avatar: {
      marginLeft: theme.spacing(2),
    },
    divider: {
      marginBottom: 20,
      marginTop: 20,
    },
    titleDivider: {
      marginTop: 100,
      marginBottom: 20,
    },
    register: {
      position: 'relative',
      left: -10,
      top: -2,
    },
  }
})

const Layout = ({ children, window }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const classes = useStyles()
  const history = useHistory()
  const theme = useTheme()
  const location = useLocation()

  const loggedinUser = useSelector((state) => state.loggedinUser)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(checkLogin())
  }, [dispatch])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const menuItems = [
    {
      text: 'Blogs',
      icon: <Reorder color="secondary" />,
      path: '/',
    },
    {
      text: 'Users',
      icon: <PeopleOutline color="secondary" />,
      path: '/users',
    },
  ]

  const container =
    window !== undefined ? () => window().document.body : undefined

  const blogFormRef = useRef()

  const blogForm = () => (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <BlogForm blogFormRef={blogFormRef} />
    </Togglable>
  )

  const drawer = (
    <div>
      <div className={classes.titleBox}>
        <Typography
          variant="h3"
          className={classes.title}
          component={Link}
          to="/"
        >
          Blog List App
        </Typography>
      </div>
      <Divider className={classes.titleDivider} />
      {/* links/list section */}
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => history.push(item.path)}
            className={location.pathname === item.path ? classes.active : null}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}

        <ListItem
          button
          href="https://github.com/srhqmp/blog-list-app"
          target="_blank"
          component="a"
        >
          <ListItemIcon>
            <GitHubIcon color="secondary" />
          </ListItemIcon>
          <ListItemText primary="View Code" />
        </ListItem>
        <Divider className={classes.divider} />
        {loggedinUser && blogForm()}
      </List>
    </div>
  )

  return (
    <div className={classes.root}>
      {/* app bar */}
      <AppBar
        position="fixed"
        className={classes.appBar}
        elevation={0}
        color="primary"
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.date}>
            {format(new Date(), ' MMMM do Y')}
          </Typography>
          <Login />
          {!loggedinUser && (
            <Button
              component={Link}
              to={'/register'}
              color="primary"
              variant="contained"
              className={classes.register}
              size="small"
            >
              Register
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* side drawer */}
      <Hidden smUp implementation="css">
        <Drawer
          container={container}
          variant="temporary"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          {drawer}
        </Drawer>
      </Hidden>
      {/* main content */}
      <div className={classes.page}>
        <div className={classes.toolbar}></div>
        {children}
      </div>
    </div>
  )
}

export default Layout
