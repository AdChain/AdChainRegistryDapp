import React, { Component } from 'react'
import { Modal, Button } from 'semantic-ui-react'
import './RegistryGuideModalRevealVote.css'
import { RevealSteps } from './WalkthroughSteps'
import PubSub from 'pubsub-js'

class RegistryGuideModalRevealVote extends Component {
  constructor (props) {
    super(props)
    this.state = {
      section: props.section
    }
  }

  render () {
    const { section } = this.state

    return (
      <div>
        <Modal.Header className='RegistryGuideModalHeader'><span className='RegistryGuideModalHeaderText'>How Do I Reveal a Vote?</span></Modal.Header>
        <Modal.Content>
          <div className='GuideDesc'>
            <div>
            Once the Voting Commit stage ends, the Voting Reveal stage begins. The Voting Reveal stage is when you will reveal your vote to the public. Only previously committed votes can be revealed.
            </div>
            <br />
            <div>
            Votes revealed during this stage will be tallied up and counted to determine whether the domain Applicant or Challenger has won the vote, and therefore whether or not the domain is admitted to the adChain Registry.
            </div>
            <br />
            <div>
            For a step-by-step guide on how to reveal a vote, please click on the “CONTINUE” button below:
            </div>
          </div>
          <div className='GuideButtonsContainer'>
            <Button basic className='ReturnButton' onClick={() => this.props.returnToMenu(section)} content='Return to Guide' />
            <Button basic className='ContinueButton' content='Continue' onClick={() => PubSub.publish('RegistryGuideModal.startRegistryWalkthrough', RevealSteps)} />
          </div>
          <div className='GuideText'>
          Can’t find what you’re looking for? Click <a href='https://metax.zendesk.com/hc/en-us' target='_blank' rel='noopener noreferrer'>here</a> to visit the help center.
          </div>
        </Modal.Content>
      </div>
    )
  }
}

export default RegistryGuideModalRevealVote
