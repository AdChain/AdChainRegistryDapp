import React, { Component } from 'react'
import PropTypes from 'prop-types'
import toastr from 'toastr'
import commafy from 'commafy'
import Tooltip from '../Tooltip'
import registry from '../../services/registry'
import parameterizer from '../../services/parameterizer'
import store from '../../store'
import PubSub from 'pubsub-js'

import './RequestVotingRightsContainer.css'

class RequestVotingRightsContainer extends Component {
  constructor (props) {
    super()

    this.state = {
      account: props.account,
      contract: props.contract,
      availableVotes: null,
      requestVotes: null
    }

    this.onRequest = this.onRequest.bind(this)
    this.onVotesKeyUp = this.onVotesKeyUp.bind(this)
  }

  componentWillMount () {
    this.checkContract()
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
          Current Voting Rights <Tooltip class='InfoIconHigh' info='The amount of adToken you have pre-approved for voting. You will be able to withdraw your Voting ADT when all polls with your token end.' />
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
  
  checkContract(){
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
      toastr.error('Please enter a valid amount of ADT')
      return false
    }

    try {
      let transactionInfo = {
        src: 'conversion_to_voting_ADT',
        title: 'Conversion to Voting ADT'
      }
      PubSub.publish('TransactionProgressModal.open', transactionInfo)
      await this.state.contract.requestVotingRights(requestVotes)

      // TODO: better way to reset input
      const input = document.querySelector('#RequestVotingRightsContainerInput')

      if (input) {
        input.value = ''
      }
    } catch (error) {
      console.log('Error requesting voting rights: ', error)
      PubSub.publish('TransactionProgressModal.error')
    }
  }

  async getAvailableVotes () {
    const {account} = this.state

    if (!account) {
      return false
    }

    try {
      if (this.state.contract) {
        const availableVotes = (await this.state.contract.getTotalVotingRights()).toNumber()
        if (this._isMounted) {
          this.setState({
            availableVotes
          })
        }
      }
    } catch (error) {
      console.error('Get Available Votes Error: ', error)
      toastr.error('There was an error fetching your available votes. Please make sure you are signed in to MetaMask.')
    }
  }
}

RequestVotingRightsContainer.propTypes = {
  account: PropTypes.string
}

export default RequestVotingRightsContainer
