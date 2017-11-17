import React, { Component } from 'react'
import PropTypes from 'prop-types'

import store from '../store'
import registry from '../services/registry'
import DomainsTable from './DomainsTable'
// import AccountHeader from './AccountHeader'
import AccountStatsbar from './AccountStatsbar'
import DomainsFilterPanel from './DomainsFilterPanel'

import RequestTokenApprovalContainer from './RequestTokenApprovalContainer.js'
import RequestVotingRightsContainer from './RequestVotingRightsContainer.js'
import WithdrawVotingRightsContainer from './WithdrawVotingRightsContainer.js'
import './AccountDashboard.css'

class AccountDashboard extends Component {
  constructor (props) {
    super()

    this.state = {
      history: props.history,
      account: null,
      tableFilters: [],
      query: {}
    }

    const account = registry.getAccount()

    if (account) {
      this.state.account = account
    }

    this.state.tableFilters = [{id: 'account', value: account || '0x0'}]
    this.onQueryChange = this.onQueryChange.bind(this)
    this.updateTableFilters = this.updateTableFilters.bind(this)
  }

  componentDidMount () {
    store.subscribe(() => {
      if (!this.state.account) {
        const account = registry.getAccount()
        this.setState({
          account
        })

        this.updateTableFilters()
      }
    })
  }

  render () {
    const {
      history,
      account,
      tableFilters,
      query
    } = this.state

    return (
      <div className='AccountDashboard'>
        <div className='ui grid stackable padded'>
          <div className='column sixteen wide NoPaddingBottom'>
            <AccountStatsbar account={account} />
          </div>
          <div className='row NoPaddingBottom'>
            <div className='column five wide NoPaddingRight'>
              <RequestTokenApprovalContainer account={account} />
            </div>
            <div className='column five wide NoPaddingRight'>
              <RequestVotingRightsContainer account={account} />
            </div>
            <div className='column six wide'>
              <WithdrawVotingRightsContainer account={account} />
            </div>
          </div>
          <div className='row'>
            <div className='column four wide'>
              <DomainsFilterPanel
                filters={query}
                onFiltersChange={this.onQueryChange}
              />
            </div>
            <div className='column twelve wide'>
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

  // React-table filter
  updateTableFilters () {
    let {query, account} = this.state

    const stageFilter = {
      id: 'stage',
      value: undefined
    }

    const domainFilter = {
      id: 'domain',
      value: undefined
    }

    let filter = []

    // TODO: better way
    for (let k in query) {
      if (query[k]) {
        if (k === 'inRegistry') {
          filter.push('in_registry')
        } else if (k === 'inApplication') {
          filter.push('in_application')
        } else if (k === 'inVoting') {
          filter.push('voting_commit')
          filter.push('voting_reveal')
        } else if (k === 'inVotingCommit') {
          filter.push('voting_commit')
        } else if (k === 'inVotingReveal') {
          filter.push('voting_reveal')
        } else if (k === 'rejected') {
          filter.push('rejected')
        } else if (k === 'domain') {
          domainFilter.value = query[k]
        }
      }
    }

    filter = new RegExp(filter.join('|'), 'gi')
    stageFilter.value = filter

    // 0x0 is for showing no rows if no account found (other empty account means show all)
    const accountFilter = {id: 'account', value: account || '0x0'}

    this.setState({tableFilters: [domainFilter, stageFilter, accountFilter]})
  }

  onQueryChange (query) {
    this.setState({query})

    console.log(query)
    this.updateTableFilters()
  }
}

AccountDashboard.propTypes = {
  history: PropTypes.object
}

export default AccountDashboard
