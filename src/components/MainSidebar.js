import React, { Component } from 'react'
// import PropTypes from 'prop-types'
<<<<<<< HEAD
=======
import { Menu, Accordion } from 'semantic-ui-react'
import SideBarApplicationContainer from './SideBarApplicationContainer'
>>>>>>> 7bddfa2c90d09879fcee23267831125261a7cf95
import './MainSidebar.css'

import adchainLogo from './assets/white_text_adchain_logo.svg'
import metaxLogo from './assets/white_text_metax_logo.svg'
import adtokenLogo from './assets/adtoken_logo_white.png'
import wwwLogo from './assets/WWW.svg'
import dashboardLogo from './assets/DASHBOARD.svg'
import helpLogo from './assets/HELP.svg'
import parametersLogo from './assets/PARAMETERS.svg'
import socialLogo from './assets/SOCIALS (OPEN).svg'
import RegistryGuideModal from './RegistryGuideModal'
import { withRouter } from 'react-router-dom'
import PubSub from 'pubsub-js'

class MainSidebar extends Component {
  constructor (props) {
    super()
    this.state = {
      activeIndex: 0,
      accordionArrow: false,
      helpClicked: false,
      socialClicked: false,
      showMenu: true
    }
    this._Link = props.Link
    this._history = props.history
    this.handleClick = this.handleClick.bind(this)
    this.updateRoute = this.updateRoute.bind(this)
    this.collapse = this.toggleMenu.bind(this)
  }

  render () {
    const Link = this._Link
    const { activeIndex } = this.state

    const HelpOptions = (
      <ul style={{listStyle: 'none'}}>
        <li>
          <Link to='/' onClick={() => PubSub.publish('WelcomeModal.open')} activeClassName='active'>Welcome</Link>
        </li>
        <li>
          <Link to='/domains' onClick={() => PubSub.publish('RegistryGuideModal.show')} activeClassName='active'>View Guides</Link>
        </li>
        <li>
          <Link to='https://adchain.zendesk.com/hc/en-us/categories/115000415353-adChain-Registry-DApp' target='_blank' rel='noopener noreferrer' activeClassName='active'>Help Center</Link>
        </li>
        <li>
          <Link to='https://adchain.zendesk.com/hc/en-us/requests/new' target='_blank' rel='noopener noreferrer' activeClassName='active'>Submit a Feature Request</Link>
        </li>
      </ul>
    )

    const SocialLinks = (
      <ul style={{listStyle: 'none'}}>
        <li>
          <Link to='/chat' activeClassName='active'>Chat</Link>
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
      <Accordion as={Menu} vertical inverted className='MainSidebar sidebar visible overflow-y borderless'>
        <div className='adChainLogo ui image'>
          <a href='/'>
            <img src={adchainLogo} alt='adChain' />
          </a>
          <span className='MobileMenu' onClick={() => { this.toggleMenu() }}>
            <span />
            <span />
            <span />
          </span>
        </div>
        <div className={this.state.showMenu ? 'SidebarListContainer overflow-x' : 'hide'}>
          <div className='SidebarList overflow-y overflow-x'>
            <div className='ListTitle ui header'>
<<<<<<< HEAD
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
                <Link to='/chat'>Chat</Link>
              </li>
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
=======
              <RegistryGuideModal updateRoute={this.updateRoute} handleJoyrideCallback={this.props.handleJoyrideCallback} resumeJoyride={this.props.resumeJoyride} domainJourney={this.props.domainJourney} toggleOverlay={this.props.toggleOverlay} walkthroughFinished={this.props.walkthroughFinished} />
>>>>>>> 7bddfa2c90d09879fcee23267831125261a7cf95
            </div>
            <Menu.Item name='domain'>
              <Link to='/domains' className='NavLink' activeClassName='active'><img src={wwwLogo} alt='www' />Domains</Link>
            </Menu.Item>
            <Menu.Item name='account'>
              <Link to='/account' className='NavLink' activeClassName='active'><img src={dashboardLogo} alt='dashboard' />My Dashboard</Link>
            </Menu.Item>
            <Menu.Item name='parameter'>
              <Link to='/governance' className='NavLink' activeClassName='active'><img src={parametersLogo} alt='governance' />Governance</Link>
            </Menu.Item>
            <Menu.Item name='help'>
              <Accordion.Title
                id={1}
                active={activeIndex === 1}
                onClick={this.handleClick}>
                <img src={helpLogo} alt='help' />
              Help
              </Accordion.Title>
              <i aria-hidden='true' className={this.state.accordionArrow === 'help' ? this.state.helpClicked ? 'dropdown icon AccordionArrowRotatedHelp' : 'dropdown icon AccordionArrow' : 'dropdown icon AccordionArrow'} />
              <Accordion.Content active={activeIndex === 1} content={HelpOptions} />
            </Menu.Item>
            <Menu.Item name='social'>
              <Accordion.Title
                id={2}
                active={activeIndex === 2}
                onClick={this.handleClick}>
                <img src={socialLogo} alt='social' />
              Social
              </Accordion.Title>
              <i aria-hidden='true' className={this.state.accordionArrow === 'social' ? this.state.socialClicked ? 'dropdown icon AccordionArrowRotatedSocial' : 'dropdown icon AccordionArrow' : 'dropdown icon AccordionArrow'} />
              <Accordion.Content active={activeIndex === 2} content={SocialLinks} />
            </Menu.Item>
          </div>
        </div>
        <SideBarApplicationContainer />
        <div className='SidebarFooter'>
          <div className='PoweredBy'>
            Powered By
          </div>
          <div className='metaxLogo ui image'>
            <a href='https://metax.io' target='_blank' rel='noopener noreferrer'>
              <img src={metaxLogo} alt='MetaX' className='SidebarFooterLogos' />
            </a>
            <span className='ImageBorder' />
            <a href='https://adtoken.com' target='_blank' rel='noopener noreferrer'>
              <img src={adtokenLogo} alt='AdToken' className='SidebarFooterLogos' />
            </a>
          </div>
          <div className='Copyright'>
            <p>© Copyright 2017 MetaXchain, Inc.
            All rights reserved.</p>
          </div>
        </div>
      </Accordion>
    )
  }

  handleClick (e, titleProps) {
    const { id } = titleProps
    const { activeIndex, helpClicked, socialClicked } = this.state
    const newIndex = activeIndex === id ? -1 : id
    if (id === 1) {
      this.setState({
        activeIndex: newIndex,
        accordionArrow: 'help',
        helpClicked: !helpClicked,
        socialClicked: false
      })
    } else {
      this.setState({
        activeIndex: newIndex,
        accordionArrow: 'social',
        socialClicked: !socialClicked,
        helpClicked: false
      })
    }
  }

  toggleMenu () {
    this.setState({
      showMenu: !this.state.showMenu
    })
  }

  async updateRoute (route) {
    if (route !== window.location.pathname) {
      this._history.push(`${route}`)
    }
    await this.props.confirmWalkthrough()
  }

  collapse () {
    this.setState({
      collapse: true,
      mobile: true
    })
  }
}

export default withRouter(MainSidebar)
