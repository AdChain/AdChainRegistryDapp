import React, { Component } from 'react'
import Tooltip from '../Tooltip'
import { Table } from 'semantic-ui-react'
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
        <Table.Row key={idx} className='DashboardRow'>
          <Table.Cell className='DashboardFirstCell' onClick={(event) => { event.preventDefault(); this.history.push(`/domains/${domain.domain}`) }}>{domain.domain}</Table.Cell>
          <Table.Cell className='DashboardSecondCell'>{domain.stage}</Table.Cell>
        </Table.Row>) : null

    return (
      <div className='BoxFrame DashboardColumn'>
        <span className='BoxFrameLabel ui grid'>DOMAINS APPLIED<Tooltip info={"The domains below are recorded as domains applied by your wallet address. The domain's status is shown to its right."} /></span>
        <div className='ui grid DomainList'>
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
              : <div className='NoDataMessage'>The domains here are recorded as domains applied by your wallet address. The domain's status is shown to its right.</div>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default UserAppliedDomains
