import React, { Component } from 'react'
import { Button, Table } from 'semantic-ui-react'
import registry from '../../services/registry'
// import toastr from 'toastr'
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
      <Table.Row key={idx} className='DashboardRow'>
        <Table.Cell className='DashboardFirstCell' onClick={(event) => { event.preventDefault(); this.history.push(`/domains/${domain.domain}`) }}>{domain.domain}</Table.Cell>
        <Table.Cell id={domain.domain} className='RewardValueCell'>{domain.reward ? domain.reward + ' ADT' : ' - '}</Table.Cell>
        <Table.Cell><Button basic id={domain.domain + 'Button'} className='RewardClaimButton' onClick={() => this.claimReward(domain.challenge_id, domain.salt, domain.domain)}>Claim</Button></Table.Cell>
      </Table.Row>) : null

    return (
      <div className='BoxFrame DashboardColumn'>
        <span className='BoxFrameLabel ui grid'>CLAIM VOTING REWARDS<Tooltip info={'You are eligible to claim voting rewards for the domains listed below if you voted on the winning side.'} /></span>
        <div className='ui grid'>
          <div className='column sixteen wide'>
            {data
              ? <Table unstackable className='DashboardTable'>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>
                      Domain
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      Value
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      Action
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {data}
                </Table.Body>
              </Table>
              : <div className='NoDataMessage'>Domains listed here have an associated voting reward that you are eligible to claim if you voted on the winning side.</div>
            }
          </div>
        </div>
      </div>
    )
  }

  async claimReward (challengeId, salt, domain) {
    try {
      let transactionInfo = {
        src: 'claim_reward',
        title: 'Claim Reward'
      }

      PubSub.publish('TransactionProgressModal.open', transactionInfo)
      await registry.claimReward(challengeId, salt)

      document.getElementById(domain).innerText = ' - '
      document.getElementById(domain + 'Button').innerText = 'Claimed'
      document.getElementById(domain + 'Button').className += ' disabled'
    } catch (error) {
      console.error(error)
      PubSub.publish('TransactionProgressModal.error')
    }
  }
}

export default UserRewardsToClaim
