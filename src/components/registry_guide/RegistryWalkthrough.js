import React, { Component } from 'react'
import Joyride from 'react-joyride'
import 'react-joyride/lib/react-joyride-compiled.css'
import PubSub from 'pubsub-js'
import isMobile from 'is-mobile'

class RegistryWalkthrough extends Component {
  constructor (props) {
    super(props)
    this.state = {
      shouldRun: false,
      mobile: isMobile(),
      walkthroughSteps: [],
      shouldShowOverlay: true
    }
    this.handleJoyrideCallback = this.handleJoyrideCallback.bind(this)
    this.startJoyride = this.startJoyride.bind(this)
    this.resumeJoyride = this.resumeJoyride.bind(this)
    this.pauseJoyride = this.pauseJoyride.bind(this)
    this.toggleOverlay = this.toggleOverlay.bind(this)
    this.updateDomainJourney = this.updateDomainJourney.bind(this)
    this.updateStaticContainer = this.updateStaticContainer.bind(this)
    this.resetSteps = this.resetSteps.bind(this)
  }

  componentWillMount () {
    this.pubsubSubscription()
  }

  render () {
    if(this.state.mobile) return null
    const {
      shouldRun,
      walkthroughSteps,
      shouldShowOverlay
    } = this.state

    return (
      <Joyride
        ref={c => (this.joyride = c)}
        steps={walkthroughSteps}
        run={shouldRun}
        debug={false}
        showOverlay={shouldShowOverlay}
        locale={{
          back: (<span>Previous</span>),
          last: (<span>Close</span>),
          next: (<span>Next</span>)
        }}
        type='continuous'
        autoStart
        callback={this.handleJoyrideCallback}
      />
    )
  }

  handleJoyrideCallback (result) {
    if (result.type === 'overlay:click' || result.type === 'finished') {
      this.joyride.reset()
      this.setState({
        walkthroughSteps: []
      })
      this.updateStaticContainer()
      PubSub.publish('RegistryGuideModal.returnToMenu')
      this.updateDomainJourney('application')
    } else if (result.action === 'start' && result.type === 'beacon:before') {
      this.pauseJoyride()
    } else if (result.step.name === 'application-fourth-step' && result.action === 'next' && result.type === 'step:before') {
      this.updateStaticContainer('applicationDomains')
    } else if (result.step.name === 'application-fourth-step' && result.action === 'start') {
      this.updateStaticContainer('applicationDomains')
    } else if (result.step.name === 'application-fifth-step' && result.type === 'step:after') {
      if (result.action === 'next') {
        this.pauseJoyride()
        this.updateStaticContainer('dashboard')
      }
      // else if (result.action === 'back') {
      // this.setState({
      //   staticContainer: 'applicationDomains',
      //   shouldRun: false
      // })
      // }
    } else if (result.step.name === 'application-sixth-step' && result.action === 'back' && result.type === 'step:after') {
      this.pauseJoyride()
      this.updateStaticContainer('applicationDomains')
    } else if (result.step.name === 'challenge-first-step' && result.action === 'next') {
      // this.setState({
      //   staticContainer: 'applicationDomains',
      //   shouldRun: false
      // })
    } else if (result.step.name === 'challenge-second-step' && result.type === 'step:after') {
      if (result.action === 'next') {
        this.pauseJoyride()
        this.updateStaticContainer('challenge')
      } else if (result.action === 'back') {
        // this.setState({
        //   staticContainer: 'applicationDomains',
        //   shouldRun: false
        // })
      }
    } else if (result.step.name === 'challenge-third-step' && result.type === 'step:after') {
      if (result.action === 'next') {
        this.pauseJoyride()
        this.updateStaticContainer('voting')
      } else if (result.action === 'back') {
        this.pauseJoyride()
        this.updateStaticContainer('applicationDomains')
      }
    } else if (result.step.name === 'challenge-fourth-step' && result.action === 'back' && result.type === 'step:after') {
      this.pauseJoyride()
      this.updateStaticContainer('challenge')
    } else if (result.step.name === 'vote-first-step' && result.action === 'next') {
      // this.setState({
      //   staticContainer: 'commitDomains',
      //   shouldRun: false
      // })
    } else if (result.step.name === 'vote-second-step' && result.type === 'step:after') {
      if (result.action === 'next') {
        this.pauseJoyride()
        this.updateStaticContainer('voting')
      } else if (result.action === 'back') {
        this.updateStaticContainer('commitDomains')
      }
    } else if (result.step.name === 'vote-third-step' && result.action === 'back' && result.type === 'step:after') {
      this.pauseJoyride()
      this.updateStaticContainer('commitDomains')
    } else if (result.step.name === 'reveal-first-step' && result.action === 'next') {
      // this.setState({
      //   staticContainer: 'revealDomains',
      //   shouldRun: false
      // })
    } else if (result.step.name === 'reveal-second-step' && result.type === 'step:after') {
      if (result.action === 'next') {
        this.pauseJoyride()
        this.updateStaticContainer('reveal')
      } else if (result.action === 'back') {
        this.updateStaticContainer('revealDomains')
      }
    } else if (result.step.name === 'reveal-third-step' && result.action === 'back' && result.type === 'step:after') {
      this.pauseJoyride()
      this.updateStaticContainer('revealDomains')
    } else if (result.step.name === 'domainsjourney-first-step' && result.action === 'next' && result.type === 'step:after') {
      this.pauseJoyride()
      this.updateDomainJourney('registryNoChallenge')
    } else if (result.step.name === 'domainsjourney-second-step' && result.type === 'step:after') {
      if (result.action === 'next') {
        this.pauseJoyride()
        this.updateDomainJourney('voting')
      } else if (result.action === 'back') {
        this.pauseJoyride()
        this.updateDomainJourney('application')
      }
    } else if (result.step.name === 'domainsjourney-third-step' && result.type === 'step:after') {
      if (result.action === 'next') {
        this.pauseJoyride()
        this.updateDomainJourney('reveal')
      } else if (result.action === 'back') {
        this.pauseJoyride()
        this.updateDomainJourney('registryNoChallenge')
      }
    } else if (result.step.name === 'domainsjourney-fourth-step' && result.type === 'step:after') {
      if (result.action === 'next') {
        this.pauseJoyride()
        this.updateDomainJourney('registryChallenge')
      } else if (result.action === 'back') {
        this.pauseJoyride()
        this.updateDomainJourney('voting')
      }
    } else if (result.step.name === 'domainsjourney-fifth-step' && result.type === 'step:after') {
      if (result.action === 'next') {
        this.pauseJoyride()
        this.updateDomainJourney('rejected')
      } else if (result.action === 'back') {
        this.pauseJoyride()
        this.updateDomainJourney('reveal')
      }
    } else if (result.step.name === 'domainsjourney-sixth-step' && result.type === 'step:after' && result.action === 'back') {
      this.pauseJoyride()
      this.updateDomainJourney('registryChallenge')
    }
  }

  startJoyride (topic, steps) {
    let staticContainer
    if (steps[0].name.includes('application') || steps[0].name.includes('challenge')) {
      staticContainer = 'applicationDomains'
    } else if (steps[0].name.includes('vote')) {
      staticContainer = 'commitDomains'
    } else if (steps[0].name.includes('reveal')) {
      staticContainer = 'revealDomains'
    } else if (steps[0].name.includes('governance')) {
      staticContainer = null
    }
    this.setState({
      shouldRun: true,
      walkthroughSteps: this.state.walkthroughSteps.concat(steps)
    })
    this.updateStaticContainer(staticContainer)
  }

  resumeJoyride () {
    this.setState({
      shouldRun: true
    })
  }

  pauseJoyride () {
    this.setState({
      shouldRun: false
    })
  }

  toggleOverlay () {
    this.setState({
      shouldShowOverlay: !this.state.shouldShowOverlay
    })
  }

  async confirmWalkthrough () {
    this.setState({
      walkthroughFinished: false
    })
  }

  resetSteps () {
    // specifically called for exiting domain journey walkthrough
    this.joyride.reset()
    this.setState({
      walkthroughSteps: []
    })
    this.updateStaticContainer()
    this.updateDomainJourney('application')
  }

  updateDomainJourney (domainJourney) {
    PubSub.publish('RegistryGuideStaticDomainJourney.updateDomainJourney', domainJourney)
  }

  updateStaticContainer (staticContainer = null) {
    PubSub.publish('DomainsContainer.updateStaticContainer', staticContainer)
  }

  pubsubSubscription () {
    this.startWalkthroughEvent = PubSub.subscribe('RegistryWalkthrough.startJoyride', this.startJoyride)
    this.handleWalkthroughCallbackEvent = PubSub.subscribe('RegistryWalkthrough.handleJoyride', this.handleJoyrideCallback)
    this.resumeWalkthroughEvent = PubSub.subscribe('RegistryWalkthrough.resumeJoyride', this.resumeJoyride)
    this.toggleOverlayEvent = PubSub.subscribe('RegistryWalkthrough.toggleOverlay', this.toggleOverlay)
    this.confirmWalkthroughEvent = PubSub.subscribe('RegistryWalkthrough.confirmWalkthrough', this.confirmWalkthrough)
    this.resetStepsEvent = PubSub.subscribe('RegistryWalkthrough.resetSteps', this.resetSteps)
  }
}

export default RegistryWalkthrough
