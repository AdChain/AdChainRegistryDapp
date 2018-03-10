import React, { Component } from 'react'
import MapVoting from './assets/map_voting.svg'
import MapApplication from './assets/map_in_application.svg'
import MapRegistryChallenge from './assets/map_in_registry_challenge.svg'
import MapRegistryNoChallenge from './assets/map_in_registry_nochallenge.svg'
import MapReveal from './assets/map_reveal.svg'
import MapRejected from './assets/map_rejected.svg'

const walkthroughSteps = [
  {
    title: 'Domain\'s Journey - First Step',
    text: 'When a domain is applied into the adChain Registry, it is immediately in the In Application stage.',
    selector: '.RegistryGuideModalDomainJourney .MapApplication',
    position: 'left',
    type: 'click',
    isFixed: true,
    name: 'domainsjourney-first-step',
    parent: 'DomainsContainer'
  },
  {
    title: 'Domain\'s Journey - Second Step',
    text: 'If the domain is not challenged during the In Application stage, it is automatically admitted into the adChain Registry.',
    selector: '.RegistryGuideModalDomainJourney .MapRegistryNoChallenge',
    position: 'left',
    type: 'click',
    isFixed: true,
    name: 'domainsjourney-second-step',
    parent: 'DomainsContainer'
  },
  {
    title: 'Domain\'s Journey - Third Step',
    text: 'If the domain is challenged during the In Application stage, it goes into the first voting stage: Voting Commit. ADT holders commit their votes to either Support or Oppose the domain\'s application.',
    selector: '.RegistryGuideModalDomainJourney .MapVoting',
    position: 'left',
    type: 'click',
    isFixed: true,
    name: 'domainsjourney-third-step',
    parent: 'DomainsContainer'
  },
  {
    title: 'Domain\'s Journey - Fourth Step',
    text: 'Once the Voting Commit stage ends, the Voting Reveal stage begins. In this stage, ADT holders who previously committed votes are asked to reveal them. Only revealed votes count.',
    selector: '.RegistryGuideModalDomainJourney .MapReveal',
    position: 'left',
    type: 'click',
    isFixed: true,
    name: 'domainsjourney-fourth-step',
    parent: 'DomainsContainer'
  },
  {
    title: 'Domain\'s Journey - Fifth Step',
    text: 'If the majority of the revealed ADT votes are in-favor of the domain\'s application, then the domain is admitted into the adChain Registry.',
    selector: '.RegistryGuideModalDomainJourney .MapRegistryChallenge',
    position: 'left',
    type: 'click',
    isFixed: true,
    name: 'domainsjourney-fifth-step',
    parent: 'DomainsContainer'
  },
  {
    title: 'Domain\'s Journey - Sixth Step',
    text: 'If the majority of the revealed ADT votes are in-opposition of the domain\'s application, then the domain is rejected from the adChain Registry. It can immediately be applied again.',
    selector: '.RegistryGuideModalDomainJourney .MapRejected',
    position: 'left',
    type: 'click',
    isFixed: true,
    name: 'domainsjourney-sixth-step',
    parent: 'DomainsContainer'
  }
]

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
    this.startJoyride(walkthroughSteps)
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
