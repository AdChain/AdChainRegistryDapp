import React, { Component } from 'react'
import { Button, Table } from 'semantic-ui-react'
import Tooltip from '../Tooltip'
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
        <Table.Row key={idx} className='DashboardRow'>
          <Table.Cell className='DashboardFirstCell' onClick={(event) => { event.preventDefault(); this.state.history.push(`/domains/${domain.domain}`) }}>{domain.domain}</Table.Cell>
          <Table.Cell><Button basic className='RevealButton DashboardSecondCell' onClick={() => this.goToReveal(domain.domain)}>Reveal</Button>
          </Table.Cell>
        </Table.Row>) : null
    } catch (error) {
      console.log(error)
      data = []
    }

    return (
      <div className='BoxFrame DashboardColumn'>
        <span className='BoxFrameLabel ui grid'>DOMAINS TO REVEAL<Tooltip info={'The domains listed here are domains for which you have committed votes to. They are listed here to remind you to reveal your votes. The domains listed here are still in their Voting Reveal phase.'} /></span>
        <div className='ui grid'>
          <div className='column sixteen wide'>
            {data
              ? <Table unstackable className='DashboardTable'>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>
                Domain
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                Action
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {data}
                </Table.Body>
              </Table>
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
