import React, { Component } from 'react'
import moment from 'moment'

import store from '../store'
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

  componentDidMount () {
    store.subscribe(x => {
      this.getData()
    })
  }

  render () {
    const {
      domain,
      action
    } = this.state

    // TODO make component for apply panel
    let component = <a href={`/apply?domain=${domain}`} className='ui button blue'>Apply to registry</a>

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

    const challengeOpen = (challengeId === 0 && !isWhitelisted && applicationExpiry)
    const commitOpen = await registry.commitPeriodActive(domain)
    const revealOpen = await registry.revealPeriodActive(domain)

    let action = null

    if (isWhitelisted) {
      action = 'in_registry'
    } else if (challengeOpen) {
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
