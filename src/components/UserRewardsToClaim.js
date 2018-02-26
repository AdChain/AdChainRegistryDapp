import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'
import registry from '../services/registry'
import UserRewardClaimInProgress from './UserRewardClaimInProgress'
import toastr from 'toastr'

import './UserRewardsToClaim.css'

class UserRewardsToClaim extends Component {
  constructor (props) {
    super()

    this.state = {
      rewards: props.rewards,
      claimProgress: null
    }

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
    const { rewards, claimProgress } = this.state
    const data = rewards ? rewards.map((domain, idx) => <tr key={idx} className='DashboardRow'><td className='DashboardFirstCell'>{domain.domain}</td><td id={domain.domain} className='RewardValueCell'>{domain.reward ? domain.reward : ' - '}</td><td><Button basic id={domain.domain + 'Button'} className='RewardClaimButton' onClick={() => this.claimReward(domain.challenge_id, domain.salt, domain.domain)}>Claim</Button></td></tr>) : null

    return (
      <div className='BoxFrame DashboardColumn'>
        <span className='BoxFrameLabel ui grid'>CLAIM REWARDS</span>
        <div className='ui grid'>
          <div className='column sixteen wide'>
            <table className='DashboardTable'>
              <tbody>
                <tr>
                  <th className='DashboardTitle'>Domain</th>
                  <th className='ValueTitle'>Value (ADT)</th>
                  <th className='DashboardTitle'>Action</th>
                </tr>
                {data}
              </tbody>
            </table>
          </div>
        </div>
        {claimProgress ? <UserRewardClaimInProgress /> : null}
      </div>
    )
  }

  async claimReward (challengeId, salt, domain) {
    if (this._isMounted) {
      this.setState({
        claimProgress: true
      })
    }

    try {
      await registry.claimReward(challengeId, salt)

      document.getElementById(domain).innerText = ' - '
      document.getElementById(domain + 'Button').innerText = 'Claimed'
      document.getElementById(domain + 'Button').className += ' disabled'

      if (this._isMounted) {
        this.setState({
          claimProgress: false
        })
      }
    } catch (error) {
      console.error(error)
      toastr.error('There was an error claiming your reward')
      this.setState({
        claimProgress: false
      })
    }
  }
}

export default UserRewardsToClaim
