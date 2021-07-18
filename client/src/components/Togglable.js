import React, { useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'

const Togglable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const showWhenVisible = { display: visible ? '' : 'none' }
  const hideWhenVisible = { display: visible ? 'none' : '' }

  const toggleVisible = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return { toggleVisible }
  })

  return (
    <Container style={{ marginTop: 5 }}>
      <span style={hideWhenVisible}>
        <Button
          type="submit"
          color="secondary"
          variant="contained"
          onClick={toggleVisible}
          style={{ width: '100%', marginTop: -10 }}
          size="small"
        >
          {props.buttonLabel}
        </Button>
      </span>
      <span style={showWhenVisible}>
        {props.children}
        <Button
          type="submit"
          color="secondary"
          variant="contained"
          onClick={toggleVisible}
          display="inline"
          size="small"
        >
          cancel
        </Button>
      </span>
    </Container>
  )
})

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
}

Togglable.displayName = 'Togglable'

export default Togglable
