import React, { Component } from 'react'
import { Modal, Button, TextArea } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import PubSub from 'pubsub-js'
// import toastr from 'toastr'

import { createPostApplication, createPostChallenge } from '../../services/redditActions'
import registry from '../../services/registry'

import './RedditConfirmationModal.css'

class RedditConfirmationModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false,
      size: 'small',
      domain: '',
      stake: 0,
      reason: '',
      action: '',
      error: false
    }
    this.close = this.close.bind(this)
    this.show = this.show.bind(this)
    this.submit = this.submit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentWillMount () {
    this.openEvent = PubSub.subscribe('RedditConfirmationModal.show', this.show)
    this.closeEvent = PubSub.subscribe('RedditConfirmationModal.close', this.close)
  }

  render () {
    const { open, size, domain, stake, action, error } = this.state

    return (
      <Modal size={size} open={open} closeIcon className='RedditConfirmationModal' onClose={this.close}>
        <div>
          <Modal.Content>
            <div className='DomainInput'>
              <span>You are about to <span className={action === 'apply' ? 'ApplyLabel' : 'ChallengeLabel'}>{action}</span>:</span>
              <span className='PopulatedSpan'>{domain}</span>
            </div>
            <div className='ADTInput'>
              <span>and stake a total amount of:</span>
              <span className='PopulatedSpan'>{stake} ADT</span>
            </div>
            <div className='ReasonInput'>
              <div className='ReasonInputLabel'>Please provide your reasoning below</div>
              <TextArea
                placeholder='(15 character minimum)'
                className='ReasonInputTextArea'
                value={this.state.reason}
                onChange={this.handleChange}
              />
              {error ? <div className='ErrorMessage'>Please enter a reason with a minimum of 15 characters.</div> : null}
            </div>
            <div className='ButtonsContainer'>
              <Button basic className='CancelButton' onClick={this.close}>Cancel</Button>
              <Button basic className={action === 'apply' ? 'ApplyButton' : 'ChallengeButton'} onClick={this.submit}>{action}</Button>
            </div>
          </Modal.Content>
        </div>
      </Modal>
    )
  }

  handleChange (event) {
    this.setState({
      reason: event.target.value
    })
  }

  close () {
    this.setState({
      open: false,
      domain: '',
      stake: '',
      action: '',
      reason: '',
      error: false
    })
  }

  async show (topic, data) {
    this.setState({
      open: true,
      domain: data.domain,
      stake: data.stake,
      action: data.action,
      reason: '',
      error: false
    })
  }

  async submit () {
    const { domain, reason, stake, action } = this.state

    if (reason.length < 15) {
      this.setState({
        error: true
      })
      return
    }
    try {
      if (action === 'apply') {
        await registry.apply(domain, stake)
        await createPostApplication(domain, reason)
      } else {
        let data = ''
        await registry.challenge(domain, data)
        await createPostChallenge(domain, reason)
      }
      // setTimeout(() => {
      //   window.location.reload()
      // }, 2e3)
    } catch (error) {
      console.error(error)
      this.close()
      // toastr.error('There was an error with your request')
    }
  }
}

export default withRouter(RedditConfirmationModal)
