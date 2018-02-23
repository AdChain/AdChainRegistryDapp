import React, { Component } from 'react'
import './UserRewardsToClaim.css'

class UserRewardsToClaim extends Component {
  constructor (props) {
    super()

    this.state = {
      rewards: props.rewards
    }
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
    const data = rewards ? rewards.map((domain, idx) => <div key={idx}><span>{domain.domain}</span></div>) : null

    return (
      <div className='BoxFrame DashboardColumn'>
        <span className='BoxFrameLabel ui grid'>CLAIM REWARDS</span>
        <div className='ui grid'>
          <div className='column sixteen wide'>
            <div>
              <span>Domain</span>
              <span className='ValueTitle'>Value(ADT)</span>
              <span className='StageTitle'>Action</span>
            </div>
            <div>
              {data}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default UserRewardsToClaim
