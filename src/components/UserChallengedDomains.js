import React, { Component } from 'react'
import './UserChallengedDomains.css'

class UserChallengedDomains extends Component {
  constructor (props) {
    super()

    this.state = {
      challengedDomains: props.challengedDomains
    }
  }

  componentDidMount () {
    this._isMounted = true
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.challengedDomains !== this.props.challengedDomains) {
      this.setState({
        challengedDomains: nextProps.challengedDomains
      })
    }
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  render () {
    const { challengedDomains } = this.state
    const data = challengedDomains ? challengedDomains.map((domain, idx) => <div key={idx}><span>{domain.domain}</span></div>) : null

    return (
      <div className='BoxFrame DashboardColumn'>
        <span className='BoxFrameLabel ui grid'>DOMAINS YOU CHALLENGED</span>
        <div className='ui grid'>
          <div className='column sixteen wide'>
            <div>
              <span>Domain</span>
              <span className='StageTitle'>Stage</span>
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

export default UserChallengedDomains
