import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactTable from 'react-table'
import commafy from 'commafy'
import moment from 'moment'
import toastr from 'toastr'

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

  return row[id] !== undefined && filter.value ? String(row[id]).indexOf(filter.value) > -1 : true
}

var history = null

function isExpired (row) {
  const now = moment().unix()
  const end = row._original.stageEndsTimestamp

  if (!end) return false
  return end < now
}

class DomainsTable extends Component {
  constructor (props) {
    super()

    const filters = props.filters || []
    const columns = this.getColumns()

    this.state = {
      columns,
      data: [],
      filters,
      allDomains: [],
      pages: -1, // we don't know how many pages yet
      pageSize: 10,
      isLoading: false
    }

    history = props.history

    this.onTableFetchData = this.onTableFetchData.bind(this)
    this.getData()
  }

  componentDidMount () {
    this._isMounted = true

    // infinite calls if enabled,
    // need to debug
    store.subscribe(x => {
      // this.getData()
    })
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  componentWillReceiveProps (props) {
    const {filters} = props
    this.setState({filters})

    setTimeout(() => {
      this.getData()
    }, 0)
  }

  render () {
    const {
      columns,
      data,
      pages,
      pageSize,
      isLoading
    } = this.state

    return (
      <div className='DomainsTable BoxFrame'>
        <span className="BoxFrameLabel ui grid">DOMAINS</span>
        <div className='ui grid'>
          <ReactTable
            loading={isLoading}
            data={data}
            pages={pages}
            columns={columns}
            filterable
            defaultPageSize={pageSize}
            minRows={0}
            defaultFilterMethod={filterMethod}
            showPageSizeOptions={false}
            showPageJump
            resizable
            className='ui table'
            manual
            onFetchData={this.onTableFetchData}
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
          <a
            href='#!'
            className='Domain'
            title='View profile'
            onClick={(event) => {
              event.preventDefault()

              history.push(`/domains/${props.value}`)
            }}>
            <img
              src={`https://www.google.com/s2/favicons?domain=${domain}`}
              width={16}
              alt=''
          />
            {domain}
          </a>
        )
      },
      minWidth: 200
    },
    /*
    {
      Header: 'Site Name',
      accessor: 'siteName',
      Cell: (props) => {
        const {value} = props

        // dummy
        return value.toUpperCase()
      },
      minWidth: 200
    },
    */
    {
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

        return <a
          className={`ui mini button ${color}`}
          href='#!'
          title={label}
          onClick={(event) => {
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
        const {value, row} = props
        const {domain} = row
        let label = ''
        let color = ''

        const expired = isExpired(row) || row.stage === 'view'

        if (expired) {
          label = 'Refresh Status '
          color = 'info'
        } else if (value === 'in_registry') {
          label = <span><i className='icon check circle' />In Registry</span>
          color = 'success'
        } else if (value === 'in_application') {
          label = 'In Application'
          color = ''
        } else if (value === 'voting_commit') {
          label = 'Vote - Commit'
          color = ''
        } else if (value === 'voting_reveal') {
          label = 'Vote - Reveal'
          color = ''
        }

        return ([
          expired ? <a
            href='#!'
            title='Refresh status'
            key={Math.random()}
            onClick={(event) => {
              event.preventDefault()

              this.updateStatus(domain)
            }}>
            <span className={color}>
              {label}
            </span>
            <i className='icon refresh' />
          </a>
          : <span className={color} key={Math.random()}>
            {label}
          </span>
        ])
      },
      minWidth: 130
    }, {
      Header: 'Stage Ends',
      accessor: 'stageEnds',
      className: 'Number',
      headerClassName: 'Number',
      Cell: (props) => {
        const {value, row} = props

        if (value) {
          if (isExpired(row)) {
            return <span className='error'>{value}</span>
          }
        }

        if (typeof props.value === 'number') {
          return commafy(value)
        }

        return value
      },
      minWidth: 150
    }
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

  async onTableFetchData (state, instance) {
    if (this._isMounted) {
      this.setState({
        isLoading: true
      })
    }

    const {
      page,
      pageSize
    } = state

    const filtered = this.state.filters

    const start = page * pageSize
    const end = start + pageSize

    const allDomains = this.state.allDomains
    let domains = allDomains

    if (filtered && filtered[0]) {
      domains = domains.filter(domain => {
        return filterMethod(filtered[0], {domain})
      })
    }

    const pages = Math.ceil(domains.length / pageSize, 10)
    domains = domains.slice(start, end)

    const data = await Promise.all(domains.map(async domain => {
      try {
        const item = {
          domain,
          siteName: domain,
          stage: null,
          stageEndsTimestamp: null,
          stageEnds: null,
          action: null,
          stats: null
        }

        const listing = await registry.getListing(domain)

        const {
          applicationExpiry,
          isWhitelisted,
          challengeId
        } = listing

        const applicationExists = !!applicationExpiry
        const challengeOpen = (challengeId === 0 && !isWhitelisted && applicationExpiry)
        const commitOpen = await registry.commitStageActive(domain)
        const revealOpen = await registry.revealStageActive(domain)
        const isInRegistry = (isWhitelisted && !commitOpen && !revealOpen)

        if (isInRegistry) {
          item.stage = 'in_registry'
          item.deposit = listing.currentDeposit
        } else if (challengeOpen) {
          item.stage = 'in_application'
          item.stageEndsTimestamp = applicationExpiry
          item.stageEnds = moment.unix(applicationExpiry).format('YYYY-MM-DD HH:mm:ss')
        } else if (commitOpen) {
          item.stage = 'voting_commit'
          const {
            commitEndDate
          } = await registry.getChallengePoll(domain)
          item.stageEndsTimestamp = commitEndDate
          item.stageEnds = moment.unix(commitEndDate).format('YYYY-MM-DD HH:mm:ss')
        } else if (revealOpen) {
          item.stage = 'voting_reveal'
          const {
            revealEndDate,
            votesFor,
            votesAgainst
          } = await registry.getChallengePoll(domain)
          item.stageEndsTimestamp = revealEndDate
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

        return item
      } catch (error) {
        return {}
      }
    }))

    if (this._isMounted) {
      this.setState({
        data,
        isLoading: false,
        pages
      })
    }
  }

  async getData () {
    const {
      pageSize,
      filters
    } = this.state

    let domains = []
    const queryFilters = []

    const stageFilter = (filters || []).reduce((acc, x) => {
      if (x.id === 'stage') {
        return x
      }

      return acc
    }, null)

    // TODO: optimize filtering
    if (stageFilter) {
      const regex = stageFilter.value

      // if does have a filter
      if (regex.toString() !== '/(?:)/gi') {
        domains = []

        if (regex.test('voting_commit')) {
          regex.lastIndex = 0
          queryFilters.push('incommit')
        }
        if (regex.test('voting_reveal')) {
          regex.lastIndex = 0
          queryFilters.push('inreveal')
        }
        if (regex.test('in_application')) {
          regex.lastIndex = 0
          queryFilters.push('inapplication')
        }
        if (regex.test('in_registry')) {
          regex.lastIndex = 0
          queryFilters.push('inregistry')
        }
      }
    }

    // TODO: optimize filtering
    const accountFilter = (filters || []).reduce((acc, x) => {
      if (x.id === 'account') {
        return x
      }

      return acc
    }, null)

    let query = `filter=${queryFilters.join(',')}`

    if (accountFilter) {
      const account = accountFilter.value || ''

      query += `&account=${account}&include=applied,challenged,commited,reveled,registry`
    }

    try {
      domains = await (await window.fetch(`https://adchain-registry-api.metax.io/registry/domains?${query}`)).json()

      if (!Array.isArray(domains)) {
        domains = []
      }
    } catch (error) {

    }

    this.setState({
      allDomains: domains,
      pages: Math.ceil(domains.length / pageSize, 10)
    })

    // if (!this.state.data.length) {
    this.onTableFetchData({page: 0, pageSize})
    // }
  }

  async updateStatus (domain) {
    try {
      await registry.updateStatus(domain)
    } catch (error) {
      toastr.error(error)
    }

    this.getData()
  }
}

DomainsTable.propTypes = {
  filters: PropTypes.array,
  history: PropTypes.object
}

export default DomainsTable
