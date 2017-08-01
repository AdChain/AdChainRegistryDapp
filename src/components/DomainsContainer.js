import React, { Component } from 'react'

import RegistryStatsbar from './RegistryStatsbar'
import AdtCalculator from './AdtCalculator'

import './DomainsContainer.css'

class DomainsContainer extends Component {
  render () {
    return (
      <div className='DomainsContainer'>
        <div className='ui grid padded'>
          <div className='column ten wide'>
            <RegistryStatsbar />
          </div>
          <div className='column six wide'>
            <AdtCalculator />
          </div>
          <div className='column sixteen wide'>
            domains
          </div>
        </div>
      </div>
    )
  }
}

export default DomainsContainer
