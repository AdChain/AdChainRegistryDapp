import React, { Component } from 'react'

import MainTopbar from './MainTopbar'
import ApplicationContainer from './ApplicationContainer'

class MainContainer extends Component {
  render () {
    return (
      <div className='ui grid'>
        <MainTopbar />
        <ApplicationContainer />
      </div>
    )
  }
}

export default MainContainer
