import React, { Component } from 'react'
import PropTypes from 'prop-types'
import toastr from 'toastr'
import PubSub from 'pubsub-js'
import store from '../../store'
import determineDomainState from '../../utils/determineDomainState'

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
      domain
    } = props

    this.state = {
      domain,
      stage: null
    }
    this.getData = this.getData.bind(this)

    this.getData()
  }

  componentDidMount () {
    this._isMounted = true
    // TODO unsubscribe on dismount
    store.subscribe(x => {
      setTimeout(() => this.getData(), 1e3)
    })
  }

  componentWillMount () {
    PubSub.subscribe('DomainProfileActionContainer.getData', this.getData)
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  render () {
    const {
      domain,
      stage
    } = this.state

    let component = null

    if (stage === 'in_application') {
      component = <DomainChallengeContainer domain={domain} />
    } else if (stage === 'voting_commit' || stage === 'in_registry_in_commit') {
      component = <DomainVoteCommitContainer domain={domain} />
    } else if (stage === 'voting_reveal' || stage === 'in_registry_in_reveal') {
      component = <DomainVoteRevealContainer domain={domain} />
    } else if (stage === 'in_registry') {
      component = <DomainInRegistryContainer domain={domain} />
    } else if (stage === 'in_registry_update_status' || stage === 'in_application_pending' || stage === 'reveal_pending') {
      component = <DomainPendingContainer domain={domain} />
    } else if (stage === 'apply') {
      component = <DomainRejectedContainer domain={domain} />
    } else {
      component = <DomainNotInRegistryContainer domain={domain} />
    }

    return (
      <div className='OuterDomainProfileActionContainer'>
        <div className='DomainProfileActionContainer BoxFrame'>
          { component }
        </div>
      </div>
    )
  }

  async getData () {
    let {domain} = this.state

    try {
      const domainData = await determineDomainState(domain)
      if (this._isMounted) {
        this.setState({
          stage: domainData.stage
        })
      }
    } catch (error) {
      console.log('Domain Profile Action getData error: ', error)
      toastr.error('There was an error with your request')
    }
  }
}

DomainProfileActionContainer.propTypes = {
  domain: PropTypes.string
}

export default DomainProfileActionContainer
