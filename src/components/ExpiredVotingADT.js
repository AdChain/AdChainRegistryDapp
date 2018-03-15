import React, {Component} from 'react'
import Tooltip from './Tooltip'
import registry from '../services/registry'
// import toastr from 'toastr'

class ExpiredVotingADT extends Component {
  constructor () {
    super()
    this.state = {
      expiredTokens: 0
    }
  }

  async componentDidMount () {
    this.setState({
      expiredTokens: await this.getExpiredTokens()
    })
  }

  render () {
    return (

      <div className='column five wide t-center'>
        <div>
          Expired Voting ADT <Tooltip class='InfoIconHigh' info={'These tokens are expired'} />
        </div>
        <span className='VotingTokensAmount'>{this.state.expiredTokens} ADT</span>
        <br />
        <button className='ui tiny button green' onClick={() => { this.rescueTokens() }}>UNLOCK</button>
      </div>
    )
  }

  async getExpiredTokens () {
    let committed = await this.getCommitted()
    const revealed = await this.getRevealed()

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

    let revealEndedDomains = await this.filterByStage(committed)
    let expiredTokens = this.getSum(revealEndedDomains)
    return expiredTokens
  }

  async getCommitted () {
    let committed = await (await window.fetch(`http://adchain-registry-api-staging.metax.io/registry/domains?account=${this.props.account}&include=committed`)).json()
    return committed
  }

  async getRevealed () {
    let revealed = await (await window.fetch(`http://adchain-registry-api-staging.metax.io/registry/domains?account=${this.props.account}&include=revealed`)).json()
    return revealed
  }

  async filterByStage (unrevealed) {
    // Map over unrevealed to determine the stage
    let domainData = await Promise.all(unrevealed.map(async (x) => {
      try {
        let listing = await registry.getListing(x.domain)
        let inCommit = await registry.commitStageActive(x.domain)
        let inReveal = await registry.revealStageActive(x.domain)
        if (inCommit || inReveal) return
        return listing
      } catch (error) {
        console.log(error)
      }
    }))
    return domainData
  }

  getSum (domains) {
    let sum = 0
    domains.map(x => {
      sum += Number(x.currentDeposit)
      return sum
    })
    return (sum / 1000000000).toFixed(0)
  }

  async rescueTokens () {
    console.log('hit')
  }
}

export default ExpiredVotingADT
