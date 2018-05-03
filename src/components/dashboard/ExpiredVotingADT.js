import React, {Component} from 'react'
import Tooltip from '../Tooltip'
import registry from '../../services/registry'
import parameterizer from '../../services/parameterizer'
import { registryApiURL } from '../../models/urls'
import toastr from 'toastr'

class ExpiredVotingADT extends Component {
  constructor (props) {
    super()
    this.state = {
      totalExpiredTokens: 0,
      contract: props.contract,
      account: props.account,
      unrevealed: [],
      selectedPoll: null,
      fetching: false
    }

  }

  async componentWillReceiveProps() {
    if (this.state.contract === 'registry') {
      this.setState({
        contract: registry,
      })
    } else if (this.state.contract === 'parameterizer') {
      this.setState({
        contract: parameterizer
      })
    }
    if (this.state.account && this.state.contract) {
      await this.init()
    }
  }

  async init () {
    if (this.state.fetching) {
      return {}
    }
    if (!this.props.contract) {
      return {}
    }
    try {
      await this.getUnrevealed()
    } catch (error) {
      console.log(error)
    }
  }

  render () {
    return (

      <div className='column five wide t-center ExpiredVotingAdtContainer'>
        <div>
          <div>
          Expired Voting ADT <Tooltip class='InfoIconHigh' info={'Expired votes are tokens that were committed, but not revealed. Therefore, you need to unlock them in order to withdraw them. The number on the left is the number of transactions you\'ll need to sign in order to withdraw the ADT amount on the right.'} />
          </div>
          <div>
            <span className='VotingTokensAmount' style={{marginRight: '4px', color: '#CE4034'}}>{this.state.unrevealed.length}</span><span className='VotingTokensAmount'>{this.state.totalExpiredTokens} ADT</span>
          </div>
        </div>
        <button className='ui tiny button green' onClick={() => { this.rescueTokens(this.state.selectedPoll) }}>UNLOCK</button>
      </div>
    )
  }

  async getUnrevealed () {
    let unrevealed

    if (!this.state.account || this.state.account === '0x0'){
      return null
    }

    this.setState({
      fetching: true
    })
    if (this.state.contract === 'parameterizer') {
      unrevealed = await (await window.fetch(`${registryApiURL}/parameterization/rewards?status=unrevealed&account=${this.state.account}`)).json()
    } else if (this.state.contract === 'registry') {
      unrevealed = await (await window.fetch(`${registryApiURL}/account/rewards?status=unrevealed&account=${this.state.account}`)).json()
    }

    this.setState({
      fetching: false
    })

    let totalExpiredTokens = this.getSum(unrevealed)
    if (unrevealed) {
      this.setState({
        unrevealed,
        totalExpiredTokens,
        selectedPoll: unrevealed[0] ? unrevealed[0].challenge_id : null
      })
    }
  }

  getSum (domains) {
    try {
      if (domains && domains.length > 0) {
        let sum = 0
        domains.map(x => {
          sum += Number(x.num_tokens)
          return sum
        })
        return (sum / 1000000000).toFixed(0)
      }
      return 0
    } catch (error) {
      console.log(error)
      return 0
    }
  }

  async rescueTokens (challenge_id) {
    if (isNaN(this.state.totalExpiredTokens) || this.state.totalExpiredTokens <= 0) {
      toastr.error('There are no expired ADT to unlock')
      return
    }

    try {
      let res = await this.state.contract.rescueTokens(challenge_id)
      this.init()
      return res
    } catch (error) {
      console.log('error: ', error)
    }
  }
}

export default ExpiredVotingADT
