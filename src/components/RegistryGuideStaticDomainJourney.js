import React, { Component } from 'react'
import MapVoting from './assets/stage_maps/map_commit.svg'
import MapApplication from './assets/stage_maps/map_application.svg'
import MapRegistryChallenge from './assets/stage_maps/map_in_registry_challenge_id.svg'
import MapRegistryNoChallenge from './assets/stage_maps/map_in_registry_no_id.svg'
import MapReveal from './assets/stage_maps/map_reveal.svg'
import MapRejected from './assets/stage_maps/map_rejected.svg'
import { DomainJourneySteps } from './WalkthroughSteps'

import PubSub from 'pubsub-js'

class RegistryGuideStaticDomainJourney extends Component {
  constructor (props) {
    super(props)
    this.state = {
      domainJourney: 'application'
    }

    this.resumeJoyride = props.resumeJoyride
    this.toggleOverlay = props.toggleOverlay
  }

  componentWillMount () {
    this.toggleOverlay()
  }

  componentDidMount () {
    PubSub.publish('RegistryGuideModal.startRegistryWalkthrough', DomainJourneySteps)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.domainJourney !== this.state.domainJourney) {
      this.setState({
        domainJourney: nextProps.domainJourney
      })
    }
  }

  componentDidUpdate (prevProps) {
    if (this.props.domainJourney !== prevProps.domainJourney) {
      this.resumeJoyride()
    }
  }

  componentWillUnmount () {
    this.toggleOverlay()
  }

  render () {
    const { domainJourney } = this.state

    let domainMapSrc = MapApplication
    let domainClass = 'MapApplication'

    if (domainJourney === 'registryNoChallenge') {
      domainMapSrc = MapRegistryNoChallenge
      domainClass = 'MapRegistryNoChallenge'
    } else if (domainJourney === 'voting') {
      domainMapSrc = MapVoting
      domainClass = 'MapVoting'
    } else if (domainJourney === 'reveal') {
      domainMapSrc = MapReveal
      domainClass = 'MapReveal'
    } else if (domainJourney === 'registryChallenge') {
      domainMapSrc = MapRegistryChallenge
      domainClass = 'MapRegistryChallenge'
    } else if (domainJourney === 'rejected') {
      domainMapSrc = MapRejected
      domainClass = 'MapRejected'
    }

    return (
      <div className='GuideText'>
        <object className={domainClass} type='image/svg+xml' data={domainMapSrc} aria-label='stageMap' />
      </div>
    )
  }
}

export default RegistryGuideStaticDomainJourney
