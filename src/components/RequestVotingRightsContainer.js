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

      <div className='column six wide VotingRights t-center'>
        <div className='VotingRightsText'>
          Current Voting Rights <Tooltip class='InfoIconHigh' info='The amount of adToken you have pre-approved for voting.' />
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
      console.log('Error rewuesting voting rights: ', error)
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
