import React from 'react'

import MainTopbar from './MainTopbar'
import ApplicationContainer from './ApplicationContainer'
import DomainsContainer from './DomainsContainer'

import './MainContainer.css'

function MainContainer (props) {
  const Route = props.Route
  const Switch = props.Switch
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
            <Route path='/apply' exact component={ApplicationContainer} />
            <Route path='/domains' exact component={DomainsContainer} />
            <Route path='/' exact component={DomainsContainer} />
          </Switch>
        </Route>
      </CSSTransitionGroup>

    </div>
  )
}

export default MainContainer
