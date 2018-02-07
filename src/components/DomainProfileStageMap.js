import React, { Component } from 'react'
import toastr from 'toastr'
import registry from '../services/registry'

import './DomainProfileStageMap.css'

import MapVoting from './assets/map_voting.svg'
import MapReveal from './assets/map_reveal.svg'
import MapRejected from './assets/map_rejected.svg'
import MapInApplication from './assets/map_in_application.svg'
import MapInRegistryChallenge from './assets/map_in_registry_challenge.svg'
import MapInRegistryNoChallenge from './assets/map_in_registry_nochallenge.svg'

class DomainProfileStageMap extends Component {
  constructor (props) {
    super()

    const {
      domain,
      action,
      stage
    } = props

    this.state = {
      domain,
      action,
      stage
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
      this.setState({
        action: nextProps.stage
      })
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
    } else if (action === 'commit') {
      stageMapSrc = MapVoting
    } else if (action === 'reveal') {
      stageMapSrc = MapReveal
    } else if (action === 'rejected') {
      stageMapSrc = MapRejected
    }

    return (
      <div className='DomainProfileStageMap BoxFrame'>
        <div className='ui grid stackable'>
          <div className='row'>
            <div className='column sixteen wide'>
              <span className='Header'>Stage Map</span>
            </div>
          </div>
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

      const challengeOpen = (challengeId === 0 && !isWhitelisted && applicationExpiry)
      const commitOpen = await registry.commitStageActive(domain)
      const revealOpen = await registry.revealStageActive(domain)

      let action = null

      if (challengeOpen) {
        action = 'apply'
      } else if (isWhitelisted) {
        if (challengeId === 0) {
          action = 'in_registry_nochallenge'
        } else {
          action = 'in_registry_challenge'
        }
      } else if (commitOpen) {
        action = 'commit'
      } else if (revealOpen) {
        action = 'reveal'
      } else if (challengeId !== 0 && !isWhitelisted) {
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
      toastr.error(error.message)
    }
  }
}

export default DomainProfileStageMap
