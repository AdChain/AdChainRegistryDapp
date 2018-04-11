import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactTable from 'react-table'
import Tooltip from '../Tooltip'
import commafy from 'commafy'
import moment from 'moment'
import toastr from 'toastr'
import 'react-table/react-table.css'
import './DomainsTable.css'

import PubSub from 'pubsub-js'
import CountdownSnapshot from '../CountdownSnapshot'
import calculateGas from '../../utils/calculateGas'

import store from '../../store'
import registry from '../../services/registry'
import getDomainState from '../../utils/determineDomainState'

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

function isExpired (end) {
  const now = moment().unix()
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
            multiSort={false}
            // manual
            // onFetchData={this.onTableFetchData}
          />
          <div className='Legend'>
            <span><i className='icon check circle' /> = &nbsp;  In Registry</span>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span><i className='icon x circle' /> = &nbsp;  Rejected</span>
          </div>
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
            className='Domain DomainFavicon'
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
        const domain = props.original.domain
        let color = props.original.color
        let actionLabel = props.original.actionLabel

        return <a
          className={color ? `ui mini button table-button ${color}` : ' table-button transparent-button'}
          href='#!'
          title={actionLabel}
          onClick={(event) => {
            event.preventDefault()
            if (actionLabel === 'REFRESH STATUS') {
              this.updateStatus(domain)
              return
            }
            if (actionLabel === 'APPLY') {
              PubSub.publish('SideBarApplicationContainer.populateApplicationForm', domain)
              return
            }
            history.push(`/domains/${domain}`)
          }}>{actionLabel} &nbsp;{actionLabel === 'REFRESH STATUS' ? <i className='icon refresh' /> : '' }</a>
      },
      minWidth: 120
    }, {
      Header: 'Stage',
      accessor: 'stage',
      Cell: (props) => {
        const domain = props.original.domain
        let label = props.original.label
        const expired = isExpired(props.original.stageEndsTimestamp) || props.original.stage === 'view'

        return ([
          expired ? <a
            href='#!'
            title='Refresh status'
            key={Math.random()}
            onClick={(event) => {
              event.preventDefault()

              this.updateStatus(domain)
            }}>
            <span
              onClick={(event) => {
                event.preventDefault()
                history.push(`/domains/${domain}`)
              }}>
              {label}
            </span>
          </a>
            : <span
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
      Header: 'Time Remaining',
      accessor: 'stageEndsTimestamp',
      className: 'Number',
      headerClassName: 'Number',
      Cell: (props) => {
        const {value, row} = props
        const {domain} = row

        if (value) {
          return <CountdownSnapshot endDate={value} />
        }

        if (typeof props.value === 'number') {
          return <span onClick={(event) => {
            event.preventDefault()
            history.push(`/domains/${domain}`)
          }}>{commafy(value)}</span>
        }
      },
      minWidth: 150
    }]

    return columns
  }

  async onTableFetchData () {
    if (this._isMounted) {
      this.setState({
        isLoading: true
      })
    }

    // const {
    //   page,
    //   pageSize
    // } = state

    const filtered = this.state.filters

    // const start = page * pageSize
    // const end = start + pageSize

    const allDomains = this.state.allDomains
    let domains = allDomains
    if (filtered && filtered[0]) {
      domains = domains.filter(domain => {
        return filterMethod(filtered[0], {domain})
      })
    }

    // const pages = Math.ceil(domains.length / pageSize, 10)
    // domains = domains.slice(start, end)
    const data = await Promise.all(domains.map(async domainData => {
      try {
        let domainState = await getDomainState(domainData.domain)
        return domainState
      } catch (error) {
        console.log(error)
      }
    }))

    if (this._isMounted) {
      this.setState({
        data,
        isLoading: false
        // pages
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
      this.onTableFetchData()
    } catch (error) {
      console.log(error)
    }
    // }
  }

  async updateStatus (domain) {
    try {
      await registry.updateStatus(domain)
      try {
        calculateGas({
          domain: domain,
          contract_event: true,
          event: 'update status',
          contract: 'registry',
          event_success: true
        })
      } catch (error) {
        console.log('error reporting gas')
      }
    } catch (error) {
      try {
        toastr.error('Update Error')
      } catch (err) {
        console.log(err)
      }
      try {
        calculateGas({
          domain: domain,
          contract_event: true,
          event: 'update status',
          contract: 'registry',
          event_success: false
        })
      } catch (error) {
        console.log('error reporting gas')
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
