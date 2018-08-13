import React, { Component } from 'react'
import { Modal, Button, TextArea, Loader } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import PubSub from 'pubsub-js'
import { ipfsAddObject } from '../../services/ipfs'
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
      error: false,
      ipfsData: null,
      ipfsLoading: false
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
    const { open, size, domain, stake, action, error, ipfsLoading } = this.state

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
            <div className='LoadingIconContainer'>
              {ipfsLoading ? <Loader indeterminate active inline='centered' /> : null}
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
      error: false,
      ipfsLoading: false
    })
  }

  async show (topic, data) {
    this.setState({
      open: true,
      domain: data.domain,
      stake: data.stake,
      action: data.action,
      reason: '',
      error: false,
      ipfsLoading: false,
      listingHash: data.listingHash
    })

    if (data.action === 'apply') {
      this.setIPFS(data.domain)
    }
  }

  async setIPFS (domain) {
    // Remove spaces
    domain = domain.trim()
    // Add to IPFS
    const ipfsData = await ipfsAddObject({ id: domain })

    this.setState({
      ipfsData
    })
  }

  async submit () {
    const { domain, listingHash, reason, stake, action, ipfsData } = this.state

    if (reason.length < 15) {
      this.setState({
        error: true
      })
      return
    } else {
      this.setState({
        error: false
      })
    }

    try {
      if (action === 'apply') {

        // will display processing message until IPFS returns with hash
        if (!ipfsData) {
          this.setState({
            ipfsLoading: true
          })
          setTimeout(this.submit, 500)
          return
        } else {
          await registry.apply(domain, stake, ipfsData)
          await createPostApplication(domain, reason)
        }
      } else {
        let data = ''
        await registry.challenge(listingHash, data)
        let redditChallenge = await createPostChallenge(domain, reason)
        if (redditChallenge.data.status === 200) {
          PubSub.publish('DomainProfile.fetchSiteData')
        }
        PubSub.publish('DomainRedditBox.fetchRedditData')
      }
    } catch (error) {
      console.error(error)
      this.close()
      // toastr.error('There was an error with your request')
    }
  }
}

export default withRouter(RedditConfirmationModal)
