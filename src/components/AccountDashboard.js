import React, { Component } from 'react'
import PropTypes from 'prop-types'

import registry from '../services/registry'
import DomainsTable from './DomainsTable'
import AccountHeader from './AccountHeader'

import './AccountDashboard.css'

class AccountDashboard extends Component {
  constructor (props) {
    super()

    this.state = {
      history: props.history,
      account: null
    }

    const account = registry.getAccount()
    this.state.account = account
  }

  render () {
    const {
      history,
      account
    } = this.state

    const tableFilters = [{id: 'account', value: account}]

    return (
      <div className='AccountDashboard'>
        <div className='ui grid stackable padded'>
          <div className='row'>
            <div className='column sixteen wide'>
              <AccountHeader account={account} />
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

AccountDashboard.propTypes = {
  history: PropTypes.object
}

export default AccountDashboard
