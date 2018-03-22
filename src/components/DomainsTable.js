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
import pad from 'left-pad'
import RefreshInProgressContainer from './RefreshInProgressContainer'

import store from '../store'
import registry from '../services/registry'
import getDomainState from '../utils/determineDomainState'

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
      isLoading: false,
      inProgress: false
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
      isLoading,
      inProgress
    } = this.state
    console.log(data)

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
          <div className='Legend'>
            <span><i className='icon check circle' /> = &nbsp;  In Registry</span>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span><i className='icon x circle' /> = &nbsp;  Rejected</span>
          </div>
          {inProgress ? <RefreshInProgressContainer /> : null}
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

        const endDate = moment.unix(value)
        const now = moment()
        const diff = endDate.diff(now, 'seconds')
        const dur = moment.duration(diff, 'seconds')
        const days = `${pad(dur.days(), 2, 0)}`
        const hours = `${pad(dur.hours(), 2, 0)}`
        const minutes = `${pad(dur.minutes(), 2, 0)}`
        const seconds = `${pad(dur.seconds(), 2, 0)}`

        if (value) {
          if (isExpired(row)) {
            return <span className='error StageEndsCountdownContainer'
              onClick={(event) => {
                event.preventDefault()
                history.push(`/domains/${domain}`)
              }}>
              <span className='ClockIcon'>
                <svg width={13} height={13} viewBox='0 0 13 13'>
                  <path
                    d='M6.5 11.76c.8 0 1.535-.2 2.205-.6.66-.39 1.185-.92 1.575-1.59.39-.67.585-1.405.585-2.205S10.67 5.83 10.28 5.16a4.403 4.403 0 0 0-1.575-1.575A4.305 4.305 0 0 0 6.5 3c-.8 0-1.535.195-2.205.585-.66.39-1.185.915-1.575 1.575a4.305 4.305 0 0 0-.585 2.205c0 .8.195 1.535.585 2.205.39.67.915 1.2 1.575 1.59.67.4 1.405.6 2.205.6zm0-10.02c1.03 0 1.98.255 2.85.765.85.49 1.52 1.16 2.01 2.01.51.87.765 1.82.765 2.85s-.255 1.98-.765 2.85c-.49.85-1.16 1.52-2.01 2.01-.87.51-1.82.765-2.85.765s-1.98-.255-2.85-.765a5.386 5.386 0 0 1-2.01-2.01 5.535 5.535 0 0 1-.765-2.85c0-1.03.255-1.98.765-2.85.49-.85 1.16-1.52 2.01-2.01.87-.51 1.82-.765 2.85-.765zm.33 2.52v3.315L9.32 9.06l-.51.765L5.885 8.01V4.26h.945zM3.95 1.395l-2.895 2.37L.26 2.82 3.125.45l.825.945zm8.79 1.425l-.795.945-2.895-2.46.825-.945 2.865 2.46z'
                    fill='#6D777B'
                    fillRule='evenodd'
                    opacity={0.75}
                  />
                </svg>
              </span>
              <span className='StageEndsTime'>
                00
                <span className='StageEndsLabel'>D</span>
              </span>
              <span className='StageEndsTimeSeparator' />
              <span className='StageEndsTime'>
                00
                <span className='StageEndsLabel'>H</span>
              </span>
              <span className='StageEndsTimeSeparator'>:</span>
              <span className='StageEndsTime'>
                00
                <span className='StageEndsLabel'>M</span>
              </span>
              <span className='StageEndsTimeSeparator'>:</span>
              <span className='StageEndsTime'>
                00
                <span className='StageEndsLabel'>S</span>
              </span>
            </span>
          } else {
            return <span className='StageEndsCountdownContainer'
              onClick={(event) => {
                event.preventDefault()
                history.push(`/domains/${domain}`)
              }}>
              <span className='ClockIcon'>
                <svg width={13} height={13} viewBox='0 0 13 13'>
                  <path
                    d='M6.5 11.76c.8 0 1.535-.2 2.205-.6.66-.39 1.185-.92 1.575-1.59.39-.67.585-1.405.585-2.205S10.67 5.83 10.28 5.16a4.403 4.403 0 0 0-1.575-1.575A4.305 4.305 0 0 0 6.5 3c-.8 0-1.535.195-2.205.585-.66.39-1.185.915-1.575 1.575a4.305 4.305 0 0 0-.585 2.205c0 .8.195 1.535.585 2.205.39.67.915 1.2 1.575 1.59.67.4 1.405.6 2.205.6zm0-10.02c1.03 0 1.98.255 2.85.765.85.49 1.52 1.16 2.01 2.01.51.87.765 1.82.765 2.85s-.255 1.98-.765 2.85c-.49.85-1.16 1.52-2.01 2.01-.87.51-1.82.765-2.85.765s-1.98-.255-2.85-.765a5.386 5.386 0 0 1-2.01-2.01 5.535 5.535 0 0 1-.765-2.85c0-1.03.255-1.98.765-2.85.49-.85 1.16-1.52 2.01-2.01.87-.51 1.82-.765 2.85-.765zm.33 2.52v3.315L9.32 9.06l-.51.765L5.885 8.01V4.26h.945zM3.95 1.395l-2.895 2.37L.26 2.82 3.125.45l.825.945zm8.79 1.425l-.795.945-2.895-2.46.825-.945 2.865 2.46z'
                    fill='#6D777B'
                    fillRule='evenodd'
                    opacity={0.75}
                  />
                </svg>
              </span>
              <span className='StageEndsTime'>
                {days}
                <span className='StageEndsLabel'>D</span>
              </span>
              <span className='StageEndsTimeSeparator' />
              <span className='StageEndsTime'>
                {hours}
                <span className='StageEndsLabel'>H</span>
              </span>
              <span className='StageEndsTimeSeparator'>:</span>
              <span className='StageEndsTime'>
                {minutes}
                <span className='StageEndsLabel'>M</span>
              </span>
              <span className='StageEndsTimeSeparator'>:</span>
              <span className='StageEndsTime'>
                {seconds}
                <span className='StageEndsLabel'>S</span>
              </span>
            </span>
          }
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
    this.setState({
      inProgress: true
    })
    try {
      await registry.updateStatus(domain)
      this.setState({
        inProgress: false
      })
    } catch (error) {
      this.setState({
        inProgress: false
      })
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
