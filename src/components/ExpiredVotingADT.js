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
      selectedPoll: expiredDomainData[0] ? expiredDomainData[0].challengeId : null
    }
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
    // Returns domains in expired state

    const expiredDomains = await Promise.all(unrevealed.map(async x => {
      try {
        const listing = await registry.getListing(x.domain)
        const inCommit = await registry.commitStageActive(x.domain)
        const inReveal = await registry.revealStageActive(x.domain)
        if (inCommit || inReveal || listing.challengeId === 0) return null
        return listing
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

// import React, {Component} from 'react'
// import Tooltip from './Tooltip'
// import registry from '../services/registry'
// // import toastr from 'toastr'

// class ExpiredVotingADT extends Component {
//   constructor () {
//     super()
//     this.state = {
//       totalExpiredTokens: 0,
//       unrevealedDomainData: [],
//       selectedPoll: null
//     }
//   }

//   async componentDidMount () {
//     await this.init()
//   }

//   async init () {
//     let unrevealedDomainData = await (await window.fetch(`http://adchain-registry-api-staging.metax.io/account/rewards?status=unrevealed&account=${this.props.account}`)).json()
//       console.log(unrevealedDomainData)
//     this.setState({
//       unrevealedDomainData,
//       totalExpiredTokens: this.getSum(unrevealedDomainData),
//       selectedPoll: unrevealedDomainData[0] ? unrevealedDomainData[0].challenge_id : null
//     })
//   }

//   render () {
//     return (

//       <div className='column five wide t-center'>
//         <div>
//           Expired Voting ADT <Tooltip class='InfoIconHigh' info={'Expired votes are tokens that were committed, but not revealed. Therefore, you need to unlock them in order to withdraw them. The number on the left is the number of transactions you\'ll need to sign in order to withdraw the ADT amount on the right.'} />
//         </div>
//         <span className='VotingTokensAmount' style={{marginRight: '4px'}}>{this.state.unrevealedDomainData.length}</span><span className='VotingTokensAmount'>{this.state.totalExpiredTokens} ADT</span>
//         <br />
//         <button className='ui tiny button green' onClick={() => { this.rescueTokens(this.state.selectedPoll) }}>UNLOCK</button>
//       </div>
//     )
//   }

//   getSum (domains) {
//     let sum = 0
//     domains.map(x => {
//       sum += Number(x.num_tokens)
//       return sum
//     })
//     return (sum / 1000000000).toFixed(0)
//   }

//   async rescueTokens (pollId) {
//     console.log('rescueTokens: ', pollId)
//     try {
//       let res = await registry.rescueTokens(pollId)
//       this.init()
//       return res
//     } catch (error) {
//       console.log('error: ', error)
//     }
//   }

//   // async filterByStage (unrevealed) {
//   //   // Map over unrevealed to determine the stage
//   //   // Returns domains in expired state
//   //   const expiredDomains = await Promise.all(unrevealed.map(async (x) => {
//   //     try {
//   //       const listing = await registry.getListing(x.domain)
//   //       const inCommit = await registry.commitStageActive(x.domain)
//   //       const inReveal = await registry.revealStageActive(x.domain)
//   //       if (inCommit || inReveal) return
//   //       return listing
//   //     } catch (error) {
//   //       console.log(error)
//   //     }
//   //   }))
//   //   return expiredDomains
//   // }
// }

// export default ExpiredVotingADT
