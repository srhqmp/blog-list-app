/* eslint-disable react/react-in-jsx-scope */
import PropType from 'prop-types'
import { useSelector } from 'react-redux'

import Typography from '@material-ui/core/Typography'

const Notification = () => {
  const notification = useSelector((state) => state.notification)

  return (
    <Typography
      variant="subtitle1"
      gutterBottom
      className={notification.classification}
    >
      {notification.message}
    </Typography>
  )
}

Notification.propType = {
  message: PropType.string.isRequired,
  classification: PropType.string.isRequired,
}

export default Notification
