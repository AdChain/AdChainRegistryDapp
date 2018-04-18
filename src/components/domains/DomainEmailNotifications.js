import React, { Component } from 'react'
import axios from 'axios'
import Tooltip from '../Tooltip'
import { Button, Input } from 'semantic-ui-react'
import toastr from 'toastr'
import './DomainEmailNotifications.css'
import PubSub from 'pubsub-js'
import EmailConfirmationModal from '../EmailConfirmationModal'
import isValidEmail from 'is-valid-email'

class DomainEmailNotifications extends Component {
  constructor (props) {
    super()

    this.state = {
      email: '',
      subscribed: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.subscribeEmail = this.subscribeEmail.bind(this)
    this.notifyGovernX = this.notifyGovernX.bind(this)
  }

  componentWillMount () {
    this.subscribeEvent = PubSub.subscribe('DomainEmailNotifications.subscribe', this.subscribeEmail)
  }

  // No functionality yet

  render () {
    return (
      <div className='DomainEmailNotifications BoxFrame'>
        <div className='ui grid stackable'>
          <div className='DomainEmailNotificationsContainer column sixteen wide'>
            <span className='BoxFrameLabel ui grid'>ADCHAIN REGISTRY EMAIL NOTIFICATIONS <Tooltip info={'Receive daily updates on new activity in the adChain Registry. Powered by GovernX'} /></span>
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
          <Button basic onClick={() => { this.subscribeEmail() }}>Subscribe</Button>
        </div>
        <EmailConfirmationModal email={this.state.email} />
      </div>
    )
  }

  handleChange ({target}) {
    this.setState({
      [target.name]: target.value
    })
    PubSub.publish('WelcomeModal.updateButtonText', target.value ? 'Subscribe' : 'Finish')
  }

  async notifyGovernX () {
    const {email} = this.state
    try {
      let res = await axios.get('https://api.governx.org/notify', {
        params: {
          network: 'rinkeby',
          organization: '0x5a7e9046edadc58bb94f8c18c68856ff83f7ec4d',
          email: email,
          url: 'https://metax.io'
        }
      })
      if (res.data.success === true) {
        this.setState({
          subscribed: true
        })
        PubSub.publish('EmailConfirmationModal.open', email)
      }
    } catch (error) {
      toastr.error('There was an error subscribing to email notifications')
      console.log(error)
    }
  }

  async subscribeEmail (topic) {
    const {email} = this.state

    // this code gets executed when run from welcome modal
    if (topic) {
      if (email) { // if there is an email input
        const validEmail = isValidEmail(email)
        if (validEmail) { // if it's a valid email
          PubSub.subscribe('WelcomeModal.close', this.close)
          await this.notifyGovernX()
        } else {
          toastr.error('You did not enter a valid email address')
        }
      }
    } else {
      // this is executed on the normal domains email notifications container
      if (!email) {
        toastr.error('The field you wish to interact with is empty')
        return false
      } else {
        const validEmail = isValidEmail(email)
        if (validEmail) {
          this.notifyGovernX()
        }
      }
    }
  }
}

export default DomainEmailNotifications
