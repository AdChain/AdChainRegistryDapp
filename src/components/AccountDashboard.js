import React, { Component } from 'react'

import DomainsTable from './DomainsTable'

import AccountHeader from './AccountHeader'

import './AccountDashboard.css'

class AccountDashboard extends Component {
  constructor (props) {
    super()

    this.state = {
      history: props.history
    }
  }

  render () {
    const {
      history
    } = this.state

    const tableFilters = [{id: 'domain', value: 'cnn.com'}]

    return (
      <div className='AccountDashboard'>
        <div className='ui grid stackable padded'>
          <div className='row'>
            <div className='column sixteen wide'>
              <AccountHeader />
            </div>
          </div>
          <div className='row'>
            <div className='column sixteen wide'>
              <DomainsTable
                history={history}
                filters={tableFilters}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default AccountDashboard
