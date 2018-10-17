import React, { Component } from 'react'
import PropTypes from 'prop-types'
import commafy from 'commafy'
import Tooltip from '../Tooltip'
import './AccountStatsbar.css'
import { registryApiURL } from '../../models/urls'

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
              <Tooltip
                info='Total number of times this account has challenged domains'
              />
            </div>
            <div className='column four wide'>
              Total Times Committed: <strong>{totalTimesCommitted === null ? '-' : totalTimesCommitted}</strong>
              <Tooltip
                info='Total number of times this account has committed votes for domains'
              />
            </div>
            <div className='column four wide'>
              Total Times Revealed: <strong>{totalTimesRevealed === null ? '-' : totalTimesRevealed}</strong>
              <Tooltip
                info='Total number of times this account has revealed votes for domains'
              />
            </div>
            <div className='column four wide Category'>
              Total adToken Claimed: <strong>{totalTokensClaimed === null ? '-' : (totalTokensClaimed / Math.pow(10, 9)).toFixed(0)}</strong>
              <Tooltip
                info='Total number of adToken this account has claimed for winning challenges'
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  async fetchStats () {
    const {account} = this.state

    if (!account || account === '0x0') {
      return false
    }

    try {
      const response = await window.fetch(`${registryApiURL}/stats/account?account=${account}`)
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
    } catch (error) {
      console.log(error)
    }
  }
}

AccountStatsbar.propTypes = {
  domain: PropTypes.string,
  account: PropTypes.string
}

export default AccountStatsbar
