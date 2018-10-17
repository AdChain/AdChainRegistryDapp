import React, { Component } from 'react'
import { Modal, Button } from 'semantic-ui-react'
import RegistryGuideModalAdchainRegistry from './RegistryGuideModalAdchainRegistry'
import RegistryGuideModalChallengeDomain from './RegistryGuideModalChallengeDomain'
import RegistryGuideModalCommitVote from './RegistryGuideModalCommitVote'
import RegistryGuideModalRevealVote from './RegistryGuideModalRevealVote'
import RegistryGuideModalDomainJourney from './RegistryGuideModalDomainJourney'
import RegistryGuideModalGovernance from './RegistryGuideModalGovernance'
import { withRouter } from 'react-router-dom'
import './RegistryGuideModal.css'
import { ApplicationSteps } from './WalkthroughSteps'
import PubSub from 'pubsub-js'

class RegistryGuideModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false,
      size: 'small',
      menu: true,
      one: false,
      three: false,
      four: false,
      five: false,
      six: false,
      seven: false,
      lastOpened: '',
      route: 'domains',
      redirect: null
    }

    this.setGuideContent = this.setGuideContent.bind(this)
    this.returnToMenu = this.returnToMenu.bind(this)
    this.close = this.close.bind(this)
    this.show = this.show.bind(this)
    this.updateRoute = props.updateRoute
    this.startRegistryWalkthrough = this.startRegistryWalkthrough.bind(this)
    this.redirect = this.redirect.bind(this)
  }

  componentWillMount () {
    this.pubsubSubscription()
  }

  render () {
    const { open, size, menu, one, three, four, five, six, seven } = this.state

    return (
      <Modal size={size} open={open} trigger={<Button inverted className='HelpButton' onClick={this.show} content='How Does This Thing Work?' />} closeIcon className='RegistryGuideModal' onClose={this.close}>
        {menu
          ? <div>
            <Modal.Header className='RegistryGuideModalHeader'><span className='RegistryGuideModalHeaderText'>How does this thing Work?</span></Modal.Header>
            <Modal.Content>
              <div className='GuideText'>
                Choose which step-by-step guide you want to see
              </div>
              <div className='GuideButtonsContainer'>
                <Button basic className='GuideButtons' onClick={() => this.setGuideContent('one')} content='What is the adChain Registry?' />
              </div>
              <div className='GuideButtonsContainer'>
                <Button basic className='GuideButtons' onClick={() => this.startRegistryWalkthrough('RegistryGuideModal.startRegistryWalkthrough', ApplicationSteps)} content='How do I apply a domain into the adChain Registry?' />
              </div>
              <div className='GuideButtonsContainer'>
                <Button basic className='GuideButtons' onClick={() => this.setGuideContent('three')} content='How do I challenge a domain?' />
              </div>
              <div className='GuideButtonsContainer'>
                <Button basic className='GuideButtons' onClick={() => this.setGuideContent('four')} content='How do I commit a vote?' />
              </div>
              <div className='GuideButtonsContainer'>
                <Button basic className='GuideButtons' onClick={() => this.setGuideContent('five')} content='How do I reveal a vote?' />
              </div>
              <div className='GuideButtonsContainer'>
                <Button basic className='GuideButtons' onClick={() => this.setGuideContent('six')} content="What is a domain's journey in the adChain Registry?" />
              </div>
              <div className='GuideButtonsContainer'>
                <Button basic className='GuideButtons' onClick={() => this.setGuideContent('seven')} content='How do I interact with the Governance Module?' />
              </div>
              <div className='GuideText'>
                Can’t find what you’re looking for? Click <a href='https://metax.zendesk.com/hc/en-us' target='_blank' rel='noopener noreferrer'>here</a> to visit the help center.
              </div>
            </Modal.Content>
          </div>
          : one ? <RegistryGuideModalAdchainRegistry returnToMenu={this.returnToMenu} section={'one'} close={this.close} />
            : three ? <RegistryGuideModalChallengeDomain returnToMenu={this.returnToMenu} section={'three'} />
              : four ? <RegistryGuideModalCommitVote returnToMenu={this.returnToMenu} section={'four'} />
                : five ? <RegistryGuideModalRevealVote returnToMenu={this.returnToMenu} section={'five'} />
                  : six ? <RegistryGuideModalDomainJourney returnToMenu={this.returnToMenu} />
                    : seven ? <RegistryGuideModalGovernance returnToMenu={this.returnToMenu} section={'seven'} />
                      : null
        }
      </Modal>
    )
  }

  async setGuideContent (section) {
    let guideToDisplay = {}
    guideToDisplay[section] = true
    guideToDisplay['menu'] = false
    guideToDisplay['lastOpened'] = section
    if (section === 'seven') {
      await this.updateRoute({
        pathname: '/governance',
        state: { registryGuideSrc: true }
      })
    }
    this.setState(guideToDisplay)
  }

  async returnToMenu (section = null) {
    const { lastOpened, redirect } = this.state
    let guideToDisplay = {}
    guideToDisplay[section] = !(section)
    guideToDisplay[lastOpened] = false
    guideToDisplay['menu'] = true
    if (redirect) {
      guideToDisplay['open'] = false
      await this.updateRoute({
        pathname: redirect,
        state: { cameFromRedirect: true }
      })
    } else {
      guideToDisplay['open'] = true
      await this.updateRoute('/domains')
    }
    guideToDisplay['redirect'] = null
    this.setState(guideToDisplay)
  }

  close () {
    const { lastOpened, menu } = this.state
    let guideToDisplay = {}
    guideToDisplay[lastOpened] = false
    guideToDisplay['menu'] = true
    guideToDisplay['open'] = false
    if (lastOpened === 'six' && !menu) {
      PubSub.publish('RegistryWalkthrough.resetSteps')
      this.returnToMenu()
    }
    this.setState(guideToDisplay)

  }

  async show () {
    window.localStorage.setItem('returningUser', 'true')
    if (window.location.pathname !== '/domains') {
      await this.updateRoute('./')
    }
    this.setState({ open: true })
  }

  async startRegistryWalkthrough (topic, steps) {
    if (steps[0].name !== 'domainsjourney-first-step') {
      if (this.props.location.pathname === '/governance' && !this.props.location.state) {
        PubSub.publish('GovernanceContainer.closeModal')
      }
      this.close()
    }
    await PubSub.publish('RegistryWalkthrough.startJoyride', steps)
  }

  redirect (topic, route) {
    this.setState({
      redirect: route
    })
  }

  pubsubSubscription () {
    this.startRegistryWalkthroughEvent = PubSub.subscribe('RegistryGuideModal.startRegistryWalkthrough', this.startRegistryWalkthrough)
    this.viewGuideEvent = PubSub.subscribe('RegistryGuideModal.show', this.show)
    this.redirectEvent = PubSub.subscribe('RegistryGuideModal.redirect', this.redirect)
    this.returnToMenuEvent = PubSub.subscribe('RegistryGuideModal.returnToMenu', this.returnToMenu)
  }
}

export default withRouter(RegistryGuideModal)
