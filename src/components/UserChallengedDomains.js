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
    const data = challengedDomains ? challengedDomains.map((domain, idx) => <tr key={idx} className='DashboardRow'><td className='DashboardFirstCell'>{domain.domain}</td><td>{domain.stage}</td></tr>) : null

    return (
      <div className='BoxFrame DashboardColumn'>
        <span className='BoxFrameLabel ui grid'>DOMAINS YOU CHALLENGED</span>
        <div className='ui grid'>
          <div className='column sixteen wide'>
            <table>
              <tbody>
                <tr>
                  <th className='DashboardTitle'>Domain</th>
                  <th className='DashboardTitle'>Stage</th>
                </tr>
                {data}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

export default UserChallengedDomains
