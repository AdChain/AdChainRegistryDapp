import React, { Component } from 'react'
import axios from 'axios'
import Tooltip from '../Tooltip'
import { Button, Input } from 'semantic-ui-react'
import toastr from 'toastr'
import './DomainEmailNotifications.css'

class DomainEmailNotifications extends Component {
  constructor (props) {
    super()

    this.state = {
      email: '',
      subscribed: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.subscribeEmail = this.subscribeEmail.bind(this)
  }

  // No functionality yet

  render () {
    return (
      <div className='DomainEmailNotifications BoxFrame'>
        <div className='ui grid stackable'>
          <div className='DomainEmailNotificationsContainer column sixteen wide'>
            <span className='BoxFrameLabel ui grid'>ADCHAIN REGISTRY EMAIL NOTIFICATIONS <Tooltip info={'The fields in this box filter the user view in the DOMAINS table.'} /></span>
            <div className={this.state.subscribed ? 'hide' : 'show'}>
              <label className='f-os'>Email</label>
              <div className='EmailInputContainer'>
                <Input
                  name='email'
                  id='EmailNotificationsInput'
                  type='text'
                  placeholder='hello@metax.io'
                  value={this.state.email}
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className={this.state.subscribed ? 'show f-os pd-10 t-center' : 'hide'}>
              A confirmation email was sent to the email registered. Please check your inbox and spam folders for the confirmation email.
            </div>
          </div>
        </div>
        <div className={this.state.subscribed ? 'hide' : 'show SubscribeButtonContainer'}>
          <Button basic onClick={this.subscribeEmail}>Subscribe</Button>
        </div>
      </div>
    )
  }

  handleChange ({target}) {
    this.setState({
      [target.name]: target.value
    })
  }

  async subscribeEmail () {
    if (!this.state.email) {
      toastr.error('The field you wish to interact with is empty')
      return false
    }
    try {
      let res = await axios.get('https://api.governx.org/notify', { params: {
        network: 'rinkeby',
        organization: '0xb3844afab28f2e65a13e570c12ed4dc244cb7d4b',
        email: this.state.email,
        url: 'https://metax.io'
      }})
      if (res.data.success === true) {
        this.setState({
          subscribed: true
        })
      }
    } catch (error) {
      toastr.error('There was an error subscribing to email notifications')
      console.log(error)
    }
  }
}

export default DomainEmailNotifications
