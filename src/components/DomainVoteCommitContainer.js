import React, { Component } from 'react'
import PropTypes from 'prop-types'
import toastr from 'toastr'
import moment from 'moment'
import bip39 from 'bip39'

import registry from '../services/registry'
import DomainVoteCommitInProgressContainer from './DomainVoteCommitInProgressContainer'

import './DomainVoteCommitContainer.css'

var mnemonic = bip39.generateMnemonic()
var three = mnemonic.split(' ').splice(0, 3)

console.log(three)

class DomainVoteCommitContainer extends Component {
  constructor (props) {
    super()

    this.state = {
      stake: 0,
      domain: props.domain,
      applicationExpiry: null,
      commitEndDate: null,
      revealEndDate: null,
      didChallenge: null,
      inProgress: false,
      salt: 123
    }

    this.getListing()
    this.getPoll()
    this.getChallenge()

    this.onVote = this.onVote.bind(this)
  }

  render () {
    const {
      commitEndDate,
      didChallenge,
      inProgress,
      salt
    } = this.state

    const stageEnd = commitEndDate ? moment.unix(commitEndDate).format('YYYY-MM-DD HH:mm:ss') : '-'

    return (
      <div className='DomainVoteCommitContainer'>
        <div className='ui grid stackable'>
          <div className='column sixteen wide'>
            <div className='ui large header center aligned'>
              VOTING – COMMIT
            </div>
          </div>
          {didChallenge ? <div className='column sixteen wide'>
            <div className='ui message info'>
              You've challenged this domain.
            </div>
          </div>
          : null}
          <div className='column sixteen wide'>
            <p>
The first phase of the voting process is the commit phase where the ADT holder stakes a hidden amount of ADT to SUPPORT or OPPOSE the domain application. The second phase is the reveal phase where the ADT holder reveals the staked amount of ADT to either the SUPPORT or OPPOSE side.
            </p>
          </div>
          <div className='column sixteen wide center aligned'>
            <div className='ui divider' />
            <p>
            Voting commit stage ends
            </p>
            <p><strong>{stageEnd}</strong></p>
            <div className='ui divider' />
          </div>
          <div className='column sixteen wide center aligned'>
            <form className='ui form center aligned'>
              <div className='ui field'>
                Salt: {salt}
              </div>
              <div className='ui field'>
                <label>Enter ADT to Commit</label>
                <div className='ui input small'>
                  <input
                    type='text'
                    placeholder='100'
                    onKeyUp={event => this.setState({stake: event.target.value | 0})}
                  />
                </div>
              </div>
              <div className='ui field'>
                <button
                  onClick={this.onVote}
                  data-option='support'
                  className='ui button blue'>
                  SUPPORT
                </button>
                <button
                  onClick={this.onVote}
                  data-option='oppose'
                  className='ui button purple'>
                  OPPOSE
                </button>
              </div>
            </form>
          </div>
        </div>
        {inProgress ? <DomainVoteCommitInProgressContainer /> : null}
      </div>
    )
  }

  async getListing () {
    const {domain} = this.state
    const listing = await registry.getListing(domain)

    const {
      applicationExpiry
    } = listing

    this.setState({
      applicationExpiry
    })
  }

  async getPoll () {
    const {domain} = this.state

    try {
      const {
        commitEndDate,
        revealEndDate
      } = await registry.getChallengePoll(domain)

      this.setState({
        commitEndDate,
        revealEndDate
      })
    } catch (error) {
      toastr.error(error)
    }
  }

  async getChallenge () {
    const {domain} = this.state

    try {
      const didChallenge = await registry.didChallenge(domain)

      this.setState({
        didChallenge
      })
    } catch (error) {
      toastr.error(error)
    }
  }

  async onVote (event) {
    event.preventDefault()

    this.setState({
      inProgress: true
    })

    const {target} = event
    const option = target.dataset.option
    const {domain, stake: votes, salt} = this.state
    const voteOption = (option === 'support' ? 1 : 0)

    try {
      await registry.commitVote({domain, votes, voteOption, salt})
      toastr.success('Success')
      this.setState({
        inProgress: false
      })
    } catch (error) {
      toastr.error(error.message)
      this.setState({
        inProgress: false
      })
    }
  }
}

DomainVoteCommitContainer.propTypes = {
  domain: PropTypes.string
}

export default DomainVoteCommitContainer