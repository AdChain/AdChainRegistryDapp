import React, { Component } from 'react'
import PropTypes from 'prop-types'
import commafy from 'commafy'
import toastr from 'toastr'

import store from '../store'
import registry from '../services/registry'

import WithdrawVotingRightsInProgressContainer from './WithdrawVotingRightsInProgressContainer'
import './WithdrawVotingRightsContainer.css'

class WithdrawVotingRightsContainer extends Component {
  constructor (props) {
    super()

    this.state = {
      account: props.account,
      availableTokens: null,
      inProgress: false
    }

    this.onWithdraw = this.onWithdraw.bind(this)
  }

  componentDidMount () {
    this._isMounted = true
    this.getAvailableTokensToWithdraw()

    store.subscribe(x => {
      this.getAvailableTokensToWithdraw()
    })
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  render () {
    const {
      availableTokens,
      inProgress
    } = this.state

    return (
      <div className='WithdrawVotingRightsContainer BoxFrame'>
        <div className='ui grid stackable center aligned'>
          <div className='column sixteen wide'>
            <p>Withdraw Voting Rights</p>
            <button
              onClick={this.onWithdraw}
              className='ui button blue tiny'>
              Withdraw {availableTokens === null ? '' : commafy(availableTokens)} Tokens
            </button>
          </div>
        </div>
        {inProgress ? <WithdrawVotingRightsInProgressContainer /> : null}
      </div>
    )
  }

  async getAvailableTokensToWithdraw () {
    const {account} = this.state

    if (!account) {
      return false
    }

    try {
      const availableTokens = await registry.getAvailableTokensToWithdraw()

      this.setState({
        availableTokens
      })
    } catch (error) {
      toastr.error(error.message)
    }
  }

  onWithdraw (event) {
    event.preventDefault()

    this.withdrawTokens()
  }

  async withdrawTokens () {
    const {availableTokens} = this.state

    this.setState({
      inProgress: true
    })

    try {
      await registry.withdrawVotingRights(availableTokens)
      toastr.success('Success')
    } catch (error) {
      toastr.error(error.message)
    }

    this.setState({
      inProgress: false
    })
  }
}

WithdrawVotingRightsContainer.propTypes = {
  account: PropTypes.string
}

export default WithdrawVotingRightsContainer
