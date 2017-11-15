import React, { Component } from 'react'
//import PropTypes from 'prop-types'

import './MainSidebar.css'

import adchainLogo from './assets/ad_chain_logo_white_text.png'
import metaxLogo from './assets/metax_logo_white_text.png'

class MainSidebar extends Component {
  constructor (props) {
    super()

    this._Link = props.Link
  }

  render () {
    const Link = this._Link

    return (
      <div className='MainSidebar ui sidebar inverted vertical menu visible overflow-y'>
        <div className='adChainLogo ui image'>
          <a href='/'>
            <img src={adchainLogo} alt='adChain' />
          </a>
        </div>
        <div className='SidebarListContainer overflow-x'>
          <div className='SidebarList overflow-y overflow-x'>
            <div className='ListTitle ui header'>
              adChain Registry
            </div>
            <ul className='ui list'>
              <li className='item ApplyLink'>
                <Link to='/apply'>Apply now</Link>
              </li>
              <li className='item'>
                <Link to='/domains' activeClassName='active'>Domains</Link>
              </li>
              <li className='item SubListContainer'>
                <ul className='ui list'>
                  <li className='item'>
                    <Link to='/domains?inRegistry=true'>In Registry</Link>
                  </li>
                  <li className='item'>
                    <Link to='/domains?inApplication=true'>In Application</Link>
                  </li>
                  <li className='item'>
                    <Link to='/domains?inVotingCommit=true'>In Voting Commit</Link>
                  </li>
                  <li className='item'>
                    <Link to='/domains?inVotingReveal=true'>In Voting Reveal</Link>
                  </li>
                </ul>
              </li>
            </ul>
            <div className='ListTitle ui header'>
              adChain Account
            </div>
            <ul className='ui list'>
              <li className='item'>
                <Link to='/account'>Account Dashboard</Link>
              </li>
            </ul>
            <div className='ListTitle ui header'>
              Support
            </div>
            <ul className='ui list'>
              <li className='item'>
                <a
                  href='https://adchain.zendesk.com/hc/en-us'
                  target='_blank'
                  rel='noopener noreferrer'>
                  Help Desk
                </a>
              </li>
              <li className='item'>
                <a
                  href='https://adchain.zendesk.com/hc/en-us/requests/new'
                  target='_blank'
                  rel='noopener noreferrer'>
                  Submit Request / Bug
                </a>
              </li>
              <li className='item'>
                <a href='https://faucet.rinkeby.io/'
                  target='_blank'
                  rel='noopener noreferrer'>ETH Faucet</a>
              </li>
              <li className='item'>
                <a href='https://faucet.adtoken.com'
                  target='_blank'
                  rel='noopener noreferrer'>ADT Faucet</a>
              </li>
            </ul>
            <div className='ListTitle ui header'>
              Education
            </div>
            <ul className='ui list'>
              <li className='item'>
                <a
                  href='https://adtoken.com/'
                  target='_blank'
                  rel='noopener noreferrer'>
                  adToken
                </a>
              </li>
            </ul>
            <div className='ListTitle ui header'>
              Social
            </div>
            <ul className='ui list'>
              <li className='item'>
                <a
                  href='https://twitter.com/ad_chain'
                  target='_blank'
                  rel='noopener noreferrer'>
                  Twitter
                </a>
              </li>
              <li className='item'>
                <a
                  href='https://medium.com/@AdChain'
                  target='_blank'
                  rel='noopener noreferrer'>
                  Medium
                </a>
              </li>
              <li className='item'>
                <a
                  href='https://www.reddit.com/r/adChain/'
                  target='_blank'
                  rel='noopener noreferrer'>
                  Reddit
                </a>
              </li>
              <li className='item'>
                <a
                  href='https://chat.adchain.com'
                  target='_blank'
                  rel='noopener noreferrer'>
                  Rocket Chat
                </a>
              </li>
              <li className='item'>
                <a
                  href='https://github.com/adchain'
                  target='_blank'
                  rel='noopener noreferrer'>
                  Github
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className='SidebarFooter'>
          <div className='metaxLogo ui image'>
            <a href='https://metax.io' target='_blank' rel='noopener noreferrer'>
              <img src={metaxLogo} alt='MetaX' />
            </a>
          </div>
          <div className='Copyright'>
            <p>© Copyright 2017 MetaXchain, Inc.<br />
            All rights reserved.</p>
          </div>
        </div>
      </div>
    )
  }
}

MainSidebar.propTypes = {
/*
  Link: PropTypes.func
*/
}

export default MainSidebar
