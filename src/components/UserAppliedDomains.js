import React, { Component } from 'react'
import Tooltip from './Tooltip'
import './UserAppliedDomains.css'

class UserAppliedDomains extends Component {
  constructor (props) {
    super()

    this.state = {
      appliedDomains: props.appliedDomains
    }
    this.history = props.history
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
    const data = appliedDomains.length !== 0
      ? appliedDomains.map((domain, idx) =>
        <tr key={idx} className='DashboardRow'>
          <td className='DashboardFirstCell' onClick={(event) => { event.preventDefault(); this.history.push(`/domains/${domain.domain}`) }}>{domain.domain}</td>
          <td className='DashboardSecondCell'>{domain.stage}</td>
        </tr>) : null

    return (
      <div className='BoxFrame DashboardColumn'>
        <span className='BoxFrameLabel ui grid'>DOMAINS APPLIED<Tooltip info={"The domains below are recorded as domains applied by your wallet address. The domain's status is shown to its right."} /></span>
        <div className='ui grid DomainList'>
          <div className='column sixteen wide'>
            {data
              ? <table>
                <tbody>
                  <tr>
                    <th className='DashboardTitle'>Domain</th>
                    <th className='DashboardTitle'>Stage</th>
                  </tr>
                  {data}
                </tbody>
              </table>
              : <div className='NoDataMessage'>The domains here are recorded as domains applied by your wallet address. The domain's status is shown to its right.</div>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default UserAppliedDomains
