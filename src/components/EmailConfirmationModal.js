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
      email: '',
      kind: null,
      header: 'Please confirm your subscription'
    }
    this.history = props.history
    this.open = this.open.bind(this)
  }

  close () {
    if (this._isMounted) {
      this.setState({ open: false })
      this.history.push('/domains')
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

  componentWillReceiveProps (nextProps, prevState) {
    if (nextProps.kind === prevState.kind) {
      return null
    }
    let header
    switch (nextProps.kind) {
      case '_SubscriptionSuccess':
        header = 'Subscription Confirmed!'
        break
      case '_UnsubscribeSuccess':
        header = 'Unsubscription Confirmed!'
        break
      default:
        header = 'Please confirm your subscription'
        break
    }
    if (nextProps.kind) {
      this.setState({
        kind: nextProps.kind,
        email: nextProps.email,
        header: header,
        open: true
      })
    }
  }

  render () {
    const { open, size, email, header, kind } = this.state
    return (
      <Modal size={size} open={open} onClose={() => this.close()} closeIcon className='EmailConfirmationContainer'>
        <Modal.Header className='WelcomeHeader'>
          <span className='WelcomeHeaderUnderline'>{header}</span>
        </Modal.Header>
        <Modal.Content>
          {
            kind === '_SubscriptionSuccess'
              ? <div>The email <b>{email}</b> is confirmed to receive the adChain Registry Daily Digest.</div>
              : kind === '_UnsubscribeSuccess'
                ? <div>The email <b>{email}</b> is unsubscribed from receiving the adChain Registry Daily Digest. Although we're sad to see you leave, we wish you luck in staying up to date with everything that happens in the adChain Registry.</div>
                : <div>A confirmation email was sent to <b>{email}</b>. Please confirm the email to sign-up for the adChain Registry Daily Digest email notifications, powered by <b>GovernX</b>. Don't forget to check your spam!</div>
          }
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
