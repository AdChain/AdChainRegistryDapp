import React, { Component } from 'react'
import PropTypes from 'prop-types'
import toastr from 'toastr'

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

  async updateStatus (event) {
    event.preventDefault()

    const {domain} = this.state

    try {
      await registry.updateStatus(domain)
    } catch (error) {
      toastr.error(error.message)
    }

    this.getData()
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

      const challengeOpen = (challengeId === 0 && !isWhitelisted && applicationExpiry)
      const commitOpen = await registry.commitStageActive(domain)
      const revealOpen = await registry.revealStageActive(domain)

      let action = null

      if (commitOpen) {
        action = 'commit'
      } else if (revealOpen) {
        action = 'reveal'
      } else if (challengeOpen) {
        action = 'challenge'
      } else if (isWhitelisted) {
        action = 'in_registry'
      } else {
        action = 'apply'
      }

      if (this._isMounted) {
        this.setState({
          action
        })
      }
    } catch (error) {
      toastr.error(error.message)
    }
  }
}

DomainProfileActionContainer.propTypes = {
  domain: PropTypes.string,
  action: PropTypes.string
}

export default DomainProfileActionContainer
