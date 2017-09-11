import React, { Component } from 'react'
import PropTypes from 'prop-types'
import toastr from 'toastr'
import { Popup } from 'semantic-ui-react'
import commafy from 'commafy'

import registry from '../services/registry'
import './DomainInRegistryContainer.css'
import DomainClaimRewardInProgressContainer from './DomainClaimRewardInProgressContainer'
import DomainVoteTokenDistribution from './DomainVoteTokenDistribution'
import DomainChallengeInProgressContainer from './DomainChallengeInProgressContainer'

class DomainInRegistryContainer extends Component {
  constructor (props) {
    super()

    this.state = {
      domain: props.domain,
      didReveal: false,
      didClaim: false,
      claimChallengeId: null,
      claimSalt: null,
      inProgress: false,
      inChallengeProgress: false,
      minDeposit: null
    }

    this.onFileInput = this.onFileInput.bind(this)
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onChallenge = this.onChallenge.bind(this)

    this.getPoll()
    this.getReveal()
    this.getClaims()
    this.getMinDeposit()
  }

  render () {
    const {
      domain,
      didReveal,
      didClaim,
      inProgress,
      inChallengeProgress,
      votesFor,
      votesAgainst,
      minDeposit
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
          <div className='column sixteen wide center aligned'>
            <p>{domain} is in adChain Registry.</p>
          </div>
          {didReveal ? <div className='column sixteen wide center aligned'>
            <div className='ui message warning'>
              You've <strong>revealed</strong> for this domain.
            </div>
          </div>
          : null}
          {didClaim ? <div className='column sixteen wide center aligned'>
            <div className='ui message warning'>
              You've <strong>claimed reward</strong> for this domain.
            </div>
          </div>
          : null}
          {canClaim ? [
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
                  <button
                    type='submit'
                    className='ui button blue right labeled icon'>
                    Claim Reward
                    <i className='icon certificate' />
                  </button>
                </div>
              </form>
            </div>
          ] : null}
          <div className='ui divider' />,
          <div className='column sixteen wide center aligned DomainChallengeFormContainer'>
            <form className='ui form'>
              <div className='ui field'>
                <label>Challenge {domain}</label>
              </div>
              <div className='ui field'>
                <div className='ui message default'>
                  <p>Minimum deposit required</p>
                  <p><strong>{minDeposit ? commafy(minDeposit) : '-'} ADT</strong></p>
                </div>
              </div>
              <div className='ui field'>
                <button
                  onClick={this.onChallenge}
                  className='ui button purple right labeled icon'>
                  CHALLENGE
                  <i className='icon thumbs down'></i>
                </button>
              </div>
            </form>
          </div>
        </div>
        {inProgress ? <DomainClaimRewardInProgressContainer /> : null}
        {inChallengeProgress ? <DomainChallengeInProgressContainer /> : null}
      </div>
    )
  }

  async getMinDeposit () {
    this.setState({
      minDeposit: await registry.getMinDeposit()
    })
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
      toastr.success('Reward claimed')

      setTimeout(() => {
        window.location.reload()
      }, 1e3)
    } catch (error) {
      toastr.error(error.message)
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

  onChallenge (event) {
    event.preventDefault()

    this.challenge()
  }

  async challenge () {
    const {domain} = this.state

    let inApplication = null

    try {
      inApplication = await registry.applicationExists(domain)
    } catch (error) {
      toastr.error(error)
    }

    if (inApplication) {
      this.setState({
        inChallengeProgress: true
      })

      try {
        await registry.challenge(domain)

        toastr.success('Successfully challenged domain')

        this.setState({
          inChallengeProgress: false
        })

        // TODO: better way of resetting state
        setTimeout(() => {
          window.location.reload()
        }, 2e3)
      } catch (error) {
        toastr.error(error.message)
        this.setState({
          inChallengeProgress: false
        })
      }
    } else {
      toastr.error('Domain not in application')
    }
  }
}

DomainInRegistryContainer.propTypes = {
  domain: PropTypes.string
}

export default DomainInRegistryContainer
