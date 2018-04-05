import React, { Component } from 'react'
import PropTypes from 'prop-types'
import toastr from 'toastr'
import { Popup } from 'semantic-ui-react'

import DomainClaimRewardInProgressContainer from './DomainClaimRewardInProgressContainer'
import registry from '../services/registry'
import './ClaimRewardContainer.css'

class ClaimRewardContainer extends Component {
  constructor (props) {
    super()

    this.state = {
      domain: props.domain,
      account: registry.getAccount(),
      claimChallengeId: null,
      claimSalt: null,
      didClaim: false,
      inProgress: false
    }

    this.onFileInput = this.onFileInput.bind(this)
    this.onFormSubmit = this.onFormSubmit.bind(this)

    this.getClaims()
  }

  componentDidMount () {
    this._isMounted = true
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  render () {
    const {
      inProgress,
      claimSalt,
      claimChallengeId
    } = this.state

    return (
      <div>
        <form
          onSubmit={this.onFormSubmit}
          className='ui form'>
          <div className='ui field'>
            <div className='ui large header center aligned'>
              Claim Reward
              <Popup
                trigger={<i className='icon info circle' />}
                content='Voters in the winning party can claim their token rewards by proving the challenge ID (poll ID) and secret phase (salt).'
              />
            </div>
          </div>
          <div className='ui field'>
            <label>Upload Commit File</label>
            <input
              type='file'
              name='file'
              onChange={this.onFileInput}
              className='ui file' />
          </div>
          <div className='ui field'>
              or
          </div>
          <div className='ui field'>
            <label>Challenge ID</label>
            <div className='ui input small'>
              <input
                type='text'
                placeholder='challenge ID'
                id='ClaimRewardContainerChallengeIdInput'
                defaultValue={claimChallengeId}
                onKeyUp={event => this.setState({claimChallengeId: parseInt(event.target.value, 10)})}
              />
            </div>
          </div>
          <div className='ui field'>
            <label>Secret Phrase (salt)</label>
            <div className='ui input small'>
              <input
                type='text'
                placeholder='phrase'
                id='ClaimRewardContainerSaltInput'
                defaultValue={claimSalt}
                onKeyUp={event => this.setState({claimSalt: parseInt(event.target.value, 10)})}
              />
            </div>
          </div>
          <div className='ui field'>
            <button
              type='submit'
              className='ui button blue right labeled icon'>
              Claim Reward
              <i className='icon certificate' />
            </button>
          </div>
        </form>
        {inProgress ? <DomainClaimRewardInProgressContainer /> : null}
      </div>
    )
  }

  async getClaims () {
    const {domain, account} = this.state

    if (!account) {
      return false
    }

    try {
      const claimed = await registry.didClaim(domain)

      if (this._isMounted) {
        this.setState({
          didClaim: claimed
        })
      }
    } catch (error) {
      toastr.error('There was an error with your request')
    }
  }

  onFileInput (event) {
    event.preventDefault()
    const file = event.target.files[0]
    const fr = new window.FileReader()

    fr.onload = () => {
      const contents = fr.result

      try {
        const {
          salt,
          challengeId
        } = JSON.parse(contents)

        if (this._isMounted) {
          this.setState({
            claimSalt: salt,
            claimChallengeId: challengeId
          })
        }

        const saltInput = document.querySelector('#ClaimRewardContainerSaltInput')
        if (saltInput) {
          saltInput.value = salt
        }

        const challengeIdInput = document.querySelector('#ClaimRewardContainerChallengeIdInput')
        if (challengeIdInput) {
          challengeIdInput.value = challengeId
        }
      } catch (error) {
        toastr.error('Invalid Commit JSON file')
        return false
      }
    }

    fr.readAsText(file)
  }

  onFormSubmit (event) {
    event.preventDefault()

    this.claimReward()
  }

  async claimReward () {
    const {
      claimChallengeId,
      claimSalt
    } = this.state

    if (!claimChallengeId) {
      toastr.error('Challenge ID is required')
      return false
    }

    if (!claimSalt) {
      toastr.error('Salt is required')
      return false
    }

    const alreadyClaimed = await registry.didClaimForPoll(claimChallengeId)

    if (alreadyClaimed) {
      toastr.error('No reward to claim for challenge ID')
      return false
    }

    try {
      if (this._isMounted) {
        this.setState({
          inProgress: true
        })
      }

      await registry.claimReward(claimChallengeId, claimSalt)
      toastr.success('Transaction sent')

      setTimeout(() => {
        window.location.reload()
      }, 1e3)
    } catch (error) {
      toastr.error('There was an error with your request')
    }

    if (this._isMounted) {
      this.setState({
        inProgress: false
      })
    }
  }
}

ClaimRewardContainer.propTypes = {
  domain: PropTypes.string
}

export default ClaimRewardContainer
