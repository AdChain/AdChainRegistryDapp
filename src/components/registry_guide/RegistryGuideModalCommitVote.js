import React, { Component } from 'react'
import { Modal, Button } from 'semantic-ui-react'
import { CommitSteps } from './WalkthroughSteps'
import PubSub from 'pubsub-js'

class RegistryGuideModalCommitVote extends Component {
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
        <Modal.Header className='RegistryGuideModalHeader'><span className='RegistryGuideModalHeaderText'>How Do I Commit a Vote?</span></Modal.Header>
        <Modal.Content>
          <div className='GuideDesc'>
            <div>
            Once a domain in application has been challenged, it immediately goes into vote. The first step in the voting stage is Voting Commit, where ADT holders commit ADT as their votes.
            </div>
            <br />
            <div>
            In the Voting Commit stage, adToken holders can vote to either Support or Oppose the domain’s eligibility to be included in the adChain Registry.
            </div>
            <br />
            <div>
            For a step-by-step guide on how to commit a vote, please click on the “CONTINUE” button below:
            </div>
          </div>
          <div className='GuideButtonsContainer'>
            <Button basic className='ReturnButton' onClick={() => this.props.returnToMenu(section)} content='Return to Guide' />
            <Button basic className='ContinueButton' content='Continue' onClick={() => PubSub.publish('RegistryGuideModal.startRegistryWalkthrough', CommitSteps)} />
          </div>
          <div className='GuideText'>
          Can’t find what you’re looking for? Click <a href='https://metax.zendesk.com/hc/en-us' target='_blank' rel='noopener noreferrer'>here</a> to visit the help center.
          </div>
        </Modal.Content>
      </div>
    )
  }
}

export default RegistryGuideModalCommitVote
