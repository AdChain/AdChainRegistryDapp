import React, { Component } from 'react'
import { Modal, Button } from 'semantic-ui-react'
import './RegistryGuideModalCommitVote.css'

class RegistryGuideModalCommitVote extends Component {
  constructor (props) {
    super(props)
    this.state = {
      section: props.section
    }
    this.onContinue = this.onContinue.bind(this)
  }

  render () {
    const { section } = this.state

    // const walkthroughSteps = [
    //   {
    //     title: 'Vote - First Step',
    //     text: 'You can use the DOMAIN FILTERS box to filter the domains that are in the Voting Commit stage.',
    //     selector: '.DomainsFilterPanel',
    //     position: 'right',
    //     type: 'click',
    //     isFixed: true,
    //     name: 'vote-first-step',
    //     parent: 'DomainsContainer'
    //   },
    //   {
    //     title: 'Vote - Second Step',
    //     text: 'The filtered domains are all in the Voting Commit stage. Voters have until the Stage Ends period to commit votes.',
    //     selector: '.DomainsTable',
    //     position: 'left',
    //     type: 'click',
    //     isFixed: true,
    //     name: 'vote-second-step',
    //     parent: 'DomainsContainer'
    //   }
    // ]
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
            <Button basic className='ContinueButton' content='Continue' />
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
