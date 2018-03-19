import React, { Component } from 'react'
import { Modal, Button } from 'semantic-ui-react'
import './RegistryGuideModalChallengeDomain.css'
import { ChallengeSteps } from './WalkthroughSteps'

class RegistryGuideModalChallengeDomain extends Component {
  constructor (props) {
    super(props)
    this.state = {
      section: props.section
    }
    this.onContinue = this.onContinue.bind(this)
  }

  render () {
    const { section } = this.state

    return (
      <div>
        <Modal.Header className='RegistryGuideModalHeader'><span className='RegistryGuideModalHeaderText'>How Do I Challenge a Domain?</span></Modal.Header>
        <Modal.Content>
          <div className='GuideDesc'>
            <div>
            Challenging a domain is the universal right of every adToken holder. Challenges may be issued at any point during a domain’s lifecycle, that is to say, a challenge may be issued when a domain is In-Application or In-Registry.
            </div>
            <br />
            <div>
            Challenges help maintain quality in the adChain Registry.
            </div>
            <br />
            <div>
            For a step-by-step guide on how to challenge your domain, please click on the “CONTINUE” button below:
            </div>
          </div>
          <div className='GuideButtonsContainer'>
            <Button basic className='ReturnButton' onClick={() => this.props.returnToMenu(section)} content='Return to Guide' />
            <Button basic className='ContinueButton' content='Continue' onClick={() => this.onContinue(ChallengeSteps)} />
          </div>
          <div className='GuideText'>
          Can’t find what you’re looking for? Click <a href='https://adchain.zendesk.com/hc/en-us' target='_blank' rel='noopener noreferrer'>here</a> to visit the help center.
          </div>
        </Modal.Content>
      </div>
    )
  }
  onContinue (steps) {
    this.props.close()
    this.props.startJoyride(steps)
  }
}

export default RegistryGuideModalChallengeDomain
