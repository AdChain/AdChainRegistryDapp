import React, { Component } from 'react'
import MapVoting from './assets/map_voting.svg'
import MapApplication from './assets/map_in_application.svg'
import MapRegistryChallenge from './assets/map_in_registry_challenge.svg'
import MapRegistryNoChallenge from './assets/map_in_registry_nochallenge.svg'
import MapReveal from './assets/map_reveal.svg'
import MapRejected from './assets/map_rejected.svg'
import { DomainJourneySteps } from './WalkthroughSteps'

class RegistryGuideStaticDomainJourney extends Component {
  constructor (props) {
    super(props)
    this.state = {
      domainJourney: 'application'
    }

    this.startJoyride = props.startJoyride
    this.resumeJoyride = props.resumeJoyride
    this.toggleOverlay = props.toggleOverlay
  }

  componentWillMount () {
    this.toggleOverlay()
  }

  componentDidMount () {
    this.startJoyride(DomainJourneySteps)
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
