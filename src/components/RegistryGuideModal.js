import React, { Component } from 'react'
import { Modal, Button } from 'semantic-ui-react'
import RegistryGuideModalAdchainRegistry from './RegistryGuideModalAdchainRegistry'
import RegistryGuideModalApplyDomain from './RegistryGuideModalApplyDomain'
import RegistryGuideModalChallengeDomain from './RegistryGuideModalChallengeDomain'
import RegistryGuideModalCommitVote from './RegistryGuideModalCommitVote'
import RegistryGuideModalRevealVote from './RegistryGuideModalRevealVote'
import RegistryGuideModalDomainJourney from './RegistryGuideModalDomainJourney'
import RegistryGuideModalGovernance from './RegistryGuideModalGovernance'
import { withRouter } from 'react-router-dom'
import './RegistryGuideModal.css'

class RegistryGuideModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false,
      size: 'small',
      menu: true,
      one: false,
      two: false,
      three: false,
      four: false,
      five: false,
      six: false,
      seven: false,
      lastOpened: '',
      route: 'domains'
    }

    this.setGuideContent = this.setGuideContent.bind(this)
    this.returnToMenu = this.returnToMenu.bind(this)
    this.close = this.close.bind(this)
    this.show = this.show.bind(this)
    this.updateRoute = props.updateRoute
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.walkthroughFinished === true) {
      this.returnToMenu()
    }
  }

  render () {
    const { open, size, menu, one, two, three, four, five, six, seven } = this.state

    return (
      <Modal size={size} open={open} trigger={<Button inverted className='HelpButton' onClick={this.show} color='orange' content='How Does This Thing Work?' />} closeIcon className='RegistryGuideModal' onClose={this.close}>
        {menu
          ? <div>
            <Modal.Header className='RegistryGuideModalHeader'><span className='RegistryGuideModalHeaderText'>What is the Adchain Registry?</span></Modal.Header>
            <Modal.Content>
              <div className='GuideText'>
                Choose which step-by-step guide you want to see
              </div>
              <div className='GuideButtonsContainer'>
                <Button basic className='GuideButtons' onClick={() => this.setGuideContent('one')} content='What is the adChain Registry?' />
              </div>
              <div className='GuideButtonsContainer'>
                <Button basic className='GuideButtons' onClick={() => this.setGuideContent('two')} content='How do I apply a domain into the adChain Registry?' />
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
                Can’t find what you’re looking for? Click <a href='https://adchain.zendesk.com/hc/en-us' target='_blank' rel='noopener noreferrer'>here</a> to visit the help center.
              </div>
            </Modal.Content>
          </div>
          : one ? <RegistryGuideModalAdchainRegistry returnToMenu={this.returnToMenu} close={this.close} section={'one'} />
            : two ? <RegistryGuideModalApplyDomain returnToMenu={this.returnToMenu} section={'two'} close={this.close} startJoyride={this.props.startJoyride} />
              : three ? <RegistryGuideModalChallengeDomain returnToMenu={this.returnToMenu} section={'three'} close={this.close} startJoyride={this.props.startJoyride} />
                : four ? <RegistryGuideModalCommitVote returnToMenu={this.returnToMenu} section={'four'} close={this.close} startJoyride={this.props.startJoyride} />
                  : five ? <RegistryGuideModalRevealVote returnToMenu={this.returnToMenu} section={'five'} close={this.close} startJoyride={this.props.startJoyride} />
                    : six ? <RegistryGuideModalDomainJourney returnToMenu={this.returnToMenu} startJoyride={this.props.startJoyride} resumeJoyride={this.props.resumeJoyride} domainJourney={this.props.domainJourney} toggleOverlay={this.props.toggleOverlay} />
                      : seven ? <RegistryGuideModalGovernance returnToMenu={this.returnToMenu} section={'seven'} close={this.close} startJoyride={this.props.startJoyride} />
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
      await this.updateRoute('/governance')
    }
    this.setState(guideToDisplay)
  }

  async returnToMenu (section = null) {
    const { lastOpened } = this.state
    let guideToDisplay = {}
    guideToDisplay[section] = !(section)
    guideToDisplay[lastOpened] = false
    guideToDisplay['menu'] = true
    guideToDisplay['open'] = true
    await this.updateRoute('/domains')
    this.setState(guideToDisplay)
  }

  close () {
    const { lastOpened } = this.state
    let guideToDisplay = {}
    guideToDisplay[lastOpened] = false
    guideToDisplay['menu'] = true
    guideToDisplay['open'] = false
    this.setState(guideToDisplay)
  }

  show () {
    this.setState({ open: true })
  }
}

export default withRouter(RegistryGuideModal)
