import React, { Component } from 'react'
import './UserChallengedDomains.css'
import Tooltip from '../Tooltip'
import { Table } from 'semantic-ui-react'

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
    let data
    try {
      const { challengedDomains } = this.state
      data = challengedDomains.length !== 0 ? challengedDomains.map((domain, idx) =>
        <Table.Row key={idx} className='DashboardRow'>
          <Table.Cell className='DashboardFirstCell' onClick={(event) => { event.preventDefault(); this.history.push(`/domains/${domain.domain}`) }}>{domain.domain}</Table.Cell>
          <Table.Cell className='DashboardSecondCell'>{domain.stage}</Table.Cell>
        </Table.Row>) : null
    } catch (error) {
      console.log(error)
      data = []
    }

    return (
      <div className='BoxFrame DashboardColumn'>
        <span className='BoxFrameLabel ui grid'>DOMAINS CHALLENGED<Tooltip info={"The domains that are in Application that you challenged are recorded here. The domain's status is shown to its right."} /></span>
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
                      Stage
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {data}
                </Table.Body>
              </Table>
              : <div className='NoDataMessage'>The domains In Application that you challenged are recorded here. The domain's status is shown to its right.</div>}
          </div>
        </div>
      </div>
    )
  }
}

export default UserChallengedDomains
