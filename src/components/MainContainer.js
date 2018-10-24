import React, { Component } from 'react'
import PropTypes from 'prop-types'

import MainTopbar from './topbar/MainTopbar'
import AdChainList from './AdChainList'
import DomainsContainer from './domains/DomainsContainer'
import DomainProfile from './single_domain/DomainProfile'
import AccountDashboard from './dashboard/AccountDashboard'
import GovernanceContainer from './governance/GovernanceContainer'
import './MainContainer.css'

class MainContainer extends Component {
  render () {
    const Route = this.props.Route
    const Switch = this.props.Switch
    const Redirect = this.props.Redirect
    const location = this.props.location
    const key = location.pathname
    const CSSTransitionGroup = this.props.CSSTransitionGroup

    return (
      <div className='ui grid'>
        <MainTopbar />

        <CSSTransitionGroup
          transitionName='MainContainerFade'
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}>

          <Route location={location} key={key} >
            <Switch>
              <Redirect path='/' to='/domains' exact />
              <Route path='/domains' exact render={props => <DomainsContainer {... props} joyride={this.props.joyride} />} />
              <Route path='/domains/:domain' exact render={props => <DomainProfile {... props} />} />
              <Route path='/account' exact component={AccountDashboard} />
              <Route path='/governance' exact component={GovernanceContainer} />
              <Route path='/index' exact component={AdChainList} />
              <Route path='/gx' exact component={DomainsContainer} />
              <Route path='/' exact component={DomainsContainer} />
            </Switch>
          </Route>
        </CSSTransitionGroup>

      </div>
    )
  }
}

MainContainer.propTypes = {
  location: PropTypes.object
}

export default MainContainer
