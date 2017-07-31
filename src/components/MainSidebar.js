import React, { Component } from 'react'

import './MainSidebar.css'

import adchainLogo from './assets/ad_chain_logo_white_text.png'
import metaxLogo from './assets/metax_logo_white_text.png'

class MainSidebar extends Component {
  componentDidMount() {
    /*
    window.$('.ui.sidebar')
    .sidebar({
      dimPage:false
    })
    */
  }

  render () {
    return (
        <div className='MainSidebar ui sidebar inverted vertical menu visible'>
        <div className='adChainLogo ui image'>
          <a href='/'>
            <img src={adchainLogo} alt='adChain' />
          </a>
        </div>
        <div className='ListTitle ui header'>
          adChain Registry
        </div>
        <div>
          <ul className='ui list'>
            <li className='item'><a>All domains</a></li>
            <li className='item'><a>Domains in registry</a></li>
            <li className='item'><a>Domains in application</a></li>
            <li className='item'><a>Domains in voting</a></li>
            <li className='item'><a>Rejected domains</a></li>
            <li className='item ApplyLink'><a>Apply now</a></li>
          </ul>
        </div>
        <div className='metaxLogo ui image'>
          <a href='https://metax.io' target='_blank'>
            <img src={metaxLogo} alt='MetaX' />
          </a>
        </div>
        <div className='Copyright'>
        © Copyright 2017 MetaXchain, Inc. All rights reserved.
        </div>
      </div>
    )
  }
}

export default MainSidebar
