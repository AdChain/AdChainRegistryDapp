import React, {Component} from 'react'
import Tooltip from '../Tooltip'
import registry from '../../services/registry'
import toastr from 'toastr'
import PubSub from 'pubsub-js'

class ExpiredVotingADT extends Component {
  constructor () {
    super()
    this.state = {
      totalExpiredTokens: 0,
      unrevealed: [],
      selectedPoll: null
    }
  }

  async componentDidMount () {
    await this.init()
  }

  async init () {
    try {
      let {
        unrevealed,
        totalExpiredTokens,
        selectedPoll
      } = await this.getUnrevealed()

      this.setState({
        unrevealed,
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
        <span className='VotingTokensAmount' style={{marginRight: '4px', color: '#CE4034'}}>{this.state.unrevealed.length}</span><span className='VotingTokensAmount'>{this.state.totalExpiredTokens} ADT</span>
        <br />
        <button className='ui tiny button green' onClick={() => { this.rescueTokens(this.state.selectedPoll) }}>UNLOCK</button>
      </div>
    )
  }

  async getUnrevealed () {
    let unrevealed = await (await window.fetch(`https://adchain-registry-api-staging.metax.io/account/rewards?status=unrevealed&account=${this.props.account}`)).json()
    // Determine which have not been revealed.
    let totalExpiredTokens = this.getSum(unrevealed)

    return {
      totalExpiredTokens,
      unrevealed,
      selectedPoll: unrevealed[0] ? unrevealed[0].challenge_id : null
    }
  }

  getSum (domains) {
    try{
      if (domains.length > 0) {
        let sum = 0
        domains.map(x => {
          sum += Number(x.num_tokens)
          return sum
        })
        return (sum / 1000000000).toFixed(0)
      }
      return 0
    }catch(error){
      console.log(error)
      return 0
    }
  }

  async rescueTokens (challenge_id) {

    if (isNaN(this.state.totalExpiredTokens) || this.state.totalExpiredTokens <= 0) {
      toastr.error('There are no expired ADT to unlock')
      return
    }

    let transactionInfo = {
      src: 'unlock_expired_ADT',
      title: 'Unlock Expired ADT'
    }
    try {
      PubSub.publish('TransactionProgressModal.open', transactionInfo)
      let res = await registry.rescueTokens(challenge_id)
      this.init()
      return res
    } catch (error) {
      console.log('error: ', error)
      PubSub.publish('TransactionProgressModal.error')
    }
  }
}

export default ExpiredVotingADT
