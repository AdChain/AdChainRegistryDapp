import React, { Component } from 'react'
import { Menu, Accordion } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import PubSub from 'pubsub-js'
import isMobile from 'is-mobile'

import SideBarApplicationContainer from './SideBarApplicationContainer'
import adchainPublisherLogo from '../assets/adchain_publisher_logo.svg'
import metaxLogo from '../assets/white_text_metax_logo.svg'
import adtokenLogo from '../assets/adtoken_logo_white.png'
import wwwLogo from '../assets/WWW.svg'
import dashboardLogo from '../assets/DASHBOARD.svg'
import helpLogo from '../assets/HELP.svg'
import parametersLogo from '../assets/PARAMETERS.svg'
import socialLogo from '../assets/SOCIALS (OPEN).svg'
import toolsLogo from '../assets/TOOLS.svg'
import RegistryGuideModal from '../registry_guide/RegistryGuideModal'

import './MainSidebar.css'

class MainSidebar extends Component {
  constructor (props) {
    super()
    this.state = {
      activeIndex: 0,
      accordionArrow: false,
      helpClicked: false,
      socialClicked: false,
      toolsClicked: false,
      showMenu: true,
      mobile: isMobile()
    }
    this._Link = props.Link
    this._history = props.history
    this.handleClick = this.handleClick.bind(this)
    this.updateRoute = this.updateRoute.bind(this)
    this.collapse = this.toggleMenu.bind(this)
    this.pushHistory = this.pushHistory.bind(this)
  }

  componentWillMount () {
    this.updateEvent = PubSub.subscribe('MainSidebar.PushHistory', this.pushHistory)
  }

  componentDidMount () {
    window.google.translate.TranslateElement({ pageLanguage: 'en', layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE }, 'google_translate_element')
  }

  render () {
    const Link = this._Link
    const { activeIndex } = this.state

    const ToolsLinks = (
      <ul style={{listStyle: 'none'}}>
        <li>
        <Link to='/index' activeClassName='active'>adChain Index</Link>
        </li>
      </ul>
    )

    const HelpOptions = (
      <ul style={{listStyle: 'none'}}>
        <li>
          <Link to='/' onClick={() => PubSub.publish('WelcomeModal.open')} activeClassName='active'>Welcome</Link>
        </li>
        <li>
          <Link to='/domains' onClick={() => PubSub.publish('RegistryGuideModal.show')} activeClassName='active'>View Guides</Link>
        </li>
        <li>
          <a href='https://metax.zendesk.com/hc/en-us' target='_blank' rel='noopener noreferrer'>Help Center</a>
        </li>
        <li>
          <a href='https://goo.gl/forms/px9fgyKhFrZDjBV42' target='_blank' rel='noopener noreferrer'>Submit Feedback</a>
        </li>
      </ul>
    )

    const SocialLinks = (
      <ul style={{listStyle: 'none'}}>
        <li>
          <a href='https://t.me/adChain' target='_blank' rel='noopener noreferrer'>Telegram</a>
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
          <a href='https://reddit.com/r/adchain' target='_blank' rel='noopener noreferrer'>Reddit</a>
        </li>
      </ul>
    )

    return (
      <Accordion as={Menu} vertical inverted className='MainSidebar sidebar visible overflow-y borderless'>
        <div className='adChainLogo ui image'>
          <a href='/'>
            <object className='adchainPublisherLogo' type='image/svg+xml' data={adchainPublisherLogo} aria-label='adchainPublisherLogo' />
          </a>
        </div>
        <div className={this.state.mobile ? 'hide': 'SidebarListContainer overflow-x'}>
          <div className='SidebarList overflow-y overflow-x'>
            <div className='ListTitle ui header'>
              <RegistryGuideModal updateRoute={this.updateRoute} />
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
            <Menu.Item name='tools'>
              <Accordion.Title
                id={1}
                active={activeIndex === 1}
                onClick={this.handleClick}>
                <img src={toolsLogo} alt='tools' />
              Tools
                <i aria-hidden='true' className={this.state.accordionArrow === 'social' ? this.state.toolsClicked ? 'dropdown icon AccordionArrowRotatedSocial' : 'dropdown icon AccordionArrow' : 'dropdown icon AccordionArrow'} />
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 1} content={ToolsLinks} />
            </Menu.Item>
            <Menu.Item name='help'>
              <Accordion.Title
                id={2}
                active={activeIndex === 2}
                onClick={this.handleClick}>
                <img src={helpLogo} alt='help' />
              Help
                <i aria-hidden='true' className={this.state.accordionArrow === 'help' ? this.state.helpClicked ? 'dropdown icon AccordionArrowRotatedHelp' : 'dropdown icon AccordionArrow' : 'dropdown icon AccordionArrow'} />
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 2} content={HelpOptions} />
            </Menu.Item>
            <Menu.Item name='social'>
              <Accordion.Title
                id={3}
                active={activeIndex === 3}
                onClick={this.handleClick}>
                <img src={socialLogo} alt='social' />
              Social
                <i aria-hidden='true' className={this.state.accordionArrow === 'social' ? this.state.socialClicked ? 'dropdown icon AccordionArrowRotatedSocial' : 'dropdown icon AccordionArrow' : 'dropdown icon AccordionArrow'} />
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 3} content={SocialLinks} />
            </Menu.Item>
          </div>
        </div>
        <SideBarApplicationContainer />
        <div className='SidebarFooter'>
          <div id='google_translate_element' />
          <div className='ReleaseCandidate'><a href='https://metax.zendesk.com/hc/en-us/articles/360003427494' target='_blank' rel='noopener noreferrer'>Release Candidate</a></div>
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
            <p>© Copyright 2019 MetaXchain, Inc.</p>
            <p>All rights reserved.</p>
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

  async pushHistory (topic, route) {
    await this._history.push(route)
  }

  async updateRoute (route) {
    let pathName = route.pathname || route
    if (pathName !== window.location.pathname) {
      // this._history.push(`${route}`)
      await this._history.push(route)
    }
    // await this.confirmWalkthrough()
  }

  collapse () {
    this.setState({
      collapse: true,
      mobile: true
    })
  }
}

export default withRouter(MainSidebar)
