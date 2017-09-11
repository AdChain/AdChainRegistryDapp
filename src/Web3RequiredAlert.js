import React from 'react'

import './Web3RequiredAlert.css'

function Web3RequiredAlert () {
  return (
    <div className='Web3RequiredAlert'>
      <p>Please install <a href='https://metamask.io/' target='_blank' rel='noopener noreferrer'>MetaMask Chrome Extension</a><br />in order to use this application.<br />Thanks.</p>
    </div>
  )
}

export default Web3RequiredAlert
