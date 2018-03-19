import React, { Component } from 'react'
import PropTypes from 'prop-types'
import commafy from 'commafy'
import toastr from 'toastr'
import Tooltip from './Tooltip'
import store from '../store'
import registry from '../services/registry'

import './WithdrawVotingRightsContainer.css'

class WithdrawVotingRightsContainer extends Component {
  constructor (props) {
    super()

    this.state = {
      account: props.account,
      availableTokens: null,
      lockedTokens: null
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
      availableTokens
    } = this.state

    return (

      <div className='column five wide t-center'>
            Unlocked Voting ADT <Tooltip class='InfoIconHigh' info='These are tokens once used in voting. Since the voting is over, they are able to be withdrawn from the adChain Registry and returned to your wallet.' />
        <div className='column sixteen wide UnlockedAdt'>
          <span className='VotingTokensAmount'>
            {availableTokens !== null ? commafy(availableTokens) + ' ADT' : '-'}
          </span>
          <div>
            <button
              onClick={this.onWithdraw}
              className='ui button green tiny'>
                WITHDRAW
            </button>
          </div>
        </div>
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
      const lockedTokens = (await registry.getLockedTokens()).toNumber()
      if (this._isMounted) {
        this.setState({
          availableTokens,
          lockedTokens
        })
      }
    } catch (error) {
      toastr.error('There was an error with your request')
    }
  }

  onWithdraw (event) {
    event.preventDefault()

    this.withdrawTokens()
  }

  async withdrawTokens () {
    const {availableTokens} = this.state

    // if (this._isMounted) {
    //   this.setState({
    //     inProgress: true
    //   })
    // }

    try {
      console.log('available tokens: ', availableTokens)
      await registry.withdrawVotingRights(availableTokens)

      toastr.success('Success')
    } catch (error) {
      toastr.error('There was an error with your request')
    }

    // if (this._isMounted) {
    //   this.setState({
    //     inProgress: false
    //   })
    // }
  }
}

WithdrawVotingRightsContainer.propTypes = {
  account: PropTypes.string
}

export default WithdrawVotingRightsContainer
