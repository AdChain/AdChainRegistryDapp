import React, { Component } from 'react'
import isMobile from 'is-mobile'
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
import RegistryWalkthrough from './components/registry_guide/RegistryWalkthrough'
import TransactionProgressModal from './components/TransactionProgressModal'
import { MobileNavigation } from './components/mobile_nav/MobileNavigation';
import  MobileApplication  from './components/mobile_nav/MobileApplication';

class App extends Component {
  render () {
    return (
      <Router>
        <Route render={({ location }) => (
          <div className='App'>
            <div className='ui grid stackable'>
              <RegistryWalkthrough />
              <div className={isMobile() ? 'MobileApplicationContainer' :'MainSidebarWrap column four wide'}>
                <MainSidebar Link={Link} />
                <MobileApplication Link={Link} Route={Route}/>
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
              <MobileNavigation Link={Link} Route={Route}/>
              <TransactionProgressModal />
            </div>
          </div>
        )} />
      </Router>
    )
  }
}

export default App
