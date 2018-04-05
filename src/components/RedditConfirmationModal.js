import React, { Component } from 'react'
import { Modal, Button, TextArea } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import './RedditConfirmationModal.css'
import { createPostApplication, createPostChallenge } from '../services/redditActions'
import registry from '../services/registry'
import PublisherApplicationFormInProgress from './PublisherApplicationFormInProgress'
import PubSub from 'pubsub-js'
import toastr from 'toastr'

class RedditConfirmationModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false,
      size: 'small',
      domain: '',
      stake: 0,
      reason: '',
      inProgress: false,
      action: ''
    }
    this.close = this.close.bind(this)
    this.show = this.show.bind(this)
    this.submit = this.submit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentWillMount () {
    this.subEvent = PubSub.subscribe('RedditConfirmationModal.show', this.show)
  }

  render () {
    const { open, size, domain, stake, inProgress, action } = this.state

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
            </div>
            <div className='ButtonsContainer'>
              <Button basic className='CancelButton' onClick={this.close}>Cancel</Button>
              <Button basic className={action === 'apply' ? 'ApplyButton' : 'ChallengeButton'} onClick={this.submit}>{action}</Button>
            </div>
            {inProgress ? <PublisherApplicationFormInProgress /> : null}
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
      action: ''
    })
  }

  async show (topic, data) {
    this.setState({
      open: true,
      domain: data.domain,
      stake: data.stake,
      action: data.action
    })
  }

  async submit () {
    const { domain, reason, stake, action } = this.state
    this.setState({
      inProgress: true
    })
    try {
      if (action === 'apply') {
        await registry.apply(domain, stake)
        await createPostApplication(domain, reason)
        toastr.success('Successfully applied domain')
      } else {
        let data = ''
        await registry.challenge(domain, data)
        await createPostChallenge(domain, reason)
        toastr.success('Successfully challenged domain')
      }
      this.setState({
        inProgress: false
      })
      setTimeout(() => {
        window.location.reload()
      }, 2e3)
      this.close()
    } catch (error) {
      console.error(error)
      this.setState({
        inProgress: false
      })
      this.close()
      toastr.error('There was an error with your request')
    }
  }
}

export default withRouter(RedditConfirmationModal)
