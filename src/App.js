import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  NavLink as Link,
  Switch,
  Redirect
} from 'react-router-dom'

import CSSTransitionGroup from 'react-addons-css-transition-group'
import MainSidebar from './components/sidebar/MainSidebar'
import MainContainer from './components/MainContainer'
import RegistryWalkthrough from './components/RegistryWalkthrough'
import TransactionProgressModal from './components/TransactionProgressModal'

class App extends Component {
  render () {
    return (
      <Router>
        <Route render={({ location }) => (
          <div className='App'>
            <div className='ui grid stackable'>
              <RegistryWalkthrough />
              <div
                className='MainSidebarWrap column four wide'>
                <MainSidebar Link={Link} />
              </div>
              <div className='MainContainerWrap column twelve wide'>
                <MainContainer
                  Link={Link}
                  Route={Route}
                  CSSTransitionGroup={CSSTransitionGroup}
                  Switch={Switch}
                  Redirect={Redirect}
                  location={location}
                  joyride={this.joyride}
                />
              </div>
              <TransactionProgressModal />
            </div>
          </div>
        )} />
      </Router>
    )
  }
}

export default App
