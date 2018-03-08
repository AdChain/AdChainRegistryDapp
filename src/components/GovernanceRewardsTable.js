import React, { Component } from 'react'
import _ from 'lodash'
import './GovernanceAndCoreParameters.css'

class GovernanceRewardsTable extends Component {
  render () {
    return (
      <div className='AllParameters'>
        <div className='BoxFrame mt-25'>
          <span className='BoxFrameLabel ui grid'>CLAIM REWARDS</span>
          <div className='ui grid'>
            <div className='column sixteen wide'>
              <div>
                <span>Parameters</span>
                <span className='ValuesTitle'>Values</span>
              </div>
              <div>
                {this.generateRewardsTable()}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  generateRewardsTable () {
    if (this.props.rewards.length < 1) return false

    const rewards = this.props.rewards
    let i = 0
    let color
    const table = _.reduce(rewards, (result, { name }) => {
      // If name exists in core param data, use blue color, else use red
      color = this.props.coreParameterData[name] ? 'f-blue bold' : 'f-red bold'
      result.push(
        <div key={name} className='ParameterRow'>
          <span key={name} className={color}>{name}</span>
          <span key={i++} className='ui button green' style={{padding: '.571429em 1em .571429em'}}>CLAIM</span>
        </div>
      )
      return result
    }, [])
    return table
  }
}

export default GovernanceRewardsTable
