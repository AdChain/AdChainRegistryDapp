import React, { Component } from 'react'
import axios from 'axios'
import Tooltip from '../Tooltip'
import { Button, Input } from 'semantic-ui-react'
import toastr from 'toastr'
import './DomainEmailNotifications.css'
import PubSub from 'pubsub-js'
import EmailConfirmationModal from '../EmailConfirmationModal'
import isValidEmail from 'is-valid-email'
import { websocketNetwork, organization, governxUrl } from '../../models/network'
import { NavLink as Link } from 'react-router-dom'

class DomainEmailNotifications extends Component {
  constructor (props) {
    super()

    this.state = {
      email: ''
      // subscribed: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.subscribeEmail = this.subscribeEmail.bind(this)
    this.notifyGovernX = this.notifyGovernX.bind(this)
  }

  componentDidMount () {
    this._isMounted = true
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  componentWillMount () {
    this.subscribeEvent = PubSub.subscribe('DomainEmailNotifications.subscribe', this.subscribeEmail)
  }

  render () {
    return (
      <div className='DomainEmailNotifications BoxFrame mobile-hide'>
        <div className='ui grid stackable'>
          <div className='DomainEmailNotificationsContainer column sixteen wide'>
            <span className='BoxFrameLabel ui grid'>ADCHAIN REGISTRY EMAIL NOTIFICATIONS <Tooltip class='InfoIconHigh' info={'Receive daily updates on new activity in the adChain Registry. Powered by GovernX'} /></span>
            <div>
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
          </div>
        </div>
        <div className='SubscribeButtonContainer'>
          <div className='Spacer'>Legal Notice</div>
          <Button basic onClick={() => { this.subscribeEmail() }}>Subscribe</Button>
          <Link to='https://governx.org/privacy.html' target='_blank' rel='noopener noreferrer' className='EmailLegalNotice'><u>Legal Notice</u></Link>
        </div>
        <EmailConfirmationModal email={this.state.email || this.props.email} kind={this.props.kind} history={this.props.history} />
      </div>
    )
  }

  handleChange ({target}) {
    if (this._isMounted) {
      this.setState({
        [target.name]: target.value
      })
      PubSub.publish('WelcomeModal.updateButtonText', target.value ? 'Subscribe' : 'Finish')
    }
  }

  async notifyGovernX () {
    const {email} = this.state
    try {
      let res = await axios.get('https://api.governx.org/notify', {
        params: {
          network: websocketNetwork,
          organization: organization,
          email: email,
          url: governxUrl
        }
      })
      if (res.data.success === true) {
        let data = {
          email: email,
          kind: 'confirmation',
          header: 'Please confirm your subscription'
        }
        PubSub.publish('EmailConfirmationModal.open', data)
        this.setState({
          email: ''
        })
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
