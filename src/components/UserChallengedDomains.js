import React, { Component } from 'react'
import './UserChallengedDomains.css'
import Tooltip from './Tooltip'

class UserChallengedDomains extends Component {
  constructor (props) {
    super()

    this.state = {
      challengedDomains: props.challengedDomains
    }
    this.history = props.history
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
    const data = challengedDomains.length !== 0 ? challengedDomains.map((domain, idx) =>
      <tr key={idx} className='DashboardRow'>
        <td className='DashboardFirstCell' onClick={(event) => { event.preventDefault(); this.history.push(`/domains/${domain.domain}`) }}>{domain.domain}</td>
        <td className='DashboardSecondCell'>{domain.stage}</td>
      </tr>) : null

    return (
      <div className='BoxFrame DashboardColumn'>
        <span className='BoxFrameLabel ui grid'>DOMAINS YOU CHALLENGE <Tooltip info={"The domains that are in Application that you challenged are recorded here. The domain's status is shown to its right."} /></span>
        <div className='ui grid'>
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
              : <div className='NoDataMessage'>The domains In Application that you challenged are recorded here. The domain's status is shown to its right.</div>}
          </div>
        </div>
      </div>
    )
  }
}

export default UserChallengedDomains
