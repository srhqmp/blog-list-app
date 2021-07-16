import React from 'react'
import { Link } from 'react-router-dom'
import Login from './Login/Login'

const Navigation = () => {
  return (
    <div>
      <Link to={'/'}>blogs</Link>
      {' '}
      <Link to={'/users'}>users</Link>
      {' '}
      <Login />
    </div>
  )
}

export default Navigation
