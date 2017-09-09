import React, { Component } from 'react'
import PropTypes from 'prop-types'

import store from '../store'
import registry from '../services/registry'

import DomainNotInRegistryContainer from './DomainNotInRegistryContainer'
import DomainInRegistryContainer from './DomainInRegistryContainer'
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
    this.updateStatus = this.updateStatus.bind(this)
  }

  componentDidMount () {
    // TODO unsubscribe on dismount
    store.subscribe(x => {
      setTimeout(() => this.getData(), 1e3)
    })
  }

  render () {
    const {
      domain,
      action
    } = this.state

    // TODO make component for apply panel
    let component = null
    // let component = <a href={`/apply?domain=${domain}`} className='ui button blue'>Apply to registry</a>

    if (action === 'challenge') {
      component = <DomainChallengeContainer domain={domain} />
    } else if (action === 'commit') {
      component = <DomainVoteCommitContainer domain={domain} />
    } else if (action === 'reveal') {
      component = <DomainVoteRevealContainer domain={domain} />
    } else if (action === 'in_registry') {
      component = <DomainInRegistryContainer domain={domain} />
    } else {
      component = <DomainNotInRegistryContainer domain={domain} />
    }

    return (
      <div>
        <div className='DomainProfileActionContainer BoxFrame'>
          <div className='ui grid stackable'>
            <div className='column sixteen wid center aligned'>
              <a
                className='ui button mini blue icon labeled right'
                href='#!'
                title='Refresh status'
                onClick={this.updateStatus}>
                  <i className='icon refresh'></i>
                  Refresh status
              </a>
            </div>
          </div>
        </div>
        <div className='DomainProfileActionContainer BoxFrame'>
          {component}
        </div>
    </div>
    )
  }

  async updateStatus () {
    const {domain} = this.state

    try {
      await registry.updateStatus(domain)
    } catch (error) {

    }

    this.getData()
  }

  async getData () {
    const {domain} = this.state

    const listing = await registry.getListing(domain)

    const {
      applicationExpiry,
      isWhitelisted,
      challengeId
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

DomainProfileActionContainer.propTypes = {
  domain: PropTypes.string,
  action: PropTypes.string
}

export default DomainProfileActionContainer
