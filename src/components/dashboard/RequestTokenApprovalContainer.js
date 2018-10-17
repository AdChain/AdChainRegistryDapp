import React, { Component } from 'react'
import PropTypes from 'prop-types'
import toastr from 'toastr'
import commafy from 'commafy'
import Tooltip from '../Tooltip'
import PubSub from 'pubsub-js'

import store from '../../store'
import registry from '../../services/registry'

import './RequestTokenApprovalContainer.css'

class RequestTokenApprovalContainer extends Component {
  constructor (props) {
    super()

    this.state = {
      account: props.account,
      tokenAmount: null,
      allowedTokens: null
    }

    this.onRequest = this.onRequest.bind(this)
    this.onTokenAmountKeyUp = this.onTokenAmountKeyUp.bind(this)
  }

  componentDidMount () {
    this._isMounted = true

    this.getTokenAllowance()

    store.subscribe(x => {
      this.getTokenAllowance()
    })
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  render () {
    const {
      allowedTokens
    } = this.state

    return (
      <div className='RequestTokenApprovalContainer BoxFrame'>
        <div className='ui grid stackable center aligned'>
          <div className='column sixteen wide'>
            <span className='ui grid BoxFrameLabel'>PRE-APPROVE ADT TRANSFER <Tooltip info={'Pre-approve adToken transfer to the adChain Registry will minimize the number of transactions when applying. This can can save gas fees if applying frequently. Pre-approving does not withdraw adToken from your adToken account, only until time of application.'} /></span>
          </div>
          <div className='column sixteen wide ApprovedAdt t-center' style={{paddingTop: '5px'}}>
            <div>Current Approved ADT <Tooltip class='InfoIconHigh' info={'Pre-approve adToken transfer to the adChain Registry will minimize the number of transactions when applying. This can can save gas fees if applying frequently. Pre-approving does not withdraw adToken from your adToken account, only until time of application.'} /></div>
            <span className='VotingTokensAmount'>
              {allowedTokens !== null ? commafy(allowedTokens) + ' ADT' : '-'}
            </span>
            <br />
            <div className='ui input action mini'>
              <input
                type='text'
                placeholder='100'
                id='RequestTokenApprovalContainerInput'
                onKeyUp={this.onTokenAmountKeyUp}
              />
              <button
                onClick={this.onRequest}
                className='ui button blue tiny'>
                  APPROVE
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  onTokenAmountKeyUp (event) {
    this.setState({
      tokenAmount: event.target.value | 0 // coerce to int
    })
  }

  onRequest (event) {
    event.preventDefault()

    this.requestTokenApproval()
  }

  async getTokenAllowance () {
    const {account} = this.state

    if (!account) {
      return false
    }

    try {
      const allowedTokens = await registry.getTokenAllowance()

      if (this._isMounted) {
        this.setState({
          allowedTokens: allowedTokens.toNumber()
        })
      }
    } catch (error) {

    }
  }

  async requestTokenApproval () {
    const {tokenAmount} = this.state

    if (tokenAmount < 0) {
      toastr.error('Please enter a valid amount of ADT')
      return false
    }
    let transactionInfo = {
      src: 'ADT_approval',
      title: 'ADT Approval'
    }
    
    try {
      PubSub.publish('TransactionProgressModal.open', transactionInfo)
      await registry.approveTokens(tokenAmount)
      PubSub.publish('TransactionProgressModal.next', transactionInfo)

      // TODO: better way to reset input
      const input = document.querySelector('#RequestTokenApprovalContainerInput')

      if (input) {
        input.value = ''
      }
    } catch (error) {
      console.error('Request Token Approval Error: ', error)
      PubSub.publish('TransactionProgressModal.error')
    }
  }
}

RequestTokenApprovalContainer.propTypes = {
  account: PropTypes.string
}

export default RequestTokenApprovalContainer
