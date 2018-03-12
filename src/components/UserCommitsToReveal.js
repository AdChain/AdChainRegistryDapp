import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'
import Tooltip from './Tooltip'
import './UserCommitsToReveal.css'

class UserCommitsToReveal extends Component {
  constructor (props) {
    super()

    this.state = {
      commitsToReveal: props.commitsToReveal,
      history: props.history
    }

    this.goToReveal = this.goToReveal.bind(this)
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
    const data = commitsToReveal ? commitsToReveal.map((domain, idx) =>
      <tr key={idx} className='DashboardRow'>
        <td className='DashboardFirstCell' onClick={(event) => { event.preventDefault(); this.state.history.push(`/domains/${domain.domain}`) }}>{domain.domain}</td>
        <td><Button basic className='RevealButton DashboardSecondCell' onClick={() => this.goToReveal(domain.domain)}>Reveal</Button>
        </td></tr>) : null

    return (
      <div className='BoxFrame DashboardColumn'>
        <span className='BoxFrameLabel ui grid'>YOUR COMMITS TO REVEAL <Tooltip info={'The domains below you have commited votes to. They are listed below to remind you to reveal your votes. The domains below are still in REVEAL STAGE.'} /></span>
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

  goToReveal (domain) {
    const { history } = this.state
    history.push(`/domains/${domain}`)
  }
}

export default UserCommitsToReveal
