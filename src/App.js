import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  NavLink as Link,
  Switch,
  Redirect
} from 'react-router-dom'

import CSSTransitionGroup from 'react-addons-css-transition-group'

import MainSidebar from './components/MainSidebar'
import MainContainer from './components/MainContainer'
import Joyride from 'react-joyride'
import 'react-joyride/lib/react-joyride-compiled.css'

import './App.css'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      shouldRun: false,
      walkthroughSteps: [],
      staticContainer: null,
      domainJourney: null,
      shouldShowOverlay: true,
      walkthroughFinished: false
    }
    this.handleJoyrideCallback = this.handleJoyrideCallback.bind(this)
    this.startJoyride = this.startJoyride.bind(this)
    this.resumeJoyride = this.resumeJoyride.bind(this)
    this.toggleOverlay = this.toggleOverlay.bind(this)
    this.confirmWalkthrough = this.confirmWalkthrough.bind(this)
  }
  render () {
    const { shouldRun, walkthroughSteps, staticContainer, domainJourney, shouldShowOverlay, walkthroughFinished } = this.state

    return (
      <Router>
        <Route render={({ location }) => (
          <div className='App'>
            <div className='ui grid stackable'>
              <Joyride
                ref={c => (this.joyride = c)}
                steps={walkthroughSteps}
                run={shouldRun}
                debug={false}
                showOverlay={shouldShowOverlay}
                locale={{
                  back: (<span>Back</span>),
                  close: (<span>Close</span>),
                  next: (<span>Next</span>)
                }}
                type='continuous'
                autoStart
                callback={this.handleJoyrideCallback}
              />
              <div
                className='MainSidebarWrap column four wide'>
                <MainSidebar Link={Link} startJoyride={this.startJoyride} handleJoyrideCallback={this.handleJoyrideCallback} resumeJoyride={this.resumeJoyride} domainJourney={domainJourney} toggleOverlay={this.toggleOverlay} walkthroughFinished={walkthroughFinished} confirmWalkthrough={this.confirmWalkthrough} />
              </div>
              <div className='MainContainerWrap column twelve wide'>
                <MainContainer
                  Link={Link}
                  Route={Route}
                  CSSTransitionGroup={CSSTransitionGroup}
                  Switch={Switch}
                  Redirect={Redirect}
                  location={location}
                  staticContainer={staticContainer}
                  joyride={this.joyride}
                  resumeJoyride={this.resumeJoyride}
                />
              </div>
            </div>
          </div>
        )} />
      </Router>
    )
  }
  handleJoyrideCallback (result) {
    // console.log('result: ', result)
    if (result.type === 'overlay:click' || result.type === 'finished') {
      this.joyride.reset()
      this.setState({
        walkthroughSteps: [],
        staticContainer: null,
        walkthroughFinished: true,
        domainJourney: 'application'
      })
    } else if (result.action === 'start' && result.type === 'beacon:before') {
      this.setState({
        shouldRun: false
      })
    } else if (result.step.name === 'application-fifth-step' && result.action === 'next' && result.type === 'tooltip:before') {
      this.setState({
        staticContainer: 'dashboard'
      })
    } else if (result.step.name === 'challenge-second-step' && result.action === 'next' && result.type === 'step:after') {
      this.setState({
        staticContainer: 'challenge',
        shouldRun: false
      })
    } else if (result.step.name === 'challenge-third-step' && result.type === 'step:after') {
      if (result.action === 'next') {
        this.setState({
          staticContainer: 'registry',
          shouldRun: false
        })
      } else if (result.action === 'back') {
        this.setState({
          staticContainer: null,
          shouldRun: false
        })
      }
    } else if (result.step.name === 'challenge-fourth-step' && result.action === 'back' && result.type === 'step:after') {
      this.setState({
        staticContainer: 'challenge',
        shouldRun: false
      })
    } else if (result.step.name === 'challenge-fifth-step' && result.action === 'back' && result.type === 'step:after') {
      this.setState({
        staticContainer: 'registry'
      })
    } else if (result.step.name === 'vote-second-step' && result.action === 'next' && result.type === 'step:after') {
      this.setState({
        staticContainer: 'voting',
        shouldRun: false
      })
    } else if (result.step.name === 'vote-third-step' && result.action === 'back' && result.type === 'step:after') {
      this.setState({
        staticContainer: null,
        shouldRun: false
      })
    } else if (result.step.name === 'reveal-second-step' && result.action === 'next' && result.type === 'step:after') {
      this.setState({
        staticContainer: 'reveal',
        shouldRun: false
      })
    } else if (result.step.name === 'reveal-third-step' && result.action === 'back' && result.type === 'step:after') {
      this.setState({
        staticContainer: null,
        shouldRun: false
      })
    } else if (result.step.name === 'domainsjourney-first-step' && result.action === 'next' && result.type === 'step:after') {
      this.setState({
        domainJourney: 'registryNoChallenge',
        shouldRun: false
      })
    } else if (result.step.name === 'domainsjourney-second-step' && result.type === 'step:after') {
      if (result.action === 'next') {
        this.setState({
          domainJourney: 'voting',
          shouldRun: false
        })
      } else if (result.action === 'back') {
        this.setState({
          domainJourney: 'application',
          shouldRun: false
        })
      }
    } else if (result.step.name === 'domainsjourney-third-step' && result.type === 'step:after') {
      if (result.action === 'next') {
        this.setState({
          domainJourney: 'reveal',
          shouldRun: false
        })
      } else if (result.action === 'back') {
        this.setState({
          domainJourney: 'registryNoChallenge',
          shouldRun: false
        })
      }
    } else if (result.step.name === 'domainsjourney-fourth-step' && result.type === 'step:after') {
      if (result.action === 'next') {
        this.setState({
          domainJourney: 'registryChallenge',
          shouldRun: false
        })
      } else if (result.action === 'back') {
        this.setState({
          domainJourney: 'voting',
          shouldRun: false
        })
      }
    } else if (result.step.name === 'domainsjourney-fifth-step' && result.type === 'step:after') {
      if (result.action === 'next') {
        this.setState({
          domainJourney: 'rejected',
          shouldRun: false
        })
      } else if (result.action === 'back') {
        this.setState({
          domainJourney: 'reveal',
          shouldRun: false
        })
      }
    } else if (result.step.name === 'domainsjourney-sixth-step' && result.type === 'step:after' && result.action === 'back') {
      this.setState({
        domainJourney: 'registryChallenge',
        shouldRun: false
      })
    }
  }

  startJoyride (steps) {
    this.setState({ 
      shouldRun: true,
      walkthroughSteps: this.state.walkthroughSteps.concat(steps),
      walkthroughFinished: false
    })
  }
  
  resumeJoyride () {
    this.setState({
      shouldRun: true
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
}

export default App
