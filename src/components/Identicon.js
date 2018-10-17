import React from 'react'
import PropTypes from 'prop-types'
import blockies from 'blockies'

import './Identicon.css'

function Identicon (props) {
  const address = props.address || ''
  const size = props.size || 8
  const scale = props.scale || 8

  const dataUrl = blockies({
    // lowercase it in case it's a checksummed address
    seed: address.toLowerCase(),
    size,
    scale
  }).toDataURL()

  return (
    <div className='Identicon'>
      <img src={dataUrl} alt='' />
    </div>
  )
}

Identicon.propTypes = {
  address: PropTypes.string,
  size: PropTypes.number,
  scale: PropTypes.number
}

export default Identicon
