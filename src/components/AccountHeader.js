import React from 'react'
import PropTypes from 'prop-types'

import Identicon from './Identicon'

import './AccountHeader.css'

function AccountHeader (props) {
  const address = props.account

  return (
    <div className='AccountHeader BoxFrame'>
      <div className='ui image'>
        {address
          ? <Identicon address={address} size={8} scale={8} />
        : '-'}
      </div>
      <div className='Content'>
        <div className='Header'>
          Account
        </div>
        <div className='SubHeader overflow-x'>
          {address || 'No account connected'}
        </div>
      </div>
    </div>
  )
}

AccountHeader.propTypes = {
  account: PropTypes.string
}

export default AccountHeader
