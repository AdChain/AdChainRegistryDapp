import React, { Component } from 'react'
import { Modal, Button } from 'semantic-ui-react'
import './RegistryGuideModalChallengeDomain.css'

class RegistryGuideModalChallengeDomain extends Component {
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
        <Modal.Header className='RegistryGuideModalHeader'><span className='RegistryGuideModalHeaderText'>How Do I Challenge a Domain?</span></Modal.Header>
        <Modal.Content>
          <div className='GuideText'>
        Challenging a domain is the universal right of every adToken holder. Challenges may be issued at any point during a domain’s lifecycle, that is to say, a challenge may be issued when a domain is In-Application or In-Registry.
            <br />
        Challenges help maintain quality in the adChain Registry.
            <br />
        For a step-by-step guide on how to challenge your domain, please click on the “CONTINUE” button below:
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

export default RegistryGuideModalChallengeDomain
