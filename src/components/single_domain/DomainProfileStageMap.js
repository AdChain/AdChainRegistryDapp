import React, { Component } from 'react'
import toastr from 'toastr'
import PubSub from 'pubsub-js'

import Tooltip from '../Tooltip'

import MapInApplication from '../assets/stage_maps/map_application.svg'
import MapInApplicationPending from '../assets/stage_maps/map_in_application_pending.svg'
import MapInRegistryNoChallengeId from '../assets/stage_maps/map_in_registry_no_id.svg'
import MapCommit from '../assets/stage_maps/map_commit.svg'
import MapReveal from '../assets/stage_maps/map_reveal.svg'
import MapRevealPending from '../assets/stage_maps/map_reveal_pending.svg'
import MapRejected from '../assets/stage_maps/map_rejected.svg'
import MapInRegistryChallengeId from '../assets/stage_maps/map_in_registry_challenge_id.svg'
import MapInRegistryCommit from '../assets/stage_maps/map_in_registry_challenge_id_commit.svg'
import MapInRegistryReveal from '../assets/stage_maps/map_in_registry_no_id_reveal.svg'
import MapInRegistryRevealPending from '../assets/stage_maps/map_in_registry_no_id_reveal_pending.svg'
import MapWithdrawnChallenge from '../assets/stage_maps/map_withdrawn_challenge_id.svg'
import MapWithdrawnNoChallenge from '../assets/stage_maps/map_withdrawn_no_id.svg'

import './DomainProfileStageMap.css'

const stageMaps = {
  MapInRegistryCommit,
  MapInRegistryReveal,
  MapInRegistryRevealPending,
  MapInRegistryNoChallengeId,
  MapInRegistryChallengeId,
  MapInApplicationPending,
  MapInApplication,
  MapCommit,
  MapReveal,
  MapRevealPending,
  MapRejected,
  MapWithdrawnChallenge,
  MapWithdrawnNoChallenge
}

class DomainProfileStageMap extends Component {
  constructor (props) {
    super()

    const {
      domain,
      domainData
    } = props

    this.state = {
      domain,
      domainData,
      stageMapSrc: null
    }

    // this.updateStageMap()
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

  componentWillReceiveProps (next) {
    this.setState({
      domainData: next.domainData
    })
    if (next.domainData) {
      this.updateStageMap(next.domainData)
    }
  }

  render () {
    return (
      <div className='DomainProfileStageMap BoxFrame'>
        <span className='BoxFrameLabel ui grid'>STAGE MAP: <span className='DomainName'>{this.state.domain}</span> <Tooltip info={"A visual map that displays where in the adChain Registry the domain is. The domain's track is highlighted in blue (red if rejected)."} /></span>
        <div className='ui grid stackable'>
          <div className='column sixteen wide MapPicture'>
            <object className='stagesvg' type='image/svg+xml' data={this.state.stageMapSrc} aria-label='stageMap' />
          </div>
        </div>
      </div>
    )
  }

  async updateStageMap (domainData) {
    try {
      if (domainData) {
        this.setState({
          stageMapSrc: stageMaps[domainData.stageMapSrc]
        })
      }
    } catch (error) {
      toastr.error('There was an error with your request')
    }
  }
}

export default DomainProfileStageMap
