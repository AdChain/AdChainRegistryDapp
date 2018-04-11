import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'
import registry from '../../services/registry'
import toastr from 'toastr'
import Tooltip from '../Tooltip'
import PubSub from 'pubsub-js'

import './UserRewardsToClaim.css'

class UserRewardsToClaim extends Component {
  constructor (props) {
    super()

    this.state = {
      rewards: props.rewards
    }
    this.history = props.history
    this.claimReward = this.claimReward.bind(this)
  }

  componentDidMount () {
    this._isMounted = true
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.rewards !== this.props.rewards) {
      this.setState({
        rewards: nextProps.rewards
      })
    }
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  render () {
    const { rewards } = this.state
    const data = rewards.length !== 0 ? rewards.map((domain, idx) =>
      <tr key={idx} className='DashboardRow'>
        <td className='DashboardFirstCell' onClick={(event) => { event.preventDefault(); this.history.push(`/domains/${domain.domain}`) }}>{domain.domain}</td>
        <td id={domain.domain} className='RewardValueCell'>{domain.reward ? domain.reward + ' ADT' : ' - '}</td>
        <td><Button basic id={domain.domain + 'Button'} className='RewardClaimButton' onClick={() => this.claimReward(domain.challenge_id, domain.salt, domain.domain)}>Claim</Button></td>
      </tr>) : null

    return (
      <div className='BoxFrame DashboardColumn'>
        <span className='BoxFrameLabel ui grid'>CLAIM VOTING REWARDS<Tooltip info={'You are eligible to claim voting rewards for the domains listed below if you voted on the winning side.'} /></span>
        <div className='ui grid'>
          <div className='column sixteen wide'>
            {data
              ? <table className='DashboardTable'>
                <tbody>
                  <tr>
                    <th className='DashboardTitle'>Domain</th>
                    <th className='DashboardTitle'>Value</th>
                    <th className='DashboardTitle'>Action</th>
                  </tr>
                  {data}
                </tbody>
              </table>
              : <div className='NoDataMessage'>Domains listed here have an associated voting reward that you are eligible to claim if you voted on the winning side.</div>
            }
          </div>
        </div>
      </div>
    )
  }

  async claimReward (challengeId, salt, domain) {
    PubSub.publish('TransactionProgressModal.open', 'claim_reward')

    try {
      await registry.claimReward(challengeId, salt)

      document.getElementById(domain).innerText = ' - '
      document.getElementById(domain + 'Button').innerText = 'Claimed'
      document.getElementById(domain + 'Button').className += ' disabled'
    } catch (error) {
      console.error(error)
      toastr.error('There was an error claiming your reward')
    }
  }
}

export default UserRewardsToClaim
