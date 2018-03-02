import React, { Component } from 'react'
import { Modal, Button } from 'semantic-ui-react'
import './RegistryGuideModalCommitVote.css'

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
          <div className='GuideText'>
          Once a domain in application has been challenged, it immediately goes into vote. The first step in the voting stage is Voting Commit, where ADT holders commit ADT as their votes.
            <br />
          In the Voting Commit stage, adToken holders can vote to either Support or Oppose the domain’s eligibility to be included in the adChain Registry.
            <br />
          For a step-by-step guide on how to commit a vote, please click on the “CONTINUE” button below:
          </div>
          <div className='GuideButtonsContainer'>
            <Button basic className='GuideButtons' onClick={() => this.props.returnToMenu(section)} content='Return to Guide' />
            <Button basic className='GuideButtons' content='Continue' />
          </div>
          <div className='GuideText'>
          Can’t find what you’re looking for? Click <a href='https://adchain.zendesk.com/hc/en-us' target='_blank' rel='noopener noreferrer'>here</a> to visit the help center.
          </div>
        </Modal.Content>
      </div>
    )
  }
}

export default RegistryGuideModalCommitVote
