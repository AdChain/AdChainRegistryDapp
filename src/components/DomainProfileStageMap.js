import React, { Component } from 'react'
import toastr from 'toastr'
import registry from '../services/registry'
import moment from 'moment'

import './DomainProfileStageMap.css'
import Tooltip from './Tooltip'
import MapVoting from './assets/map_voting.svg'
import MapReveal from './assets/map_reveal.svg'
import MapRejected from './assets/map_rejected.svg'
import MapInApplication from './assets/map_in_application.svg'
import MapInRegistryChallenge from './assets/map_in_registry_challenge.svg'
import MapInRegistryNoChallenge from './assets/map_in_registry_nochallenge.svg'
import MapInApplicationPending from './assets/map_in_application_pending.svg'
import MapRevealPending from './assets/map_reveal_pending.svg'

class DomainProfileStageMap extends Component {
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
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.stage !== this.props.stage) {
      // this.setState({
      //   action: nextProps.stage
      // })
      this.getData()
    }
  }

  render () {
    const {
      action
    } = this.state

    let stageMapSrc = null

    if (action === 'in_registry_challenge') {
      stageMapSrc = MapInRegistryChallenge
    } else if (action === 'in_registry_nochallenge') {
      stageMapSrc = MapInRegistryNoChallenge
    } else if (action === 'apply') {
      stageMapSrc = MapInApplication
    } else if (action === 'application_pending') {
      stageMapSrc = MapInApplicationPending
    } else if (action === 'commit') {
      stageMapSrc = MapVoting
    } else if (action === 'reveal') {
      stageMapSrc = MapReveal
    } else if (action === 'reveal_pending') {
      stageMapSrc = MapRevealPending
    } else if (action === 'rejected') {
      stageMapSrc = MapRejected
    }

    return (
      <div className='DomainProfileStageMap BoxFrame'>
        <span className='BoxFrameLabel ui grid'>STAGE MAP: {this.state.domain} <Tooltip info={"A visual map that displays where in the adChain Registry the domain is. The domain's track is highlighted in blue (red if rejected)."} /></span>
        <div className='ui grid stackable'>
          <div className='column sixteen wide MapPicture'>
            <object className='stagesvg' type='image/svg+xml' data={stageMapSrc} aria-label='stageMap' />
          </div>
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
        if (challengeId === 0) {
          action = 'in_registry_nochallenge'
        } else {
          action = 'in_registry_challenge'
        }
      } else if (challengeOpen) {
        if (challengeTimeEnded) {
          action = 'application_pending'
        } else {
          action = 'apply'
        }
      } else if (commitOpen) {
        action = 'commit'
      } else if (revealOpen) {
        action = 'reveal'
      } else if (revealPending) {
        action = 'reveal_pending'
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

export default DomainProfileStageMap
