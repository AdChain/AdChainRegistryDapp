import React, { Component } from 'react'
import PropTypes from 'prop-types'
import commafy from 'commafy'
import toastr from 'toastr'
import { Popup } from 'semantic-ui-react'

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
            <p>Withdraw Voting Rights
              <Popup
                trigger={<i className='icon info circle' />}
                content='Withdraw adToken held by the adChain Registry PLCR contract. AdToken is locked up during voting and unlocked after the reveal stage. When it is unlocked you may withdraw the adToken to your account at any time.'
              />
            </p>
            <div><small>Available unlocked ADT: <strong>{availableTokens !== null ? commafy(availableTokens) : '-'}</strong></small></div>
            <div>
              <button
                onClick={this.onWithdraw}
                className='ui button blue tiny'>
                Withdraw ADT
            </button>
            </div>
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

    if (this._isMounted) {
      this.setState({
        inProgress: true
      })
    }

    try {
      await registry.withdrawVotingRights(availableTokens)
      toastr.success('Success')
    } catch (error) {
      toastr.error(error.message)
    }

    if (this._isMounted) {
      this.setState({
        inProgress: false
      })
    }
  }
}

WithdrawVotingRightsContainer.propTypes = {
  account: PropTypes.string
}

export default WithdrawVotingRightsContainer
