import React from 'react'
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

import './App.css'

function App () {
  return (
    <Router>
      <Route render={({ location }) => (
        <div className='App'>
          <div className='ui grid stackable'>
            <div
              className='MainSidebarWrap column four wide'>
              <MainSidebar Link={Link} />
            </div>
            <div className='MainContainerWrap column twelve wide'>
              <MainContainer
                Route={Route}
                CSSTransitionGroup={CSSTransitionGroup}
                Switch={Switch}
                Redirect={Redirect}
                location={location} 
                Link={Link}/>
            </div>
          </div>
        </div>
      )} />
    </Router>
  )
}

export default App
