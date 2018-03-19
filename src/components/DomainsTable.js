import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactTable from 'react-table'
import Tooltip from './Tooltip'
import commafy from 'commafy'
import moment from 'moment'
import toastr from 'toastr'
import 'react-table/react-table.css'
import './DomainsTable.css'
import PubSub from 'pubsub-js'

import store from '../store'
import registry from '../services/registry'

// import StatProgressBar from './StatProgressBar'

function filterMethod (filter, row) {
  const id = filter.pivotId || filter.id
  if (filter.value instanceof RegExp) {
    return row[id] !== undefined ? filter.value.test(row[id]) : true
  }

  let res = row[id] !== undefined && filter.value ? String(row[id].domain).indexOf(filter.value) > -1 : true
  return res
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

    const filters = props.filters
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
    // this.getData()
  }

  componentDidMount () {
    this._isMounted = true

    // infinite calls if enabled,
    // need to debug
    store.subscribe(x => {
      this.getData(this.props.filters)
    })
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  componentWillReceiveProps (props) {
    const {filters} = props
    if (this._isMounted) {
      this.setState({filters})
    }
    this.getData(filters)
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
        <span className='BoxFrameLabel ui grid'>DOMAINS <Tooltip info={'The Domains Table shows a holistic view of every active domain that has applied to the registry. Feel free to use the DOMAIN FILTER box to the left to display the desired content.'} /></span>
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

  // The 'props' parameter used here is coming from the data prop in the ReactTable
  // It is how the react table requires you to pass custom data: https://github.com/react-tools/react-table#props
  getColumns () {
    const columns = [{
      Header: 'Domain',
      accessor: 'domain',
      Cell: (props) => {
        const domain = props.value
        return (
          <span
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
            />&nbsp;
            {domain}
          </span>
        )
      },
      minWidth: 200
    },
    {
      Header: 'Action',
      accessor: 'stage',
      Cell: (props) => {
        const stage = props.value
        const {row} = props
        const {domain} = row
        let color
        let label = 'View'
        const expired = isExpired(row) || row.stage === 'view'

        if (stage === 'in_registry') {
          label = 'View'
          color = ''
        } else if (stage === 'in_application' && expired) {
          label = 'REFRESH STATUS'
          color = 'greyblack'
        } else if (stage === 'in_application') {
          label = 'CHALLENGE'
          color = 'red'
        } else if (stage === 'voting_commit') {
          label = 'VOTE'
          color = 'blue'
        } else if (stage === 'voting_reveal') {
          label = 'REVEAL'
          color = 'green'
        } else if (stage === 'apply') {
          label = 'APPLY'
          color = 'blue'
        } else if (stage === 'wrong network') {
          label = ''
          color = ''
        } else {
          label = 'REFRESH STATUS'
          color = 'greyblack'
        }

        return <a
          className={color ? `ui mini button table-button ${color}` : ' table-button transparent-button'}
          href='#!'
          title={label}
          onClick={(event) => {
            event.preventDefault()
            if (label === 'REFRESH STATUS') {
              this.updateStatus(domain)
            }
            if (label === 'APPLY') {
              PubSub.publish('SideBarApplicationContainer.populateApplicationForm', domain)
              return
            }
            history.push(`/domains/${domain}`)
          }}>{label} &nbsp;{label === 'REFRESH STATUS' ? <i className='icon refresh' /> : '' }</a>
      },
      minWidth: 120
    }, {
      Header: 'Stage',
      accessor: 'stage',
      Cell: (props) => {
        const {value, row} = props
        const {domain} = row
        const stage = props.value
        let label = ''
        let color = ''

        const expired = isExpired(row) || row.stage === 'view'
        if (stage === 'apply') {
          label = <span><i className='icon x circle' style={{color: 'red'}} />Rejected</span>
          color = 'info'
        } else if (expired) {
          label = ' '
          color = 'info'
        } else if (value === 'in_registry') {
          label = <span><i className='icon check circle' style={{color: 'green'}} />In Registry</span>
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
            <span className={color}
              onClick={(event) => {
                event.preventDefault()
                history.push(`/domains/${domain}`)
              }}>
              {label}
            </span>
          </a>
            : <span className={color}
              onClick={(event) => {
                event.preventDefault()
                history.push(`/domains/${domain}`)
              }} key={Math.random()}>
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
        const {domain} = row

        if (value) {
          if (isExpired(row)) {
            return <span className='error'
              onClick={(event) => {
                event.preventDefault()
                history.push(`/domains/${domain}`)
              }}>{value}</span>
          }
        }

        if (typeof props.value === 'number') {
          return <span onClick={(event) => {
            event.preventDefault()
            history.push(`/domains/${domain}`)
          }}>{commafy(value)}</span>
        }

        return <span onClick={(event) => {
          event.preventDefault()
          history.push(`/domains/${domain}`)
        }}>{value}</span>
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
    const data = await Promise.all(domains.map(async domainData => {
      let domain = domainData.domain

      const item = {
        domain,
        siteName: domain,
        stage: null,
        stageEndsTimestamp: null,
        stageEnds: null,
        action: null,
        stats: null
      }
      try {
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
          let {commitEndDate} = await registry.getChallengePoll(domain)
          item.stageEndsTimestamp = commitEndDate
          item.stageEnds = moment.unix(commitEndDate).format('YYYY-MM-DD HH:mm:ss')
        } else if (revealOpen) {
          item.stage = 'voting_reveal'
          let {
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
        if (item.domain) {
          return {
            domain: item.domain || '',
            siteName: domain || '',
            stage: 'wrong network',
            stageEndsTimestamp: '',
            stageEnds: '',
            action: 'wrong network',
            stats: 'wrong network'
          }
        } else {
          return {}
        }
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

  async getData (filters) {
    try {
      const {
        pageSize
      } = this.state

      let domains = []
      const queryFilters = []
      const stageFilter = (filters).reduce((acc, x) => {
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

        query += `&account=${account}&include=applied,challenged,committed,revealed,registry`
      }

      try {
        domains = await (await window.fetch(`https://adchain-registry-api-staging.metax.io/registry/domains?${query}`)).json()
        if (!Array.isArray(domains)) {
          domains = []
        }
      } catch (error) {
        console.log(error)
      }

      if (this._isMounted) {
        this.setState({
          allDomains: domains,
          pages: Math.ceil(domains.length / pageSize, 10)
        })
      }

      // if (!this.state.data.length) {
      this.onTableFetchData({page: 0, pageSize})
    } catch (error) {
      console.log(error)
    }
    // }
  }

  async updateStatus (domain) {
    try {
      await registry.updateStatus(domain)
    } catch (error) {
      try {
        toastr.error('Update Error')
      } catch (err) {
        console.log(err)
      }
    }
    const {filters} = this.props
    this.getData(filters)
  }
}

DomainsTable.propTypes = {
  filters: PropTypes.array,
  history: PropTypes.object
}

export default DomainsTable
