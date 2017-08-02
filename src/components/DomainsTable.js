import React, { Component } from 'react'
import ReactTable from 'react-table'
import commafy from 'commafy'

import 'react-table/react-table.css'
import './DomainsTable.css'

const data = [{
  domain: 'foo.net',
  siteName: 'Foo Net Media',
  adtStaked: 45324,
  status: 'in application',
  challengePeriodEnd: 643522,
  action: 'challenge',
  stats: 2133
}, {
  domain: 'nytimes.com',
  siteName: 'New York Times',
  adtStaked: 12232,
  status: 'voting - reveal',
  challengePeriodEnd: 90345,
  action: 'reveal',
  stats: 9897
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
  stats: 50
}, {
  domain: 'cnn.com',
  siteName: 'CNN',
  adtStaked: 35905,
  status: 'vote',
  challengePeriodEnd: 8495,
  action: 'vote',
  stats: '14,934 ADT committed'
}]

const columns = [{
  Header: 'Domain',
  accessor: 'domain',
  Cell: (props) => <a href={`#/profile/${props.value}`}>{props.value}</a>,
  minWidth: 150
}, {
  Header: 'Site Name',
  accessor: 'siteName',
  minWidth: 200
}, {
  Header: 'ADT Staked',
  accessor: 'adtStaked',
  Cell: (props) => commafy(props.value),
  minWidth: 120
}, {
  Header: 'Phase',
  accessor: 'status',
  minWidth: 120
}, {
  Header: 'Phase Ends (blocks)',
  accessor: 'challengePeriodEnd',
  Cell: (props) => commafy(props.value),
  minWidth: 150
}, {
  Header: 'Action',
  accessor: 'action',
  minWidth: 120
}, {
  Header: 'Stats',
  accessor: 'stats',
  minWidth: 200
}]

class DomainsTable extends Component {
  render () {
    return (
      <div className='DomainsTable BoxFrame'>
        <div className='ui grid'>
          <ReactTable
            data={data}
            columns={columns}
            defaultPageSize={10}
            className='ui table'
          />
        </div>
      </div>
    )
  }
}

export default DomainsTable
