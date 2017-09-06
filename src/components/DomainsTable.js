import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactTable from 'react-table'
import commafy from 'commafy'
import moment from 'moment'

import 'react-table/react-table.css'
import './DomainsTable.css'

import store from '../store'
import registry from '../services/registry'
// import StatProgressBar from './StatProgressBar'

function filterMethod (filter, row, column) {
  const id = filter.pivotId || filter.id

  if (filter.value instanceof RegExp) {
    return row[id] !== undefined ? filter.value.test(row[id]) : true
  }

  return row[id] !== undefined && filter.value ? String(row[id]).startsWith(filter.value) : true
}

var history = null

class DomainsTable extends Component {
  constructor (props) {
    super()

    const filters = props.filters || []
    const data = []
    const columns = this.getColumns()

    this.state = {
      columns,
      data,
      filters
    }

    history = props.history

    this.getData()
  }

  componentDidMount () {
    store.subscribe(x => {
      setTimeout(() => this.getData(), 1e3)
    })
  }

  componentWillReceiveProps (props) {
    const {filters} = props
    this.setState({filters})
  }

  render () {
    const {
      columns,
      data,
      filters
    } = this.state

    return (
      <div className='DomainsTable BoxFrame'>
        <div className='ui grid'>
          <ReactTable
            data={data}
            filtered={filters}
            columns={columns}
            filterable
            defaultPageSize={10}
            minRows={0}
            defaultFilterMethod={filterMethod}
            showPageSizeOptions={false}
            showPageJump={false}
            className='ui table'
          />
        </div>
      </div>
    )
  }

  getColumns () {
    const columns = [{
      Header: 'Domain',
      accessor: 'domain',
      Cell: (props) => {
        const domain = props.value

        return (
          <a href='' className='Domain' onClick={(event) => {
          event.preventDefault()

          let { domain, stage } = props.row

          if (stage === 'apply') {
            history.push(`/apply/?domain=${domain}`)
            return false
          }

          history.push(`/domains/${props.value}`)
        }}>
          <img
            src={`https://www.google.com/s2/favicons?domain=${domain}`}
            width={16}
            alt=''
          />
          {domain}
        </a>
      )},
      minWidth: 200
    }, {
      Header: 'Site Name',
      accessor: 'siteName',
      minWidth: 200
    }, {
      Header: 'Action',
      accessor: 'stage',
      Cell: (props) => {
        const stage = props.value
        const {row} = props
        const {domain} = row

        let label = 'View'

        if (stage === 'in_registry') {
          label = 'View'
        } else if (stage === 'in_application') {
          label = 'Challenge'
        } else if (stage === 'voting_commit') {
          label = 'Vote'
        } else if (stage === 'voting_reveal') {
          label = 'Reveal'
        } else if (stage === 'apply') {
          label = 'Apply'
        }

        const color = (stage === 'in_application' ? 'purple' : 'blue')

        return <a className={`ui mini button ${color}`} href='' onClick={(event) => {
          event.preventDefault()

          if (stage === 'apply') {
            history.push(`/apply/?domain=${domain}`)
            return false
          }

          history.push(`/domains/${domain}`)
        }}>{label}</a>
      },
      minWidth: 120
    }, {
      Header: 'Stage',
      accessor: 'stage',
      Cell: (props) => {
        const {value} = props
        const {domain} = props.row
        let label = ''

        if (value === 'in_registry') {
          label = 'In Registry'
        } else if (value === 'in_application') {
          label = 'In Application'
        } else if (value === 'voting_commit') {
          label = 'Vote - Commit'
        } else if (value === 'voting_reveal') {
          label = 'Vote - Reveal'
        }

        return <span>{label} <a
            href='#!'
            title='Refresh status'
            onClick={(event) => {
              event.preventDefault()

              this.updateStatus(domain)
            }}>
            <i className='icon refresh'></i>
          </a></span>
      },
      minWidth: 130
    }, {
      Header: 'Stage Ends',
      accessor: 'stageEnds',
      className: 'Number',
      headerClassName: 'Number',
      Cell: (props) => {
        const {value} = props

        if (typeof props.value === 'number') {
          return commafy(value)
        }

        return value
      },
      minWidth: 150
  },
  /*
  {
      Header: 'Staked',
      accessor: 'deposit',
      className: 'Number',
      headerClassName: 'Number',
      Cell: (props) => commafy(props.value),
      minWidth: 120
    }, {
      Header: 'Stats',
      accessor: 'stats',
      Cell: (props) => {
        const {stage, stats} = props.row

        if (stage === 'voting_reveal') {
          const {votesFor, votesAgainst} = stats

          // "N | 0" coerces to int
          const totalVotes = ((votesFor + votesAgainst) | 0)
          const supportFill = ((totalVotes / votesFor) * 1e2 | 0)
          const opposeFill = ((totalVotes / votesAgainst) * 1e2 | 0)

          return <StatProgressBar fills={[supportFill, opposeFill]} showFillLabels />
        } else if (stage === 'in_registry' && stats) {
          return <span><strong>{commafy(stats.totalVotes)}</strong> ADT Comitted</span>
        }

        return null
      },
      minWidth: 200
    }
    */

    ]

    return columns
  }

  async getData () {
    const response = await window.fetch(`https://adchain-registry-api.metax.io/registry/domains/all`)
    const domains = await response.json()

    const data = await Promise.all(domains.map(async domain => {
      return new Promise(async (resolve, reject) => {
        const listing = await registry.getListing(domain)

        const {
          applicationExpiry,
          isWhitelisted,
          challengeId
        } = listing

        const item = {
          domain,
          siteName: domain,
          stage: null,
          stageEnds: null,
          action: null,
          stats: null
        }

        const applicationExists = !!applicationExpiry
        const challengeOpen = (challengeId === 0 && !isWhitelisted && applicationExpiry)
        const commitOpen = await registry.commitPeriodActive(domain)
        const revealOpen = await registry.revealPeriodActive(domain)
        // const pollEnded = await registry.pollEnded(domain)

        if (isWhitelisted) {
          item.stage = 'in_registry'
          item.deposit = listing.currentDeposit
          item.stageEnds = `Ended ${moment.unix(applicationExpiry).format('YYYY-MM-DD')}`
        } else if (challengeOpen) {
          item.stage = 'in_application'
          item.stageEnds = moment.unix(applicationExpiry).format('YYYY-MM-DD HH:mm:ss')
        } else if (commitOpen) {
          item.stage = 'voting_commit'
          const {
            commitEndDate
          } = await registry.getChallengePoll(domain)
          item.stageEnds = moment.unix(commitEndDate).format('YYYY-MM-DD HH:mm:ss')
        } else if (revealOpen) {
          item.stage = 'voting_reveal'
          const {
            revealEndDate,
            votesFor,
            votesAgainst
          } = await registry.getChallengePoll(domain)
          item.stageEnds = moment.unix(revealEndDate).format('YYYY-MM-DD HH:mm:ss')
          item.stats = {
            votesFor,
            votesAgainst
          }
        } else if (applicationExists) {
          item.stage = 'view'
        } else {
          item.stage = 'apply'
        }

        resolve(item)
      })
    }))

    this.setState({
      data: data
    })
  }

  async updateStatus (domain) {
    try {
      await registry.updateStatus(domain)

    } catch (error) {

    }

    this.getData()
  }
}

DomainsTable.propTypes = {
  filters: PropTypes.array,
  history: PropTypes.object
}

export default DomainsTable
