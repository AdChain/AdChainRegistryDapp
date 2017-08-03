import React, { Component } from 'react'
import qs from 'qs'
import updateQuery from 'update-query'

import normalizeQueryObj from '../utils/normalizeQueryObj'

import RegistryStatsbar from './RegistryStatsbar'
import AdtCalculator from './AdtCalculator'
import DomainsTable from './DomainsTable'
import DomainsFilterPanel from './DomainsFilterPanel'

import './DomainsContainer.css'

class DomainsContainer extends Component {
  constructor (props) {
    super()

    const query = qs.parse(props.location.search.substr(1))

    this.state = {
      query: normalizeQueryObj(query)
    }

    this.onQueryChange = this.onQueryChange.bind(this)
  }

  componentWillReceiveProps (props) {
    const query = qs.parse(props.location.search.substr(1))

    this.setState({query: normalizeQueryObj(query)})
  }

  render () {
    const {query} = this.state

    return (
      <div className='DomainsContainer'>
        <div className='ui grid stackable padded'>
          <div className='column ten wide'>
            <RegistryStatsbar />
          </div>
          <div className='column six wide'>
            <AdtCalculator />
          </div>
          <div className='column four wide'>
            <DomainsFilterPanel
              filters={query}
              onFiltersChange={this.onQueryChange.bind(this)}
            />
          </div>
          <div className='column twelve wide'>
            <DomainsTable />
          </div>
        </div>
      </div>
    )
  }

  onQueryChange (query) {
    const url = window.location.search
    const newQuery = updateQuery(url, query)

    window.history.replaceState({}, window.location.pathname, newQuery)
  }
}

export default DomainsContainer
