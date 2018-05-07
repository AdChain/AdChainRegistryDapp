import React, { Component } from 'react'
import { Modal } from 'semantic-ui-react'
import './RegistryGuideModalDomainJourney.css'
import RegistryGuideStaticDomainJourney from './RegistryGuideStaticDomainJourney'

class RegistryGuideModalDomainJourney extends Component {
  render () {
    return (
      <div className='RegistryGuideModalDomainJourney'>
        <Modal.Header className='RegistryGuideModalHeader'><span className='RegistryGuideModalHeaderText'>What is a Domain's Journey in the adChain Registry?</span></Modal.Header>
        <Modal.Content>
          <RegistryGuideStaticDomainJourney />
        </Modal.Content>
      </div>
    )
  }
}

export default RegistryGuideModalDomainJourney
