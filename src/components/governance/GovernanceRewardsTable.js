import React, { Component } from 'react'
import _ from 'lodash'
// import toastr from 'toastr'
import './GovernanceAndCoreParameters.css'
import { parameterData } from '../../models/parameters'
import ParameterizerService from '../../services/parameterizer'
import Tooltip from '../Tooltip'
import PubSub from 'pubsub-js'

const allParameterData = Object.assign({}, parameterData.coreParameterData, parameterData.governanceParameterData)

class GovernanceRewardsTable extends Component {

  render() {
    const table = this.generateRewardsTable()

    return (
      <div className='AllParameters mt-25'>
        <div className='BoxFrame RegistryGuideClaimRewards' style={{ minHeight: '129px' }}>
          <span className='BoxFrameLabel ui grid'>CLAIM REWARDS <Tooltip info={'These are the proposals you have voted in and can claim rewards. If you can\'t claim your rewards here you may have not yet REFRESHED STATUS of the proposal.'} /></span>
          <div className='ui grid'>
            {
              table ?
                <div className='column sixteen wide'>
                  <div>
                    <span>Parameters</span>
                    <span className='ValuesTitle'>Action</span>
                  </div>
                  <div>
                    {table}
                  </div>
                </div>
                :
                <div className='column sixteen wide'>
                  <div className='t-center f-grey fw-200'>Here you will be able to claim voting ADT rewards for when you vote on the winning side</div>
                </div>
            }
          </div>
        </div>
      </div>
    )
  }

  generateRewardsTable() {
    try {
      if (this.props.rewards.length < 1) return false

      let color
      const rewards = this.props.rewards
      const table = _.reduce(rewards, (result, { name, value }, i) => {
        // If name exists in core param data, use blue color, else use red
        color = this.props.coreParameterData[name] ? 'f-blue bold' : 'f-red bold'
        if (rewards[i].hasOwnProperty('status')) {
          if (rewards[i].status === 'unclaimed') {
            result.push(
              <div key={name + i} className='ParameterRow'>
                <span key={name + i} className={color}>{allParameterData[name].normalizedName}</span>
                {
                  rewards[i].status === "unclaimed"
                    ?
                    <span key={i} className='ui button green' onClick={() => { this.claimReward(rewards[i].challenge_id, rewards[i].salt) }} style={{ padding: '0.571429em 1.2em' }}>CLAIM</span>
                    :
                    rewards[i].status === "claimed"
                      ?
                      <span key={i} style={{ float: 'right', color: 'green' }}>
                        Claimed <i className='icon check circle' style={{ color: 'green', fontSize: '13px' }} />
                      </span>
                      :
                      <span key={i} style={{ float: 'right', color: 'green' }}>
                        Claimed <i className='icon check circle' style={{ color: 'green', fontSize: '13px' }} />
                      </span>
                }
              </div>
            )
          }
        }

        return result
      }, [])

      if (table.length < 1) {
        return false
      } else {
        return table
      }
    } catch (error) {
      console.log(error)
    }
  }

  async claimReward(challenge_id, salt) {
    console.log(challenge_id, salt)
    try {
      let transactionInfo = {
        src: 'claim_governance_reward',
        title: 'Claim Governance Reward'
      }
      PubSub.publish('TransactionProgressModal.open', transactionInfo)
      await ParameterizerService.claimReward(challenge_id, salt)

    } catch (error) {
      console.error('Governance Reward Claim Error: ', error)
      PubSub.publish('TransactionProgressModal.error')
    }
  }
}

export default GovernanceRewardsTable
