import React, { Component } from 'react'
import commafy from 'commafy'
import toastr from 'toastr'
import moment from 'moment'

import registry from '../services/registry'

import './DomainVoteCommitContainer.css'

class DomainVoteCommitContainer extends Component {
  constructor (props) {
    super()

    this.state = {
      stake: 0,
      domain: props.domain,
      applicationExpiry: null
    }

    this.getListing()

    this.onVote = this.onVote.bind(this)
  }

  render () {
    const {
      applicationExpiry
    } = this.state

    const stageEnd = applicationExpiry ? moment.unix(applicationExpiry).format('YYYY-MM-DD HH:mm:ss') : '-'

    return (
      <div className='DomainVoteCommitContainer'>
        <div className='ui grid stackable'>
          <div className='column sixteen wide'>
            <div className='ui large header center aligned'>
              VOTING – COMMIT
            </div>
          </div>
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
                <label>Enter ADT to Commit</label>
                <div className='ui input small'>
                  <input
                    type='text'
                    placeholder='100'
                    onKeyUp={event => this.setState({stake: event.target.value|0})}
                  />
                </div>
              </div>
              <div className='ui field'>
                <button
                  onClick={this.onVote}
                  data-option="support"
                  className='ui button blue'>
                  SUPPORT
                </button>
                <button
                  onClick={this.onVote}
                  data-option="oppose"
                  className='ui button purple'>
                  OPPOSE
                </button>
              </div>
            </form>
          </div>
        </div>
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

  async onVote (event) {
    event.preventDefault()

    const {target} = event
    const option = target.dataset.option
    const {domain, stake:votes} = this.state
    const salt = 123
    const voteOption = (option === 'support' ? 1 : 0)
    debugger

    try {
      const result = await registry.commitVote({domain, votes, voteOption, salt})
      toastr.success('Success')
    } catch (error) {
      toastr.error(error.message)
    }
  }
}

export default DomainVoteCommitContainer
