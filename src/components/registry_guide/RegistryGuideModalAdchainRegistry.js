import React, { Component } from 'react'
import { Modal, Button } from 'semantic-ui-react'
import './RegistryGuideModalAdchainRegistry.css'

class RegistryGuideModalAdchainRegistry extends Component {
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
        <Modal.Header className='RegistryGuideModalHeader'><span className='RegistryGuideModalHeaderText'>What is the adChain Registry?</span></Modal.Header>
        <Modal.Content>
          <div className='GuideDesc'>
            <div>
              The adChain Registry is a community-curated registry of ad-supported websites. Curation is executed via a network specific cryptocurrency called adToken (ADT). Community members are rationally incentivized to include or reject websites from the registry based on the merits of ad performance and inventory quality.
            </div>
            <br />
            <div>
              To learn more, please visit the <a href='https://medium.com/@AdChain/the-adchain-registry-eli5-b7f0a19a532d' target='_blank' rel='noopener noreferrer'>adChain Registry ELI5 post</a>.
            </div>
          </div>
          <div className='GuideButtonsContainer'>
            <Button basic className='ReturnButton' onClick={() => this.props.returnToMenu(section)} content='Return to Guide' />
            <Button basic className='ExitButton' onClick={() => this.props.close()} content='Exit to Dapp' />
          </div>
          <div className='GuideText'>
          Can’t find what you’re looking for? Click <a href='https://metax.zendesk.com/hc/en-us' target='_blank' rel='noopener noreferrer'>here</a> to visit the help center.
          </div>
        </Modal.Content>
      </div>
    )
  }
}

export default RegistryGuideModalAdchainRegistry
