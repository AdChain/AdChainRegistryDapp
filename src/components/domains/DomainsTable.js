import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactTable from 'react-table'
import _ from 'lodash'
import Tooltip from '../Tooltip'
import commafy from 'commafy'
import moment from 'moment'
import toastr from 'toastr'
import isMobile from 'is-mobile'
import 'react-table/react-table.css'
import './DomainsTable.css'

import PubSub from 'pubsub-js'
import CountdownSnapshot from '../CountdownSnapshot'
import { registryApiURL } from '../../models/urls'

import store from '../../store'
import registry from '../../services/registry'
import token from '../../services/token'
import getDomainState from '../../utils/getDomainState'

// import StatProgressBar from './StatProgressBar'

function filterMethod(filter, row) {
  const id = filter.pivotId || filter.id
  if (filter.value instanceof RegExp) {
    return row[id] !== undefined ? filter.value.test(row[id]) : true
  }

  let res = row[id] !== undefined && filter.value ? String(row[id].domain).indexOf(filter.value) > -1 : true
  return res
}

var history = null

function isExpired(end) {
  const now = moment().unix()
  if (!end) return false
  return end < now
}

class DomainsTable extends Component {
  constructor(props) {
    super()

    const filters = props.filters
    const columns = this.getColumns()
    this.state = {
      columns,
      data: [],
      filters,
      allDomains: [],
      pages: -1, // we don't know how many pages yet
      pageSize: 11,
      isLoading: false,
      inProgress: false,
      withdrawn: {},
      fetching: false
    }

    history = props.history

    this.onTableFetchData = this.onTableFetchData.bind(this)
    this.getData = this.getData.bind(this)
    this.fetchNewData = this.fetchNewData.bind(this)
  }

  componentDidMount() {
    this._isMounted = true
    // infinite calls if enabled,
    // need to debug
    store.subscribe(x => {
      this.getData(this.props.filters)
    })

  }

  componentWillMount() {
    this.fetchNewDataEvent = PubSub.subscribe('DomainsTable.fetchNewData', this.fetchNewData)
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  componentWillReceiveProps(props) {
    const { filters } = props
    if (this._isMounted) {
      this.setState({ filters })
    }
    this.getData(filters)
  }

  render() {
    let {
      columns,
      data,
      pages,
      pageSize,
      isLoading
    } = this.state
    const _data = data.filter(d => d.domain !== 'unknown domain')

    return (
      <div className='DomainsTable BoxFrame'>
        <span className='BoxFrameLabel ui grid mobile-hide'>DOMAINS <Tooltip info={'The Domains Table shows a holistic view of every active domain that has applied to the registry. Feel free to use the DOMAIN FILTER box to the left to display the desired content.'} /></span>
        <div className='ui grid'>
          <ReactTable
            loading={isLoading}
            data={_data}
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

  // The 'props' parameter passed in the 'Cell' is coming from the data prop in the ReactTable
  // It is how the react table requires you to pass custom data: https://github.com/react-tools/react-table#props
  getColumns() {
    if (isMobile()) {
      return this.mobileColumns()
    }
    try {
      const columns = [{
        Header: 'Domain',
        accessor: 'domain',
        Cell: (props) => {
          const domain = props.value
          const url = `https://www.google.com/s2/favicons?domain=${domain}`
          return (
            <span
              className='Domain DomainFavicon'
              title='View profile'
              onClick={(event) => {
                event.preventDefault();
                history.push(`/domains/${props.value}`)
              }}>
              <img src={url} width={16} alt='' />
              {domain}
            </span>
          )
        },
        minWidth: 180
      }, {
        Header: 'Action',
        accessor: 'stage',
        Cell: (props) => {
          let { domain, color, actionLabel, listingHash } = props.original

          return (
            <a className={color ? `ui mini button table-button ${color}` : ' table-button transparent-button'}
              href='#!'
              title={actionLabel}
              onClick={async (event) => {
                event.preventDefault()
                if (actionLabel === 'REFRESH') {
                  this.updateStatus(listingHash)
                  return
                };
                if (actionLabel === 'APPLY') {
                  try {
                    const minDeposit = await registry.getMinDeposit()
                    const adtBalance = await token.getBalance()
                    if (adtBalance < minDeposit) {
                      toastr.error('You do not have enough ADT to apply this domain')
                      return
                    }
                    let data = {
                      domain: domain,
                      stake: Number(minDeposit),
                      action: 'apply'
                    }
                    PubSub.publish('RedditConfirmationModal.show', data)
                  } catch (error) {
                    console.log('Error applying the domain: ', error)
                  }
                  return
                }
                history.push(`/domains/${domain}`)
              }}>{actionLabel} &nbsp;{actionLabel === 'REFRESH' ? <i className='icon refresh' /> : ''}</a>
          )
        },
        minWidth: 120
      }, {
        Header: 'Stage',
        accessor: 'stage',
        Cell: (props) => {
          let { domain, label, listingHash } = props.original

          const expired = isExpired(props.original.stageEndsTimestamp) || props.original.stage === 'view';

          return ([
            expired ? <a
              href='#!'
              title='Refresh'
              key={Math.random()}
              onClick={(event) => {
                event.preventDefault()

                this.updateStatus(listingHash)
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
        className: 'Number',
        accessor: 'stageEndsTimestamp',
        Cell: (props) => {
          let { domain, value, stageEndsTimestamp } = props.original
          value = stageEndsTimestamp

          if (value) {
            return <CountdownSnapshot endDate={value} />
          }
          if (typeof props.value === 'number') {
            return (
              <span onClick={(event) => {
                event.preventDefault()
                history.push(`/domains/${domain}`)
              }}>{commafy(value)}</span>
            )
          }
        },
        minWidth: 150
      }]

      return columns
    } catch (error) {
      console.error('error inside columns: ', error)
    }
  }

  // For Moblie Domains Table View
  mobileColumns() {

    const columns = [{
      Cell: (props) => {
        let { domain, label, stageEndsTimestamp } = props.original
        const url = `https://www.google.com/s2/favicons?domain=${domain}`
        let value = stageEndsTimestamp
        let time = ''
        if (value) {
          time = <CountdownSnapshot endDate={value} />
        }
        return (
          <span
            className='Domain DomainFavicon'
            title='View profile'
            onClick={(event) => {
              event.preventDefault();
              history.push(`/domains/${domain}`)
            }}>
            <img src={url} width={16} alt='' />
            {domain}  <span style={{ float: 'right' }}>{time}</span> <br />
            <span style={{ paddingLeft: '22px', fontSize: '11px' }}>{label}</span>
          </span>
        )
      },
      minWidth: 200
    }, {
      Cell: (props) => {
        let { domain, color, actionLabel, listingHash } = props.original
        return (
          <span className="action">
            <a className={color ? `ui mini button table-button ${color}` : ' table-button transparent-button'}
              href='#!'
              title={actionLabel}
              onClick={async (event) => {
                event.preventDefault()
                if (actionLabel === 'REFRESH') {
                  this.updateStatus(listingHash)
                  return
                };
                if (actionLabel === 'APPLY') {
                  try {
                    const minDeposit = await registry.getMinDeposit()
                    const adtBalance = await token.getBalance()
                    if (adtBalance < minDeposit) {
                      toastr.error('You do not have enough ADT to apply this domain')
                      return
                    }
                    let data = {
                      domain: domain,
                      stake: Number(minDeposit),
                      action: 'apply'
                    }
                    PubSub.publish('RedditConfirmationModal.show', data)
                  } catch (error) {
                    console.log('Error applying the domain: ', error)
                  }
                  return
                }
                history.push(`/domains/${domain}`)
              }}>{actionLabel} &nbsp;{actionLabel === 'REFRESH' ? <i className='icon refresh' /> : ''}</a>
          </span>
        )
      },
      minWidth: 80
    }]

    return columns
  }


  async onTableFetchData(withdrawn) {
    try {
      if (this._isMounted) {
        this.setState({
          isLoading: true
        })
      }

      const filtered = this.state.filters
      let domains = this.state.allDomains

      if (filtered && filtered[0]) {
        domains = domains.filter(domain => {
          return filterMethod(filtered[0], { domain })
        })
      }

      // const pages = Math.ceil(domains.length / pageSize, 10)
      // domains = domains.slice(start, end)
      
      const data = await Promise.all(domains.map(async domainData => {
        try {
          if (domainData.domain) {
            let domainState = await getDomainState(domainData)
            if (domainState.stage === 'rejected') {
              // If rejected --> Check to see if listing is withdrawn
              if (withdrawn[domainState.listingHash]) {
                domainState.label = (<span><i className='icon sign out alternate' />Withdrawn</span>)
              }
            }
            return domainState
          }
        } catch (error) {
          console.log('Error inside data of table fetch data: ', error)
        }
      }))

      if (this._isMounted) {
        this.setState({
          data,
          isLoading: false
          // pages
        })
      }
    } catch (error) {
      console.error('Error fetching table data: ', error)
    }
  }

  async getData(filters) {
    if (this.state.fetching) {
      return null
    }
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
          if (regex.test('rejected')) {
            regex.lastIndex = 0
            queryFilters.push('rejected')
          }
          if (regex.test('withdrawn')) {
            regex.lastIndex = 0
            queryFilters.push('withdrawn')
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
      if (this._isMounted) {
        this.setState({
          fetching: true
        })
      }

      // Get withdrawn domains so we can later check the rejected domains to see if they're withrawn.
      let withdrawn = await (await window.fetch(`${registryApiURL}/registry/domains?filter=withdrawn`)).json()
      // Create a hash map of hashes so lookup is faster
      withdrawn = _.keyBy(withdrawn, 'domainHash')

      if (accountFilter) {
        const account = accountFilter.value || ''

        query += `&account=${account}&include=applied,challenged,committed,revealed,registry,rejected,withdrawn`
      }

      try {
        domains = await (await window.fetch(`${registryApiURL}/registry/domains?${query}`)).json()
        if (!Array.isArray(domains)) {
          domains = []
        }
      } catch (error) {
        console.log(error)
      }

      if (this._isMounted) {
        window.localStorage.setItem('TotalNumDomains', JSON.stringify(domains.length))
        this.setState({
          fetching: false,
          allDomains: domains,
          pages: Math.ceil(domains.length / pageSize, 10)
        })

        this.onTableFetchData(withdrawn)

      }
    } catch (error) {
      console.log('Error inside get data: ', error)
    }
  }

  async fetchNewData(topic, source, counter = 0) {
    const { filters } = this.state
    const transactionInfo = source
    const currentNumDomains = Number(window.localStorage.getItem('TotalNumDomains'))
    let domains
    try {
      domains = await (await window.fetch(`${registryApiURL}/registry/domains`)).json()
      console.log("Domains: ", domains)
      if (!Array.isArray(domains)) {
        domains = []
      } else {
        if (domains.length !== currentNumDomains) {
          // If new result from api endpoint is not equal to the current number of domains,
          // it means that the database has been updated, so we need to re-render the table
          this.getData(filters) // this should re-render the table and set a new number of total num domains
          PubSub.publish('TransactionProgressModal.next', transactionInfo) // this will display the final complete state of the transaction progress modal
        } else {
          // If the result from api is still the same as the existing number in storage,
          // we want to run this function again to hit the api again
          if (counter === 5) {
            PubSub.publish('TransactionProgressModal.next', transactionInfo)
            return
          }
          setTimeout(() => {
            this.fetchNewData('', transactionInfo, ++counter)
          }, 2e3)

        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  async updateStatus(listingHash) {
    try {
      await registry.updateStatus(listingHash)
    } catch (error) {
      console.error('Error inside update status: ', error)
    }
    const { filters } = this.props
    this.getData(filters)
  }

}

DomainsTable.propTypes = {
  filters: PropTypes.array,
  history: PropTypes.object
}

export default DomainsTable
