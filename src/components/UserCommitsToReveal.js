import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'

import './UserCommitsToReveal.css'

class UserCommitsToReveal extends Component {
  constructor (props) {
    super()

    this.state = {
      commitsToReveal: props.commitsToReveal
    }
  }

  componentDidMount () {
    this._isMounted = true
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.commitsToReveal !== this.props.commitsToReveal) {
      this.setState({
        commitsToReveal: nextProps.commitsToReveal
      })
    }
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  render () {
    const { commitsToReveal } = this.state
    const data = commitsToReveal ? commitsToReveal.map((domain, idx) => <tr key={idx} className='DashboardRow'><td className='DashboardFirstCell'>{domain.domain}</td><td><Button basic className='RevealButton'>Reveal</Button></td></tr>) : null

    return (
      <div className='BoxFrame DashboardColumn'>
        <span className='BoxFrameLabel ui grid'>YOUR COMMITS TO REVEAL</span>
        <div className='ui grid'>
          <div className='column sixteen wide'>
            <table>
              <tbody>
                <tr>
                  <th className='DashboardTitle'>Domain</th>
                  <th className='DashboardTitle'>Action</th>
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

export default UserCommitsToReveal
