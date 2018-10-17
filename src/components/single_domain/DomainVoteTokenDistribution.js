import React, { Component } from 'react'
import PropTypes from 'prop-types'
import commafy from 'commafy'
import toastr from 'toastr'

import registry from '../../services/registry'
import StatProgressBar from '../StatProgressBar'
import PubSub from 'pubsub-js'

import './DomainVoteTokenDistribution.css'

class DomainVoteTokenDistribution extends Component {
  constructor (props) {
    super()

    this.state = {
      domain: props.domain,
      votesFor: 0,
      votesAgainst: 0
    }
    this.getPoll = this.getPoll.bind(this)
  }

  componentDidMount () {
    this._isMounted = true
    this.subEvent = PubSub.subscribe('DomainVoteTokenDistribution.getPoll', this.getPoll)
    if (this.props.domainData) {
      this.getPoll()
    }
  }

  componentWillUnmount () {
    this._isMounted = false
    PubSub.unsubscribe(this.subEvent)
  }

  async getPoll () {
    let listingHash

    if (this.props.domainData) {
      listingHash = this.props.domainData.listingHash
    }

    try {
      const {
        votesFor,
        votesAgainst
      } = await registry.getChallengePoll(listingHash)

      if (this._isMounted) {
        this.setState({
          votesFor,
          votesAgainst,
          listingHash
        })
      }
    } catch (error) {
      console.log(error)
      toastr.error('There was an error getting poll ')
    }
  }

  render () {
    const {
      votesFor,
      votesAgainst
    } = this.state

    // "N | 0" coerces to int or to 0 if NaN
    const totalVotes = ((votesFor + votesAgainst) | 0)
    const supportFill = Math.round((votesFor / totalVotes) * 100) | 0
    const opposeFill = Math.round((votesAgainst / totalVotes) * 100) | 0

    return (
      <div className='column sixteen wide center aligned DomainVoteTokenDistribution'>
        <div className='ProgressContainer'>
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
              <div className='BreakdownItemBox' />
              <span className='BreakdownItemLabel'>= {commafy(votesFor)} Votes</span>
            </div>
            <div className='BreakdownItem'>
              <div className='BreakdownItemBox' />
              <span className='BreakdownItemLabel'>= {commafy(votesAgainst)} Votes</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

DomainVoteTokenDistribution.propTypes = {
  domain: PropTypes.string
}

export default DomainVoteTokenDistribution
