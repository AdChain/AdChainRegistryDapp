import React, { Component } from 'react'
import moment from 'moment'
import registry from '../services/registry'

import DomainNoActionContainer from './DomainNoActionContainer'
import DomainChallengeContainer from './DomainChallengeContainer'
import DomainVoteCommitContainer from './DomainVoteCommitContainer'
import DomainVoteRevealContainer from './DomainVoteRevealContainer'

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
      component = <DomainNoActionContainer domain={domain} />
    }

    return (
      <div className='DomainProfileActionContainer BoxFrame'>
        {component}
      </div>
    )
  }

  async getData() {
    const {domain} = this.state

    const applyStageBlocks = await registry.getParameter('applyStageLen')
    const currentTimestamp = moment().unix()

    const listing = await registry.getListing(domain)

    const {
      applicationExpiry,
      isWhitelisted,
      ownerAddress,
      currentDeposit,
      challengeId,
    } = listing

    const canChallenge = (challengeId === 0 && !isWhitelisted && applicationExpiry)
    const commitOpen = (challengeId !== 0 && !isWhitelisted)
    const revealOpen = false
    console.log('LISTING', listing)

    let action = null

    if (isWhitelisted) {
      action = 'in_registry'
    } else if (canChallenge) {
      action = 'challenge'
    } else if (commitOpen) {
      action = 'commit'
    } else if (revealOpen) {
      action = 'reveal'
    } else {
      action = 'apply'
    }

    this.setState({
      action
    })
  }
}

export default DomainProfileActionContainer
