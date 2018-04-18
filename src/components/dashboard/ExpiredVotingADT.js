import React, {Component} from 'react'
import Tooltip from '../Tooltip'
import registry from '../../services/registry'
import parameterizer from '../../services/parameterizer'
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

  componentWillMount(){
    if(this.state.contract === 'registry'){
      this.setState({
        contract: registry,
      })
    }else if(this.state.contract === 'parameterizer'){
      this.setState({
        contract: parameterizer
      })
    }
  }

  async componentWillReceiveProps(){
    if(this.state.account){
      await this.init()
    }
  }

  async init () {
    if(this.state.fetching) {
      return {}
    }
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
    let unrevealed    

    this.setState({
      fetching: true
    })   
    if(this.state.contract === 'parameterizer'){
      unrevealed = await (await window.fetch(`https://adchain-registry-api-staging.metax.io/parameterization/rewards?status=unrevealed&account=${this.state.account}`)).json()
  
    }else{
      unrevealed = await (await window.fetch(`https://adchain-registry-api-staging.metax.io/account/rewards?status=unrevealed&account=${this.state.account}`)).json()
    }
    this.setState({
      fetching: false
    })   

    let totalExpiredTokens = this.getSum(unrevealed)
    return {
      totalExpiredTokens,
      unrevealed,
      selectedPoll: unrevealed[0] ? unrevealed[0].challenge_id : null
    }
  }

  getSum (domains) {
    try {
      if (domains.length > 0) {
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
