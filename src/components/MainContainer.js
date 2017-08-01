import React from 'react'

import MainTopbar from './MainTopbar'
import ApplicationContainer from './ApplicationContainer'
import DomainsContainer from './DomainsContainer'

function MainContainer (props) {
  const Route = props.Route

  return (
    <div className='ui grid'>
      <MainTopbar />
      <Route path='/' exact={true} component={DomainsContainer} />
      <Route path='/apply' exact={true} component={ApplicationContainer} />
      <Route path='/domains' exact={true} component={DomainsContainer} />
    </div>
  )
}

export default MainContainer
