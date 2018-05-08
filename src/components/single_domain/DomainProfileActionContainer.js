import React, { Component } from 'react'
import PropTypes from 'prop-types'
import toastr from 'toastr'
import PubSub from 'pubsub-js'
import store from '../../store'

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
      domainData
    } = props

    this.state = {
      domain,
      domainData,
      stage: null
    }
    this.getData = this.getData.bind(this)
  }

  componentDidMount () {
    this._isMounted = true
    // TODO unsubscribe on dismount
    store.subscribe(x => {
      setTimeout(() => this.getData(), 1e3)
    })
  }

  componentWillMount () {
    this.getDataEvent = PubSub.subscribe('DomainProfileActionContainer.getData', this.getData)
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  componentWillReceiveProps (next) {
    if (next.domainData) {
      this.setState({
        domainData: next.domainData
      })
      if (next.domainData) this.getData(next.domainData)
    }
  }

  render () {
    const {
      domain,
      stage,
      domainData
    } = this.state

    if (!stage || !domainData) return null

    let component = null
    if (stage === 'in_application') {
      component = <DomainChallengeContainer domain={domain} domainData={domainData} redirectState={this.props.redirectState} />
    } else if (stage === 'voting_commit' || stage === 'in_registry_in_commit') {
      component = <DomainVoteCommitContainer domain={domain} domainData={domainData} redirectState={this.props.redirectState} />
    } else if (stage === 'voting_reveal' || stage === 'in_registry_in_reveal') {
      component = <DomainVoteRevealContainer domain={domain} domainData={domainData} redirectState={this.props.redirectState} />
    } else if (stage === 'in_registry') {
      component = <DomainInRegistryContainer domain={domain} domainData={domainData} redirectState={this.props.redirectState} />
    } else if (stage === 'in_registry_update_status' || stage === 'in_application_pending' || stage === 'reveal_pending') {
      component = <DomainPendingContainer domain={domain} domainData={domainData} />
    } else if (stage === 'apply') {
      component = <DomainRejectedContainer stage={'Rejected'} domain={domain} domainData={domainData}/>
    } else if (stage === 'withdrawn') {
      component = <DomainRejectedContainer stage={'Withdrawn'} domain={domain} domainData={domainData}/>
    } else {
      component = <DomainNotInRegistryContainer domain={domain} domainData={domainData} />
    }

    return (
      <div className='OuterDomainProfileActionContainer'>
        <div className='DomainProfileActionContainer BoxFrame'>
          { component }
        </div>
      </div>
    )
  }

  async getData (domainData) {
    if (domainData) {
      try {
        if (this._isMounted) {
          this.setState({
            stage: domainData.stage,
            domainData
          })
        }
      } catch (error) {
        console.log('Domain Profile Action getData error: ', error)
        toastr.error('There was an error with your request')
      }
    }
  }
}

DomainProfileActionContainer.propTypes = {
  domain: PropTypes.string
}

export default DomainProfileActionContainer
