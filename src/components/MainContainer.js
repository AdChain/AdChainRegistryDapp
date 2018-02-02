import React from 'react'
import PropTypes from 'prop-types'

import MainTopbar from './MainTopbar'
import ApplicationContainer from './ApplicationContainer'
import DomainsContainer from './DomainsContainer'
import DomainProfile from './DomainProfile'
import AccountDashboard from './AccountDashboard'
import RocketChat from './RocketChat'
import GovernanceContainer from './GovernanceContainer'
import './MainContainer.css'

function MainContainer (props) {
  const Route = props.Route
  const Switch = props.Switch
  const Redirect = props.Redirect
  const CSSTransitionGroup = props.CSSTransitionGroup
  const location = props.location
  const key = location.pathname

  return (
    <div className='ui grid'>
      <MainTopbar />

      <CSSTransitionGroup
        transitionName='MainContainerFade'
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}>

        <Route location={location} key={key}>
          <Switch>
            <Redirect path='/' to='/domains' exact />
            <Route path='/apply' exact component={ApplicationContainer} />
            <Route path='/domains' exact component={DomainsContainer} />
            <Route path='/domains/:domain' exact component={DomainProfile} />
            <Route path='/account' exact component={AccountDashboard} />
            <Route path='/chat' exact component={RocketChat} />
            <Route path='/governance' exact component={GovernanceContainer} />
            <Route path='/' exact component={DomainsContainer} />
          </Switch>
        </Route>
      </CSSTransitionGroup>

    </div>
  )
}

MainContainer.propTypes = {
/*
  Route: PropTypes.ReactElement,
  Switch: PropTypes.ReactElement,
  CSSTransitionGroup: PropTypes.ReactElement,
*/
  location: PropTypes.object
}

export default MainContainer
