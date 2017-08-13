import React, { Component } from 'react'
import commafy from 'commafy'

import Identicon from './Identicon'

import adtLogo from './assets/adtoken_logo.png'

import './MainTopbar.css'

class MainTopbar extends Component {
  render () {
    const address = '0xa1a32e5B5ceb73284Ea60922D9606373a16EbDF1'
    const adtBalance = 30452

    return (
      <div className='MainTopbar'>
        <div className='ui top attached menu stackable inverted'>
          <div className='item'>
            <div className='AddressContainer'>
              <Identicon
                address={address}
                size={6}
                scale={6} />
              <span>{address}</span>
            </div>
          </div>
          <div className='menu right'>
            <div className='item'>
              <div className='AdtLogo ui image'>
                <img
                  src={adtLogo}
                  alt='ADT' />
              </div>
              {commafy(adtBalance)}
            </div>
          </div>
        </div>

      </div>
    )
  }
}

export default MainTopbar
