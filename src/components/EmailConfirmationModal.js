import React, { Component } from 'react'
import { Modal, Button } from 'semantic-ui-react'
import './EmailConfirmationModal.css'
import PubSub from 'pubsub-js'
import GovernXLogo from './assets/governx_logo.svg'

class EmailConfirmationModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false,
      size: 'small',
      email: ''
    }

    this.open = this.open.bind(this)
  }

  close () {
    if (this._isMounted) {
      this.setState({ open: false })
    }
  }

  open (topic, email) {
    if (this._isMounted) {
      this.setState({
        open: true,
        email: email
      })
    }
  }

  componentDidMount () {
    this._isMounted = true
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  componentWillMount () {
    this.subEvent = PubSub.subscribe('EmailConfirmationModal.open', this.open)
  }

  render () {
    const { open, size, email } = this.state
    return (
      <Modal size={size} open={open} onClose={() => this.close()} closeIcon className='EmailConfirmationContainer'>
        <Modal.Header className='WelcomeHeader'><span className='WelcomeHeaderUnderline'>PLEASE CONFIRM YOUR SUBSCRIPTION</span></Modal.Header>
        <Modal.Content>
          <div>
              A confirmation email was sent to <b>{email}</b>. Please confirm the email to sign-up for the adChain Registry Daily Digest email notifications, powered by <b>GovernX</b>. Don't forget to check your spam!
          </div>
          <div className='ButtonContainer'>
            <Button basic onClick={() => { this.close() }}>Return to Dapp</Button>
          </div>
          <img src={GovernXLogo} alt='GovernX' className='GovernXLogo' />
        </Modal.Content>
      </Modal>
    )
  }
}

export default EmailConfirmationModal
