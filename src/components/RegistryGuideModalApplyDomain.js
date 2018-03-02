import React, { Component } from 'react'
import { Modal, Button } from 'semantic-ui-react'
import './RegistryGuideModalApplyDomain.css'

class RegistryGuideModalApplyDomain extends Component {
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
        <Modal.Header className='RegistryGuideModalHeader'><span className='RegistryGuideModalHeaderText'>How Do I Apply a Domain into the adChain Registry?</span></Modal.Header>
        <Modal.Content>
          <div className='GuideDesc'>
            <div>
            By applying your domain into the adChain Registry as a publisher, you will be able to access premium advertising campaign spend.
            </div>
            <br />
            <div>
            The adChain Registry is not structured as a pay-to-play (as most domain whitelists are), but instead allows the domain owners the ability to withdraw their listing once in the adChain Registry.
            </div>
            <br />
            <div>
            For a step-by-step guide on how to apply your domain, please click on the “CONTINUE” button below:
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

export default RegistryGuideModalApplyDomain
