import React, { Component } from 'react'
import PropTypes from 'prop-types'
import commafy from 'commafy'

import './AccountStatsbar.css'

class AccountStatsbar extends Component {
  constructor (props) {
    super()

    this.state = {
      account: props.account,
      totalTimesChallenged: null,
      totalTimesCommitted: null,
      totalTimesRevealed: null,
      totalTokensClaimed: null
    }

    this.fetchStats()
  }

  componentDidMount () {
    this._isMounted = true
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  render () {
    const {
      totalTimesChallenged,
      totalTimesCommitted,
      totalTimesRevealed,
      totalTokensClaimed
    } = this.state

    return (
      <div className='AccountStatsbar BoxFrame'>
        <div className='ui grid stackable'>
          <div className='row'>
            <div className='column four wide'>
              Total Times Challenged: <strong>{totalTimesChallenged === null ? '-' : commafy(totalTimesChallenged)}</strong>
            </div>
            <div className='column four wide'>
              Total Times Committed: <strong>{totalTimesCommitted === null ? '-' : totalTimesCommitted}</strong>
            </div>
            <div className='column four wide'>
              Total Times Revealed: <strong>{totalTimesRevealed === null ? '-' : totalTimesRevealed}</strong>
            </div>
            <div className='column four wide Category'>
              Total Tokens Claimed: <strong>{totalTokensClaimed === null ? '-' : totalTokensClaimed}</strong>
            </div>
          </div>
        </div>
      </div>
    )
  }

  async fetchStats () {
    const {account} = this.state

    if (!account) {
      return false
    }

    const response = await window.fetch(`https://adchain-registry-api.metax.io/stats/account?account=${account}`)
    const {
      totalTimesChallenged,
      totalTimesCommitted,
      totalTimesRevealed,
      totalTokensClaimed
    } = await response.json()

    if (this._isMounted) {
      this.setState({
        totalTimesChallenged,
        totalTimesCommitted,
        totalTimesRevealed,
        totalTokensClaimed
      })
    }
  }
}

AccountStatsbar.propTypes = {
  domain: PropTypes.string,
  account: PropTypes.string
}

export default AccountStatsbar
