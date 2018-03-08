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
      staticContainer: null
    }
    this.handleJoyrideCallback = this.handleJoyrideCallback.bind(this)
    this.startJoyride = this.startJoyride.bind(this)
    this.resumeJoyride = this.resumeJoyride.bind(this)
  }
  render () {
    const { shouldRun, walkthroughSteps, staticContainer } = this.state

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
                showOverlay
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
                <MainSidebar Link={Link} startJoyride={this.startJoyride} handleJoyrideCallback={this.handleJoyrideCallback}/>
              </div>
              <div className='MainContainerWrap column twelve wide'>
                <MainContainer
                  Route={Route}
                  CSSTransitionGroup={CSSTransitionGroup}
                  Switch={Switch}
                  Redirect={Redirect}
                  location={location}
                  staticContainer={staticContainer}
                  joyride={this.joyride}
                  resumeJoyride={this.resumeJoyride} />
              </div>
            </div>
          </div>
        )} />
      </Router>
    )
  }
  handleJoyrideCallback (result) {
    console.log('result: ', result)
    if (result.action === 'start' && result.type === 'beacon:before') {
      this.setState({ shouldRun: false })
    } else if (result.type === 'overlay:click' || result.type === 'finished') {
      this.joyride.reset()
      this.setState({ 
        walkthroughSteps: [],
        staticContainer: null
      })
    } else if (result.step.name === 'challenge-second-step' && result.action === 'next' && result.type === 'step:after') {
      this.setState({
        staticContainer: 'challenge',
        shouldRun: false
      })
    } else if (result.step.name === 'challenge-third-step' && result.action === 'next' && result.type === 'step:after') {
      this.setState({
        staticContainer: 'registry',
        shouldRun: false
      })
    }
    // if (result.type === 'finished') {
    //  this.props.history.push('/account')
    // }
  }

  startJoyride (steps) {
    this.setState({ 
      shouldRun: true,
      walkthroughSteps: this.state.walkthroughSteps.concat(steps)
    })
  }
  
  resumeJoyride () {
    this.setState({
      shouldRun: true
    })
  }
}

export default App
