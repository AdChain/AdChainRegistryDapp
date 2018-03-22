import React, { Component } from 'react'
import Tooltip from './Tooltip'
import { Button, Input } from 'semantic-ui-react'
import './DomainEmailNotifications.css'

class DomainEmailNotifications extends Component {
  constructor (props) {
    super()

    this.state = {
    }
  }

  // No functionality yet

  render () {
    return (
      <div className='DomainEmailNotifications BoxFrame'>
        <div className='ui grid stackable'>
          <div className='DomainEmailNotificationsContainer column sixteen wide'>
            <span className='BoxFrameLabel ui grid'>ADCHAIN REGISTRY EMAIL NOTIFICATIONS <Tooltip info={'The fields in this box filter the user view in the DOMAINS table.'} /></span>
            <label className='f-os'>Email</label>
            <div className='EmailInputContainer'>
              <Input
                name='emailInput'
                id='EmailNotificationsInput'
                type='text'
                placeholder='hello@metax.io' />
            </div>
          </div>
        </div>
        <div className='SubscribeButtonContainer'>
          <Button basic>Subscribe</Button>
        </div>
      </div>
    )
  }
}

export default DomainEmailNotifications
