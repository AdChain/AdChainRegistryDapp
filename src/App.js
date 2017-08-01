import React from 'react'
import { HashRouter as Router, Route, NavLink as Link } from 'react-router-dom'

import MainSidebar from './components/MainSidebar'
import MainContainer from './components/MainContainer'

import './App.css'

function App () {
  return (
    <Router>
      <div className='App'>
        <div className='ui grid stackable'>
          <div
            className='MainSidebarWrap column four wide'>
            <MainSidebar Link={Link} />
          </div>
          <div className='MainContainerWrap column twelve wide'>
            <MainContainer Route={Route} />
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App
