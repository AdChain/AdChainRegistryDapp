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
    let data
    try {
      const { commitsToReveal } = this.state
      data = commitsToReveal.length !== 0 ? commitsToReveal.map((domain, idx) =>
        <tr key={idx} className='DashboardRow'>
          <td className='DashboardFirstCell' onClick={(event) => { event.preventDefault(); this.state.history.push(`/domains/${domain.domain}`) }}>{domain.domain}</td>
          <td><Button basic className='RevealButton DashboardSecondCell' onClick={() => this.goToReveal(domain.domain)}>Reveal</Button>
          </td></tr>) : null
    } catch (error) {
      console.log(error)
      data = []
    }

    return (
      <div className='BoxFrame DashboardColumn'>
        <span className='BoxFrameLabel ui grid'>DOMAINS TO REVEAL FOR<Tooltip info={'The domains listed here are domains for which you have committed votes to. They are listed here to remind you to reveal your votes. The domains listed here are still in their Voting Reveal phase.'} /></span>
        <div className='ui grid'>
          <div className='column sixteen wide'>
            {data
              ? <table>
                <tbody>
                  <tr>
                    <th className='DashboardTitle'>Domain</th>
                    <th className='DashboardTitle'>Action</th>
                  </tr>
                  {data}
                </tbody>
              </table>
              : <div className='NoDataMessage'>The domains listed here are domains for which you have committed votes to. They are listed here to remind you to reveal your votes. The domains listed here are still in their Voting Reveal phase.</div>
            }
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
