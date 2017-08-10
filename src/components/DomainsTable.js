import React, { Component } from 'react'
import ReactTable from 'react-table'
import commafy from 'commafy'
import capitalize from 'capitalize'

import 'react-table/react-table.css'
import './DomainsTable.css'

import StatProgressBar from './StatProgressBar'

const data = [{
  domain: 'foo.net',
  siteName: 'Foo Net Media',
  adtStaked: 45324,
  status: 'in application',
  challengePeriodEnd: 643522,
  action: 'challenge',
  stats: null
}, {
  domain: 'nytimes.com',
  siteName: 'New York Times',
  adtStaked: 12232,
  status: 'voting - reveal',
  challengePeriodEnd: 90345,
  action: 'reveal',
  stats: {
    support: 75,
    oppose: 25
  }
}, {
  domain: 'wsj.com',
  siteName: 'The Wall Street Journal',
  adtStaked: 43589,
  status: 'in registry',
  challengePeriodEnd: null,
  action: 'view profile',
  stats: null
}, {
  domain: 'cbs.com',
  siteName: 'CBS Interactive',
  adtStaked: 90784,
  status: 'in application',
  challengePeriodEnd: 345,
  action: 'challenge',
  stats: null
}, {
  domain: 'cnn.com',
  siteName: 'CNN',
  adtStaked: 35905,
  status: 'vote - commit',
  challengePeriodEnd: 8495,
  action: 'commit',
  stats: {
    commited: 3455
  }
}]

const columns = [{
  Header: 'Domain',
  accessor: 'domain',
  Cell: (props) => {
    const domain = props.value

    return (
      <a href='' className='Domain' onClick={(event) => {
      event.preventDefault()

      let {action} = props.row

      if (/challenge/gi.test(action)) {
        action = 'challenge'
      } else if (/commit/gi.test(action)) {
        action = 'commit'
      } else if (/reveal/gi.test(action)) {
        action = 'reveal'
      }

      history.push(`/profile/${props.value}?action=${action}`)
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
  accessor: 'action',
  Cell: (props) => {
    const {value} = props
    let type = 'blue'

    if (/challenge/gi.test(value)) {
      type = 'purple'
    }

    return <a className={`ui mini button ${type}`} href='' onClick={(event) => {
      event.preventDefault()

      const {row} = props
      let {action} = row
      const domain = row.domain

      if (/challenge/gi.test(action)) {
        action = 'challenge'
      } else if (/commit/gi.test(action)) {
        action = 'commit'
      } else if (/reveal/gi.test(action)) {
        action = 'reveal'
      }

      history.push(`/profile/${domain}?action=${action}`)
    }}>{props.value}</a>
  },
  minWidth: 120
}, {
  Header: 'ADT Staked',
  accessor: 'adtStaked',
  Cell: (props) => commafy(props.value),
  minWidth: 120
}, {
  Header: 'Phase',
  accessor: 'status',
  Cell: (props) => capitalize.words(props.value),
  minWidth: 120
}, {
  Header: 'Phase Ends (blocks)',
  accessor: 'challengePeriodEnd',
  Cell: (props) => commafy(props.value),
  minWidth: 150
}, {
  Header: 'Stats',
  accessor: 'stats',
  Cell: (props) => {
    const {action, stats} = props.row

    if (/reveal/gi.test(action)) {
      const supportFill = stats.support
      const opposeFill = stats.oppose

      return <StatProgressBar fills={[supportFill, opposeFill]} showFillLabels />
    } else if (/commit/gi.test(action)) {
      return <span><strong>{commafy(stats.commited)}</strong> ADT Comitted</span>
    }

    return null
  },
  minWidth: 200
}]

function filterMethod (filter, row, column) {
  const id = filter.pivotId || filter.id

  if (filter.value instanceof RegExp) {
    return row[id] !== undefined ? filter.value.test(row[id]) : true
  }

  return row[id] !== undefined ? String(row[id]).startsWith(filter.value) : true
}

var history = null

class DomainsTable extends Component {
  constructor (props) {
    super()

    const filters = props.filters || []

    this.state = {
      filters
    }

    history = props.history
  }

  componentWillReceiveProps (props) {
    const {filters} = props
    this.setState({filters})
  }

  render () {
    const {filters} = this.state

    return (
      <div className='DomainsTable BoxFrame'>
        <div className='ui grid'>
          <ReactTable
            data={data}
            filtered={filters}
            columns={columns}
            filterable
            defaultPageSize={10}
            defaultFilterMethod={filterMethod}
            className='ui table'
          />
        </div>
      </div>
    )
  }
}

export default DomainsTable
