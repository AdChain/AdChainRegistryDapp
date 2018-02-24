import React, { Component } from 'react'
import './UserAppliedDomains.css'

class UserAppliedDomains extends Component {
  constructor (props) {
    super()

    this.state = {
      appliedDomains: props.appliedDomains
    }
  }

  componentDidMount () {
    this._isMounted = true
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.appliedDomains !== this.props.appliedDomains) {
      this.setState({
        appliedDomains: nextProps.appliedDomains
      })
    }
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  render () {
    const { appliedDomains } = this.state
    const data = appliedDomains ? appliedDomains.map((domain, idx) => <tr key={idx} className='DashboardRow'><td className='DashboardFirstCell'>{domain.domain}</td><td>{domain.stage}</td></tr>) : null

    return (
      <div className='BoxFrame DashboardColumn'>
        <span className='BoxFrameLabel ui grid'>DOMAINS YOU APPLIED</span>
        <div className='ui grid DomainList'>
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

export default UserAppliedDomains
