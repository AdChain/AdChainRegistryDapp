import React, { Component } from 'react'
import './RegistryGuideStaticDashboard.css'

class RegistryGuideStaticDashboard extends Component {
  constructor (props) {
    super()

    this.state = {
    }
  }

  render () {
    return (
      <div className='BoxFrame DashboardColumn RegistryGuideStaticDashboard'>
        <span className='BoxFrameLabel ui grid'>DOMAINS YOU APPLIED</span>
        <div className='ui grid DomainList'>
          <div className='column sixteen wide'>
            <table>
              <tbody>
                <tr>
                  <th className='DashboardTitle'>Domain</th>
                  <th className='DashboardTitle'>Stage</th>
                </tr>
                <tr className='DashboardRow'>
                  <td className='DashboardFirstCell'>foo.net</td>
                  <td className='DashboardSecondCell'>In Application</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

export default RegistryGuideStaticDashboard
