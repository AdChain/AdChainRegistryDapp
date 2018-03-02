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
              The adChain Registry utilizes a non-native protocol token called <u>adToken</u> to curate a premium list of domain names and serves as the world's first decentralized whitelist for digital advertising. It will also provide a foundational layer for a wealth of other DApps.
            </div>
            <br />
            <div>
              The goal of adChain is to be inclusive and to onboard the entire digital advertising ecosystem. At first, we see three types of adChain Registry Participants:
            </div>
            <br />
            <div className='GuideDescList'>
            1. Applicants: Domain Owners
              <br />
            2. Challengers: Safety Vendors
              <br />
            3. Voters: The General adToken Community
            </div>
            <br />
            <div>
              Our target users, once on the Ethereum Mainnet, will be premium publishers who wish to join the adChain Registry and advertisers who wish to work with them. As adChain grows, it will expand to include the industry's technology providers, safety vendors, exchanges, and service providers.
            </div>
          </div>
          <div className='GuideButtonsContainer'>
            <Button basic className='ReturnButton' onClick={() => this.props.returnToMenu(section)} content='Return to Guide' />
            <Button basic className='ExitButton' onClick={() => this.props.close()} content='Exit to Dapp' />
          </div>
          <div className='GuideText'>
          Can’t find what you’re looking for? Click <a href='https://adchain.zendesk.com/hc/en-us' target='_blank' rel='noopener noreferrer'>here</a> to visit the help center.
          </div>
        </Modal.Content>
      </div>
    )
  }
}

export default RegistryGuideModalAdchainRegistry
