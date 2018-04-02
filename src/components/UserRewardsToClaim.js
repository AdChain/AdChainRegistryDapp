import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'
import registry from '../services/registry'
import UserRewardClaimInProgress from './UserRewardClaimInProgress'
import toastr from 'toastr'
import Tooltip from './Tooltip'

import './UserRewardsToClaim.css'

class UserRewardsToClaim extends Component {
  constructor (props) {
    super()

    this.state = {
      rewards: props.rewards,
      claimProgress: null
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
    const { rewards, claimProgress } = this.state
    const data = rewards.length !== 0 ? rewards.map((domain, idx) =>
      <tr key={idx} className='DashboardRow'>
        <td className='DashboardFirstCell' onClick={(event) => { event.preventDefault(); this.history.push(`/domains/${domain.domain}`) }}>{domain.domain}</td>
        <td id={domain.domain} className='RewardValueCell'>{domain.reward ? domain.reward + ' ADT' : ' - '}</td>
        <td><Button basic id={domain.domain + 'Button'} className='RewardClaimButton' onClick={() => this.claimReward(domain.challenge_id, domain.salt, domain.domain)}>Claim</Button></td>
      </tr>) : null

    return (
      <div className='BoxFrame DashboardColumn'>
        <span className='BoxFrameLabel ui grid'>VOTER REWARDS<Tooltip info={'The found below are accompanied by the ADT reward you have yet to claim. Domains with rewards are shown here when you have successfully challenged a domain in APPLICATION or correctly voted a domain in VOTING.'} /></span>
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
              : <div className='NoDataMessage'>The domains found here are accompanied with the ADT reward you have yet to claim. Domains with rewards are shown here when you have successfully challenged a domain In Application, or correctly voted on a domain In Voting.</div>
            }
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
