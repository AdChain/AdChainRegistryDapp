import React, { Component } from 'react'
import PropTypes from 'prop-types'
import commafy from 'commafy'
import toastr from 'toastr'
import moment from 'moment'

import registry from '../services/registry'
import DomainVoteRevealInProgressContainer from './DomainVoteRevealInProgressContainer'
import StatProgressBar from './StatProgressBar'

import './DomainVoteRevealContainer.css'

class DomainVoteRevealContainer extends Component {
  constructor (props) {
    super()

    this.state = {
      domain: props.domain,
      applicationExpiry: null,
      votesFor: 0,
      votesAgainst: 0,
      commitEndDate: null,
      revealEndDate: null,
      inProgress: false,
      didChallenge: false,
      salt: 123,
      voteOption: 1
    }

    this.getListing()
    this.getPoll()
    this.getChallenge()
  }

  render () {
    const {
      votesFor,
      votesAgainst,
      revealEndDate,
      inProgress,
      didChallenge,
      salt,
      voteOption
    } = this.state

    const stageEnd = revealEndDate ? moment.unix(revealEndDate).format('YYYY-MM-DD HH:mm:ss') : '-'

    // "N | 0" coerces to int
    const totalVotes = ((votesFor + votesAgainst) | 0)
    const supportFill = ((totalVotes / votesFor * 1e2) | 0)
    const opposeFill = ((totalVotes / votesAgainst * 1e2) | 0)

    return (
      <div className='DomainVoteRevealContainer'>
        <div className='ui grid stackable'>
          <div className='column sixteen wide'>
            <div className='ui large header center aligned'>
              VOTING – REVEAL
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
          <div className='column sixteen wide center aligned ProgressContainer'>
            <div className='ui divider' />
            <p>
              ADT holders have revealed their vote to show:
            </p>
            <div className='BarContainer'>
              <StatProgressBar
                fills={[supportFill, opposeFill]}
                showFillLabels
                showLegend
                fillLabels={['SUPPORT', 'OPPOSE']}
              />
            </div>
            <div className='Breakdown'>
              <div className='BreakdownItem'>
                <div className='BreakdownItemBox'></div>
                <span className='BreakdownItemLabel'>{commafy(votesFor)} ADT</span>
              </div>
              <div className='BreakdownItem'>
                <div className='BreakdownItemBox'></div>
                <span className='BreakdownItemLabel'>{commafy(votesAgainst)} ADT</span>
              </div>
            </div>
          </div>
          <div className='column sixteen wide center aligned'>
            <div className='ui divider' />
            <p>
          Total ADT already committed by the general ADT community:
            </p>
            <p>
              <strong>{commafy(totalVotes)} ADT</strong>
            </p>
            <div className='ui divider' />
            <p>
          Reveal stage ends
            </p>
            <p><strong>{stageEnd}</strong></p>
            <div className='ui divider' />
          </div>
          <div className='column sixteen wide center aligned'>
            Salt: {salt}
            Vote Option: {voteOption ? 'support' : 'oppose'}
          </div>
          <div className='column sixteen wide center aligned'>
            <button
              onClick={this.onReveal.bind(this)}
              className='ui button blue'>
              REVEAL
            </button>
          </div>
        </div>
        {inProgress ? <DomainVoteRevealInProgressContainer /> : null}
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
    const {
      votesFor,
      votesAgainst,
      commitEndDate,
      revealEndDate
    } = await registry.getChallengePoll(domain)

    this.setState({
      votesFor,
      votesAgainst,
      commitEndDate,
      revealEndDate
    })
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

  async onReveal (event) {
    event.preventDefault()

    const {domain, salt, voteOption} = this.state

    this.setState({
      inProgress: true
    })

    try {
      await registry.revealVote({domain, voteOption, salt})
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

DomainVoteRevealContainer.propTypes = {
  domain: PropTypes.string
}

export default DomainVoteRevealContainer