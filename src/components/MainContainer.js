import React, { Component } from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'

import MainTopbar from './MainTopbar'
import ApplicationContainer from './ApplicationContainer'
import DomainsContainer from './DomainsContainer'

class MainContainer extends Component {
  render () {
    return (
      <Router>
        <div className='ui grid'>
          <MainTopbar />
          <Route path='/' exact={true} component={ApplicationContainer} />
          <Route path='/apply' exact={true} component={ApplicationContainer} />
          <Route path='/domains' exact={true} component={DomainsContainer} />
        </div>
      </Router>
    )
  }
}

export default MainContainer
