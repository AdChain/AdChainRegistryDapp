import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { Menu, Button, Accordion } from 'semantic-ui-react'
import SideBarApplicationContainer from './SideBarApplicationContainer'
import './MainSidebar.css'

import adchainLogo from './assets/ad_chain_logo_white_text.png'
import metaxLogo from './assets/metax_logo_white_text.png'
import wwwLogo from './assets/WWW.svg'
import dashboardLogo from './assets/DASHBOARD.svg'
import helpLogo from './assets/HELP.svg'
import parametersLogo from './assets/PARAMETERS.svg'
import socialLogo from './assets/SOCIALS (OPEN).svg'

class MainSidebar extends Component {
  constructor (props) {
    super()
    this.state = {
      activeIndex: 0
    }
    this._Link = props.Link
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (e, titleProps) {
    const { id } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === id ? -1 : id

    this.setState({ activeIndex: newIndex })
  }

  render () {
    const Link = this._Link
    const { activeIndex } = this.state

    const HelpOptions = (
      <ul style={{listStyle: 'none'}}>
        <li>
          <Link to='/guides' activeClassName='active'>View Guides</Link>
        </li>
        <li>
          <Link to='/tooltips' activeClassName='active'>Show All Tooltips</Link>
        </li>
        <li>
          <Link to='/help' activeClassName='active'>Help Center</Link>
        </li>
        <li>
          <Link to='/request' activeClassName='active'>Submit a Feature Request</Link>
        </li>
      </ul>
    )

    const SocialLinks = (
      <ul style={{listStyle: 'none'}}>
        <li>
          <a href='https://chat.adchain.com' target='_blank' rel='noopener noreferrer'>RocketChat</a>
        </li>
        <li>
          <a href='https://twitter.com/ad_chain' target='_blank' rel='noopener noreferrer'>Twitter</a>
        </li>
        <li>
          <a href='https://medium.com/@adchain' target='_blank' rel='noopener noreferrer'>Medium</a>
        </li>
        <li>
          <a href='https://github.com/adchain' target='_blank' rel='noopener noreferrer'>GitHub</a>
        </li>
        <li>
          <a href='https://reddit.com/adchain' target='_blank' rel='noopener noreferrer'>Reddit</a>
        </li>
      </ul>
    )

    return (
      // <Menu vertical inverted className='MainSidebar sidebar visible overflow-y'>
      <Accordion as={Menu} vertical inverted className='MainSidebar sidebar visible overflow-y borderless'>
        <div className='adChainLogo ui image'>
          <a href='/'>
            <img src={adchainLogo} alt='adChain' />
          </a>
        </div>
        <div className='SidebarListContainer overflow-x'>
          <div className='SidebarList overflow-y overflow-x'>
            <div className='ListTitle ui header'>
              <Button inverted className='HelpButton' color='orange' content='How Does This Thing Work' />
            </div>
            <Menu.Item name='domain'>
              <img src={wwwLogo} alt='www' />
              <Link to='/domains' className='NavLink' activeClassName='active'>Domains</Link>
            </Menu.Item>
            <Menu.Item name='account'>
              <img src={dashboardLogo} alt='dashboard' />
              <Link to='/account' className='NavLink' activeClassName='active'>My Dashboard</Link>
            </Menu.Item>
            <Menu.Item name='parameter'>
              <img src={parametersLogo} alt='governance' />
              <Link to='/parameter' className='NavLink' activeClassName='active'>Governance</Link>
            </Menu.Item>
            <Menu.Item name='help'>
              <img src={helpLogo} alt='help' />
              <Accordion.Title
                id={1}
                active={activeIndex === 1}
                onClick={this.handleClick}
                content='Help'
              />
              <Accordion.Content active={activeIndex === 1} content={HelpOptions} />
            </Menu.Item>
            <Menu.Item name='social'>
              <img src={socialLogo} alt='social' />
              <Accordion.Title
                id={2}
                active={activeIndex === 2}
                onClick={this.handleClick}
                content='Social'
              />
              <Accordion.Content active={activeIndex === 2} content={SocialLinks} />
            </Menu.Item>
            {
              // <ul className='ui list'>
            //   <li className='item ApplyLink'>
            //     <Link to='/apply'>Apply now</Link>
            //   </li>
            //   <li className='item'>
            //     <Link to='/domains' activeClassName='active'>Domains</Link>
            //   </li>
            //   <li className='item SubListContainer'>
            //     <ul className='ui list'>
            //       <li className='item'>
            //         <Link to='/domains?inRegistry=true'>In Registry</Link>
            //       </li>
            //       <li className='item'>
            //         <Link to='/domains?inApplication=true'>In Application</Link>
            //       </li>
            //       <li className='item'>
            //         <Link to='/domains?inVotingCommit=true'>In Voting Commit</Link>
            //       </li>
            //       <li className='item'>
            //         <Link to='/domains?inVotingReveal=true'>In Voting Reveal</Link>
            //       </li>
            //     </ul>
            //   </li>
            // </ul>
            //
            // <div className='ListTitle ui header'>
            //   adChain Account
            // </div>
            // <ul className='ui list'>
            //   <li className='item'>
            //     <Link to='/account'>Account Dashboard</Link>
            //   </li>
            // </ul>
            // <div className='ListTitle ui header'>
            //   Support
            // </div>
            // <ul className='ui list'>
            //   <li className='item'>
            //     <a
            //       href='https://adchain.zendesk.com/hc/en-us'
            //       target='_blank'
            //       rel='noopener noreferrer'>
            //       Help Desk
            //     </a>
            //   </li>
            //   <li className='item'>
            //     <a
            //       href='https://adchain.zendesk.com/hc/en-us/requests/new'
            //       target='_blank'
            //       rel='noopener noreferrer'>
            //       Submit Request / Bug
            //     </a>
            //   </li>
            //   <li className='item'>
            //     <a href='https://faucet.rinkeby.io/'
            //       target='_blank'
            //       rel='noopener noreferrer'>ETH Faucet</a>
            //   </li>
            //   <li className='item'>
            //     <a href='https://faucet.adtoken.com'
            //       target='_blank'
            //       rel='noopener noreferrer'>ADT Faucet</a>
            //   </li>
            // </ul>
            // <div className='ListTitle ui header'>
            //   Education
            // </div>
            // <ul className='ui list'>
            //   <li className='item'>
            //     <a
            //       href='https://adtoken.com/'
            //       target='_blank'
            //       rel='noopener noreferrer'>
            //       adToken
            //     </a>
            //   </li>
            // </ul>
            // <div className='ListTitle ui header'>
            //   Social
            // </div>
            // <ul className='ui list'>
            //   <li className='item'>
            //     <a
            //       href='https://twitter.com/ad_chain'
            //       target='_blank'
            //       rel='noopener noreferrer'>
            //       Twitter
            //     </a>
            //   </li>
            //   <li className='item'>
            //     <a
            //       href='https://medium.com/@AdChain'
            //       target='_blank'
            //       rel='noopener noreferrer'>
            //       Medium
            //     </a>
            //   </li>
            //   <li className='item'>
            //     <a
            //       href='https://www.reddit.com/r/adChain/'
            //       target='_blank'
            //       rel='noopener noreferrer'>
            //       Reddit
            //     </a>
            //   </li>
            //   <li className='item'>
            //     <a
            //       href='https://chat.adchain.com'
            //       target='_blank'
            //       rel='noopener noreferrer'>
            //       Rocket Chat
            //     </a>
            //   </li>
            //   <li className='item'>
            //     <a
            //       href='https://github.com/adchain'
            //       target='_blank'
            //       rel='noopener noreferrer'>
            //       Github
            //     </a>
            //   </li>
            // </ul>
          }
          </div>
        </div>
        <SideBarApplicationContainer />
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
      </Accordion>
    )
  }
}

MainSidebar.propTypes = {
/*
  Link: PropTypes.func
*/
}

export default MainSidebar
