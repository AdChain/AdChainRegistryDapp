import React, { Component } from 'react'
import PropTypes from 'prop-types'
import toastr from 'toastr'
import moment from 'moment'

import store from '../store'
import registry from '../services/registry'

import DomainNotInRegistryContainer from './DomainNotInRegistryContainer'
import DomainInRegistryContainer from './DomainInRegistryContainer'
import DomainChallengeContainer from './DomainChallengeContainer'
import DomainVoteCommitContainer from './DomainVoteCommitContainer'
import DomainVoteRevealContainer from './DomainVoteRevealContainer'
import DomainPendingContainer from './DomainPendingContainer'
import DomainRejectedContainer from './DomainRejectedContainer'

import './DomainProfileActionContainer.css'

class DomainProfileActionContainer extends Component {
  constructor (props) {
    super()

    const {
      domain,
      action
    } = props

    this.state = {
      domain,
      action
    }

    this.getData()
  }

  componentDidMount () {
    this._isMounted = true
    // TODO unsubscribe on dismount
    store.subscribe(x => {
      setTimeout(() => this.getData(), 1e3)
    })
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  render () {
    const {
      domain,
      action
    } = this.state

    let component = null

    if (action === 'challenge') {
      component = <DomainChallengeContainer domain={domain} />
    } else if (action === 'commit') {
      component = <DomainVoteCommitContainer domain={domain} />
    } else if (action === 'reveal') {
      component = <DomainVoteRevealContainer domain={domain} />
    } else if (action === 'in_registry') {
      component = <DomainInRegistryContainer domain={domain} />
    } else if (action === 'refresh') {
      component = <DomainPendingContainer domain={domain} />
    } else if (action === 'rejected') {
      component = <DomainRejectedContainer domain={domain} />
    } else {
      component = <DomainNotInRegistryContainer domain={domain} />
    }

    return (
      <div className='OuterDomainProfileActionContainer'>
        <div className='DomainProfileActionContainer BoxFrame'>
          {component}
        </div>
      </div>
    )
  }

  async getData () {
    try {
      const {domain} = this.state
      const listing = await registry.getListing(domain)

      const {
        applicationExpiry,
        isWhitelisted,
        challengeId
      } = listing

      const challengeOpen = (challengeId === 0 && !isWhitelisted && !!applicationExpiry)
      const revealPending = (challengeId !== 0 && !isWhitelisted && !!applicationExpiry)
      const commitOpen = await registry.commitStageActive(domain)
      const revealOpen = await registry.revealStageActive(domain)
      const isInRegistry = (isWhitelisted && !commitOpen && !revealOpen)
      const now = moment().unix()
      const applicationExpirySeconds = applicationExpiry ? applicationExpiry._i : 0
      const challengeTimeEnded = (now > applicationExpirySeconds)

      let action = null

      if (isInRegistry) {
        action = 'in_registry'
      } else if (challengeOpen) {
        if (challengeTimeEnded) {
          action = 'refresh'
        } else {
          action = 'challenge'
        }
      } else if (commitOpen) {
        action = 'commit'
      } else if (revealOpen) {
        action = 'reveal'
      } else if (revealPending) {
        action = 'refresh'
      } else if (!isInRegistry) {
        action = 'rejected'
      } else {
        action = 'apply'
      }

      if (this._isMounted) {
        this.setState({
          action
        })
      }
    } catch (error) {
      toastr.error('There was an error with your request')
    }
  }
}

DomainProfileActionContainer.propTypes = {
  domain: PropTypes.string,
  action: PropTypes.string
}

export default DomainProfileActionContainer
