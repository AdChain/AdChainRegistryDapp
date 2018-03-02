import React, { Component } from 'react'
import { Modal } from 'semantic-ui-react'
import './RegistryGuideModalDomainJourney.css'

class RegistryGuideModalDomainJourney extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  render () {
    return (
      <div>
        <Modal.Header className='RegistryGuideModalHeader'><span className='RegistryGuideModalHeaderText'>What is a Domain's Journey in the adChain Registry?</span></Modal.Header>
        <Modal.Content>
          <div className='GuideText' />
        </Modal.Content>
      </div>
    )
  }
}

export default RegistryGuideModalDomainJourney
