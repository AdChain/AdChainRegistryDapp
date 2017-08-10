import React from 'react'

import Identicon from './Identicon'

import './AccountHeader.css'

function AccountHeader (props) {
  const address = '0xa1a32e5B5ceb73284Ea60922D9606373a16EbDF1'

  return (
    <div className='AccountHeader BoxFrame'>
      <div className='ui image'>
        <Identicon address={address} size={8} scale={8} />
      </div>
      <div className='Content'>
        <div className='Header'>
          Account
        </div>
        <div className='SubHeader'>
          {address}
        </div>
      </div>
    </div>
  )
}

export default AccountHeader
