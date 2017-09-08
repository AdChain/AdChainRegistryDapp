import React, { Component } from 'react'
import PropTypes from 'prop-types'
import toastr from 'toastr'
import { Popup } from 'semantic-ui-react'

import registry from '../services/registry'
import './DomainInRegistryContainer.css'
import DomainClaimRewardInProgressContainer from './DomainClaimRewardInProgressContainer'
import DomainVoteTokenDistribution from './DomainVoteTokenDistribution'

class DomainInRegistryContainer extends Component {
  constructor (props) {
    super()

    this.state = {
      domain: props.domain,
      didReveal: false,
      didClaim: false,
      claimChallengeId: null,
      claimSalt: null,
      inProgress: false
    }

    this.onFileInput = this.onFileInput.bind(this)
    this.onFormSubmit = this.onFormSubmit.bind(this)

    this.getPoll()
    this.getReveal()
    this.getClaims()
  }

  render () {
    const {
      domain,
      didReveal,
      didClaim,
      inProgress,
      votesFor,
      votesAgainst
    } = this.state

    const canClaim = (votesFor || votesAgainst)

    return (
      <div className='DomainInRegistryContainer'>
        <div className='ui grid stackable'>
          <div className='column sixteen wide'>
            <div className='ui large header center aligned'>
              In Registry
              <Popup
                trigger={<i className='icon info circle'></i>}
                content='Domain was unchallenged or voted into adChain Registry.'
              />
            </div>
          </div>
          {didReveal ? <div className='column sixteen wide center aligned'>
            <div className='ui message warning'>
              You've <strong>revealed</strong> for this domain.
            </div>
          </div>
          : null}
          {didClaim ? <div className='column sixteen wide center aligned'>
            <div className='ui message warning'>
              You've <strong>claimed</strong> ADT for this domain.
            </div>
          </div>
          : null}
          <div className='column sixteen wide center aligned'>
            <p>{domain} is in adChain Registry.</p>
          </div>
          {canClaim ?
          [
          <div className='ui divider' />,
          <DomainVoteTokenDistribution domain={domain} />,
          <div className='ui divider' />,
          <div className='column sixteen wide center aligned'>
            <form
              onSubmit={this.onFormSubmit}
              className='ui form'>
              <div className='ui field'>
                <div className='ui large header center aligned'>
                  Claim Reward
                  <Popup
                    trigger={<i className='icon info circle'></i>}
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
                <button
                  type='submit'
                  className='ui button blue right labeled icon'>
                  Claim Reward
                  <i className='icon certificate' />
                </button>
              </div>
            </form>
          </div>
          ]: null}
        </div>
        {inProgress ? <DomainClaimRewardInProgressContainer /> : null}
      </div>
    )
  }

  async getReveal () {
    const {domain} = this.state

    try {
      const didReveal = await registry.didReveal(domain)

      this.setState({
        didReveal: didReveal
      })
    } catch (error) {
      toastr.error(error)
    }
  }

  async getPoll () {
    const {domain} = this.state

    try {
      const {
        votesFor,
        votesAgainst
      } = await registry.getChallengePoll(domain)

      this.setState({
        votesFor,
        votesAgainst
      })
    } catch (error) {

    }
  }

  async getClaims () {
    const {domain} = this.state

    try {
      const claimed = await registry.didClaim(domain)

      this.setState({
        didClaim: claimed
      })
    } catch (error) {
      toastr.error(error)
    }
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
      toastr.error('Already claimed reward')
      return false
    }

    try {
      this.setState({
        inProgress: true
      })

      await registry.claimReward(claimChallengeId, claimSalt)
      toastr.success('Transaction mined')
    } catch (error) {
      toastr.error(error)
    }

    this.setState({
      inProgress: false
    })
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

        this.setState({
          claimSalt: salt,
          claimChallengeId: challengeId
        })

        const saltInput = document.querySelector('#DomainInRegistryContainerSaltInput')
        if (saltInput) {
          saltInput.value = salt
        }

        const challengeIdInput = document.querySelector('#DomainInRegistryContainerChallengeIdInput')
        if (challengeIdInput) {
          challengeIdInput.value = salt
        }
      } catch (error) {
        toastr.error('Invalid Commit JSON file')
        return false
      }
    }

    fr.readAsText(file)
  }
}

DomainInRegistryContainer.propTypes = {
  domain: PropTypes.string
}

export default DomainInRegistryContainer
