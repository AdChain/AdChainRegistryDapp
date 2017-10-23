import React, { Component } from 'react'
import PropTypes from 'prop-types'
import toastr from 'toastr'
import commafy from 'commafy'
import { Popup } from 'semantic-ui-react'

import store from '../store'
import registry from '../services/registry'

import RequestTokenApprovalInProgressContainer from './RequestTokenApprovalInProgressContainer'
import './RequestTokenApprovalContainer.css'

class RequestTokenApprovalContainer extends Component {
  constructor (props) {
    super()

    this.state = {
      account: props.account,
      tokenAmount: null,
      allowedTokens: null,
      inProgress: false
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
      inProgress,
      allowedTokens
    } = this.state

    return (
      <div className='RequestTokenApprovalContainer BoxFrame'>
        <div className='ui grid stackable center aligned'>
          <div className='column sixteen wide'>
            <p>Request Token Approval
              <Popup
                trigger={<i className='icon info circle' />}
                content='Pre-authorizing adToken will minimizes the number of calls to smart contracts when applying, which can save gas fees if applying frequently. This does not Withdraw adToken from you account, until time of application.'
              />
            </p>
            <div><small>Current approved ADT: <strong>{allowedTokens !== null ? commafy(allowedTokens) : '-'}</strong></small></div>
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
                Request Token Approval
              </button>
            </div>
          </div>
        </div>
        {inProgress ? <RequestTokenApprovalInProgressContainer /> : null}
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

    if (!tokenAmount) {
      toastr.error('Please enter amount of adToken')
      return false
    }

    if (this._isMounted) {
      this.setState({
        inProgress: true
      })
    }

    try {
      await registry.approveTokens(tokenAmount)

      // TODO: better way to reset input
      const input = document.querySelector('#RequestTokenApprovalContainerInput')

      if (input) {
        input.value = ''
      }

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

RequestTokenApprovalContainer.propTypes = {
  account: PropTypes.string
}

export default RequestTokenApprovalContainer
