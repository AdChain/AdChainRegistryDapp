import React, { Component } from 'react'
import PropTypes from 'prop-types'
import commafy from 'commafy'
import toastr from 'toastr'
import Tooltip from '../Tooltip'
import store from '../../store'
import registry from '../../services/registry'
import parameterizer from '../../services/parameterizer'
import PubSub from 'pubsub-js'

import './WithdrawVotingRightsContainer.css'

class WithdrawVotingRightsContainer extends Component {
  constructor (props) {
    super()

    this.state = {
      account: props.account,
      contract: props.contract,
      availableTokens: null,
      lockedTokens: null,
      tokenAmount: null
    }

    this.onWithdraw = this.onWithdraw.bind(this)
    this.onTokenAmountKeyUp = this.onTokenAmountKeyUp.bind(this)
  }

  componentWillMount () {
    if (this.state.contract === 'registry') {
      this.setState({
        contract: registry
      })
    } else if (this.state.contract === 'parameterizer') {
      this.setState({
        contract: parameterizer
      })
    }
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

      <div className='column five wide t-center WithdrawVotingRightsContainer'>
        <div className='UnlockedAdt'>
            Unlocked Voting ADT <Tooltip class='InfoIconHigh' info='These voting tokens are not used in polls and are eligible to be withdrawn from the registry and returned to your wallet.' />
          <br />
          <span className='VotingTokensAmount'>
            {availableTokens !== null ? commafy(availableTokens) + ' ADT' : '-'}
          </span>
        </div>
        <div className='ui input action mini'>
          <input
            type='text'
            placeholder='100'
            id='WithdrawVotingRightsContainerInput'
            onKeyUp={this.onTokenAmountKeyUp}
          />
          <button
            onClick={this.onWithdraw}
            className='ui button green tiny'>
              WITHDRAW
          </button>
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
      const availableTokens = await this.state.contract.getAvailableTokensToWithdraw()
      const lockedTokens = (await this.state.contract.getLockedTokens()).toNumber()
      if (this._isMounted) {
        this.setState({
          availableTokens,
          lockedTokens
        })
      }
    } catch (error) {
      console.error('Get Available Tokens to Withdraw Error: ', error)
      toastr.error('There was an error fetching the number of available tokens to withdraw. Please make sure you are signed in to MetaMask.')
    }
  }

  onTokenAmountKeyUp (event) {
    this.setState({
      tokenAmount: event.target.value | 0 // coerce to int
    })
  }

  onWithdraw (event) {
    event.preventDefault()

    this.withdrawTokens()
  }

  async withdrawTokens () {
    const {availableTokens, tokenAmount} = this.state
    const input = document.querySelector('#WithdrawVotingRightsContainerInput')
    if (commafy(availableTokens) === '0') {
      toastr.error('You do not have any available ADT to withdraw')
      return
    }
    if (tokenAmount <= 0) {
      toastr.error('Please enter a valid amount of ADT')
      return
    }
    if (tokenAmount > availableTokens) {
      toastr.error('You do not have enough ADT to withdraw')
      return
    }

    try {
      let transactionInfo = {
        src: 'withdraw_voting_ADT',
        title: 'Withdraw Voting ADT'
      }
      PubSub.publish('TransactionProgressModal.open', transactionInfo)
      await this.state.contract.withdrawVotingRights(tokenAmount)

      if (input) {
        input.value = ''
      }
      this.setState({
        tokenAmount: null
      })
    } catch (error) {
      console.error('Withdraw Tokens Error: ', error)
      PubSub.publish('TransactionProgressModal.error')
      input.value = ''
      this.setState({
        tokenAmount: null
      })
    }
  }
}

WithdrawVotingRightsContainer.propTypes = {
  account: PropTypes.string
}

export default WithdrawVotingRightsContainer
