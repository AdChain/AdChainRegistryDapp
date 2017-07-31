import React, { Component } from 'react'
import './App.css'

import MainSidebar from './components/MainSidebar'
import MainContainer from './components/MainContainer'

class App extends Component {
  render () {
    return (
      <div className='App'>
        <div className='ui grid stackable'>
          <div
            className='MainSidebarWrap column four wide'>
            <MainSidebar />
          </div>
          <div className='MainContainerWrap column twelve wide'>
            <MainContainer />
          </div>
        </div>
      </div>
    )
  }
}

export default App
