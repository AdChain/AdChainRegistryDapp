import React, { Component } from 'react'
import PropTypes from 'prop-types'
import toastr from 'toastr'
import { Popup } from 'semantic-ui-react'
import commafy from 'commafy'

import registry from '../services/registry'
import './DomainInRegistryContainer.css'
import DomainVoteTokenDistribution from './DomainVoteTokenDistribution'
import DomainChallengeInProgressContainer from './DomainChallengeInProgressContainer'
import ClaimRewardContainer from './ClaimRewardContainer'

class DomainInRegistryContainer extends Component {
  constructor (props) {
    super()

    this.state = {
      domain: props.domain,
      didReveal: false,
      didClaim: false,
      inChallengeProgress: false,
      minDeposit: null
    }

    this.onChallenge = this.onChallenge.bind(this)

    this.getPoll()
    this.getReveal()
    this.getClaims()
    this.getMinDeposit()
  }

  componentDidMount () {
    this._isMounted = true
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  render () {
    const {
      domain,
      didReveal,
      didClaim,
      inChallengeProgress,
      votesFor,
      votesAgainst,
      minDeposit
    } = this.state

    const hasVotes = (votesFor || votesAgainst)

    return (
      <div className='DomainInRegistryContainer'>
        <div className='ui grid stackable'>
          <div className='column sixteen wide'>
            <div className='ui large header center aligned'>
              In Registry
              <Popup
                trigger={<i className='icon info circle' />}
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
          {hasVotes ? [
            <div className='ui divider' key={Math.random()} />,
            <DomainVoteTokenDistribution domain={domain} key={Math.random()} />,
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
          <div className='ui divider' />,
          <div className='column sixteen wide center aligned'>
            <ClaimRewardContainer domain={domain} />
          </div>
        </div>
        {inChallengeProgress ? <DomainChallengeInProgressContainer /> : null}
      </div>
    )
  }

  async getMinDeposit () {
    if (this._isMounted) {
      this.setState({
        minDeposit: await registry.getMinDeposit()
      })
    }
  }

  async getReveal () {
    const {domain} = this.state

    try {
      const didReveal = await registry.didReveal(domain)

      if (this._isMounted) {
        this.setState({
          didReveal: didReveal
        })
      }
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

      if (this._isMounted) {
        this.setState({
          votesFor,
          votesAgainst
        })
      }
    } catch (error) {

    }
  }

  async getClaims () {
    const {domain} = this.state

    try {
      const claimed = await registry.didClaim(domain)

      if (this._isMounted) {
        this.setState({
          didClaim: claimed
        })
      }
    } catch (error) {
      toastr.error(error)
    }
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
      if (this._isMounted) {
        this.setState({
          inChallengeProgress: true
        })
      }

      try {
        await registry.challenge(domain)

        toastr.success('Successfully challenged domain')

        if (this._isMounted) {
          this.setState({
            inChallengeProgress: false
          })
        }

        // TODO: better way of resetting state
        setTimeout(() => {
          window.location.reload()
        }, 2e3)
      } catch (error) {
        toastr.error(error.message)
        if (this._isMounted) {
          this.setState({
            inChallengeProgress: false
          })
        }
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
