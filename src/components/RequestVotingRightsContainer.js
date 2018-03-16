import React, { Component } from 'react'
import PropTypes from 'prop-types'
import toastr from 'toastr'
import commafy from 'commafy'
import Tooltip from './Tooltip'
import registry from '../services/registry'
import store from '../store'

import './RequestVotingRightsContainer.css'

class RequestVotingRightsContainer extends Component {
  constructor (props) {
    super()

    this.state = {
      account: props.account,
      availableVotes: null,
      requestVotes: null
    }

    this.onRequest = this.onRequest.bind(this)
    this.onVotesKeyUp = this.onVotesKeyUp.bind(this)
  }

  componentDidMount () {
    this._isMounted = true

    this.getAvailableVotes()

    store.subscribe(x => {
      this.getAvailableVotes()
    })
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  render () {
    const {
      availableVotes
    } = this.state

    return (

      <div className='column five wide VotingRights t-center'>
        <div className='VotingRightsText'>
          Total Current Voting Rights <Tooltip class='InfoIconHigh' info='Pre-requesting voting rights will minimizes the number of transactions when performing commit votes. This can save gas fees if voting frequently. 1 ADT = 1 Vote. Pre-requesting voting rights will withdraw AdToken from your account to the adChain registry PLCR contract. You may convert the votes to adToken and withdraw at any time.' />
          <br />
          <span className='VotingTokensAmount'>
            {availableVotes !== null ? commafy(availableVotes) + ' ADT' : '-'}
          </span>
        </div>
        <div className='ui input action mini'>
          <input
            type='text'
            placeholder='100'
            style={{maxWidth: '90px'}}
            id='RequestVotingRightsContainerInput'
            onKeyUp={this.onVotesKeyUp}
              />
          <button
            onClick={this.onRequest}
            className='ui button blue tiny'>
                APPROVE
              </button>
        </div>
      </div>
    )
  }

  onVotesKeyUp (event) {
    this.setState({
      requestVotes: event.target.value | 0 // coerce to int
    })
  }

  onRequest (event) {
    event.preventDefault()

    this.requestRights()
  }

  async requestRights () {
    const {requestVotes} = this.state

    if (!requestVotes) {
      toastr.error('Please enter amount of adToken')
      return false
    }

    try {
      await registry.requestVotingRights(requestVotes)

      // TODO: better way to reset input
      const input = document.querySelector('#RequestVotingRightsContainerInput')

      if (input) {
        input.value = ''
      }

      toastr.success('Success')
    } catch (error) {
      toastr.error('There was an error with your request')
    }
  }

  async getAvailableVotes () {
    const {account} = this.state

    if (!account) {
      return false
    }

    try {
      const availableVotes = (await registry.getTotalVotingRights()).toNumber()
      if (this._isMounted) {
        this.setState({
          availableVotes
        })
      }
    } catch (error) {
      toastr.error('There was an error with your request')
    }
  }
}

RequestVotingRightsContainer.propTypes = {
  account: PropTypes.string
}

export default RequestVotingRightsContainer
