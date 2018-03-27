import React, { Component } from 'react'
import toastr from 'toastr'

import './DomainProfileStageMap.css'
import Tooltip from './Tooltip'
import getDomainState from '../utils/determineDomainState'

import MapInApplication from './assets/stage_maps/map_application.svg'
import MapInApplicationPending from './assets/stage_maps/map_in_application_pending.svg'
import MapInRegistryNoChallengeId from './assets/stage_maps/map_in_registry_no_id.svg'
import MapCommit from './assets/stage_maps/map_commit.svg'
import MapReveal from './assets/stage_maps/map_reveal.svg'
import MapRevealPending from './assets/stage_maps/map_reveal_pending.svg'
import MapRejected from './assets/stage_maps/map_rejected.svg'
import MapInRegistryChallengeId from './assets/stage_maps/map_in_registry_challenge_id.svg'
import MapInRegistyCommit from './assets/stage_maps/map_in_registry_challenge_id_commit.svg'
import MapInRegistryReveal from './assets/stage_maps/map_in_registry_no_id_reveal.svg'
import MapInRegistryRevealPending from './assets/stage_maps/map_in_registry_no_id_reveal_pending.svg'

import PubSub from 'pubsub-js'

const stageMaps = {
  MapInRegistyCommit,
  MapInRegistryReveal,
  MapInRegistryRevealPending,
  MapInRegistryNoChallengeId,
  MapInRegistryChallengeId,
  MapInApplicationPending,
  MapInApplication,
  MapCommit,
  MapReveal,
  MapRevealPending,
  MapRejected
}

class DomainProfileStageMap extends Component {
  constructor (props) {
    super()

    const {
      domain
    } = props

    this.state = {
      domain,
      stageMapSrc: null
    }

    this.updateStageMap()
  }

  componentWillMount () {
    this.subEvent = PubSub.subscribe('DomainProfileStageMap.updateStageMap', this.updateStageMap.bind(this))
  }

  componentDidMount () {
    this._isMounted = true
  }

  componentWillUnmount () {
    this._isMounted = false
    PubSub.unsubscribe(this.subEvent)
  }

  render () {
    return (
      <div className='DomainProfileStageMap BoxFrame'>
        <span className='BoxFrameLabel ui grid'>STAGE MAP: {this.state.domain} <Tooltip info={"A visual map that displays where in the adChain Registry the domain is. The domain's track is highlighted in blue (red if rejected)."} /></span>
        <div className='ui grid stackable'>
          <div className='column sixteen wide MapPicture'>
            <object className='stagesvg' type='image/svg+xml' data={this.state.stageMapSrc} aria-label='stageMap' />
          </div>
        </div>
      </div>
    )
  }

  async updateStageMap () {
    try {
      const { domain } = this.state
      const domainData = await getDomainState(domain)
      this.setState({
        stageMapSrc: stageMaps[domainData.stageMapSrc]
      })
    } catch (error) {
      toastr.error('There was an error with your request')
    }
  }
}

export default DomainProfileStageMap
