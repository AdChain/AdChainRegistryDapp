import React, { Component } from 'react'

import RegistryStatsbar from './RegistryStatsbar'
import AdtCalculator from './AdtCalculator'
import DomainsTable from './DomainsTable'
import DomainsFilterPanel from './DomainsFilterPanel'

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
          <div className='column four wide'>
            <DomainsFilterPanel />
          </div>
          <div className='column twelve wide'>
            <DomainsTable />
          </div>
        </div>
      </div>
    )
  }
}

export default DomainsContainer
