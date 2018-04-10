import React, {Component} from 'react'
import Tooltip from './Tooltip'
import registry from '../services/registry'
// import toastr from 'toastr'
import _ from 'lodash'

class ExpiredVotingADT extends Component {
  constructor () {
    super()
    this.state = {
      totalExpiredTokens: 0,
      expiredDomainData: [],
      selectedPoll: null
    }
  }

  async componentDidMount () {
    await this.init()
  }

  async init () {
    try {
      let {
        expiredDomainData,
        totalExpiredTokens,
        selectedPoll
      } = await this.getExpiredDomainData()

      this.setState({
        expiredDomainData,
        totalExpiredTokens,
        selectedPoll
      })
    } catch (error) {
      console.log(error)
    }
  }

  render () {
    return (

      <div className='column five wide t-center'>
        <div>
          Expired Voting ADT <Tooltip class='InfoIconHigh' info={'Expired votes are tokens that were committed, but not revealed. Therefore, you need to unlock them in order to withdraw them. The number on the left is the number of transactions you\'ll need to sign in order to withdraw the ADT amount on the right.'} />
        </div>
        <span className='VotingTokensAmount' style={{marginRight: '4px', color: '#CE4034'}}>{this.state.expiredDomainData.length}</span><span className='VotingTokensAmount'>{this.state.totalExpiredTokens} ADT</span>
        <br />
        <button className='ui tiny button green' onClick={() => { this.rescueTokens(this.state.selectedPoll) }}>UNLOCK</button>
      </div>
    )
  }

  async getExpiredDomainData () {
    let committed = await this.getCommitted()
    let revealed = await this.getRevealed()
    // Determine which have not been revealed.
    committed.map((com, i) => {
      return revealed.map((rev, j) => {
        if (rev.domain === com.domain) {
          committed.splice(i, 1)
          revealed.splice(i, 1)
        }
        return true
      })
    })

    let expiredDomainData = await this.filterByStage(committed)
    let totalExpiredTokens = this.getSum(expiredDomainData)

    return {
      totalExpiredTokens,
      expiredDomainData,
      selectedPoll: expiredDomainData[0] ? expiredDomainData[0].pollID : null
    }
  }

  async getCommitted () {
    let committed = await (await window.fetch(`https://adchain-registry-api-staging.metax.io/registry/domains?account=${this.props.account}&include=committed`)).json()
    return committed
  }

  async getRevealed () {
    let revealed = await (await window.fetch(`https://adchain-registry-api-staging.metax.io/registry/domains?account=${this.props.account}&include=revealed`)).json()
    return revealed
  }

  async filterByStage (possibleUnrevealed) {
    // Map over unrevealed to determine the stage
    // Returns domains in expired state

    const expiredDomains = await Promise.all(possibleUnrevealed.map(async x => {
      try {
        // const listing = await registry.getListing(x.domain)
        const inCommit = await registry.commitStageActive(x.domain)
        const inReveal = await registry.revealStageActive(x.domain)
        const didReveal = await registry.didRevealForPoll(x.pollID)

        if (inCommit || inReveal || didReveal) return null

        // const listing = await registry.getListing(x.domain)
        // if (listing.challengeId === 0) return null
        return { domain: x.domain, pollID: x.pollID }

      } catch (error) {
        console.log(error)
      }
    }))
    return _.without(expiredDomains, null)
  }

  getSum (domains) {
    if (domains.length > 0) {
      let sum = 0
      domains.map(x => {
        sum += Number(x.currentDeposit)
        return sum
      })
      return (sum / 1000000000).toFixed(0)
    }
    return 0
  }

  async rescueTokens (pollId) {
    try {
      let res = await registry.rescueTokens(pollId)
      this.init()
      return res
    } catch (error) {
      console.log('error: ', error)
    }
  }
}

export default ExpiredVotingADT
