import React, { Component } from 'react'
import PropTypes from 'prop-types'
import commafy from 'commafy'
import Tooltip from '../Tooltip'
import store from '../../store'
// import token from '../../services/token'
import { Input } from 'semantic-ui-react'
import { registryApiURL } from '../../models/urls'

import './DomainsFilterPanel.css'

class DomainsFilterPanel extends Component {
  constructor (props) {
    super()

    this.state = {
      filters: props.filters,
      totalStaked: 0,
      totalInApplication: 0,
      totalInCommit: 0,
      totalInReveal: 0,
      totalInRegistry: 0,
      totalWithdrawn: 0,
      totalRejected: 0
    }

    this.onSearchInput = this.onSearchInput.bind(this)
    this.onFilterChange = this.onFilterChange.bind(this)
    this.onFiltersChange = props.onFiltersChange.bind(this)
    this.resetFilters = this.resetFilters.bind(this)

    this.fetchStats()
  }

  componentDidMount () {
    this._isMounted = true

    this.fetchStats()
    store.subscribe(x => {
      this.fetchStats()
    })
  }

  componentWillReceiveProps (props) {
    if (this._isMounted) {
      this.setState({
        filters: props.filters
      })
    }
  }
  componentWillUnmount () {
    this._isMounted = false
  }

  render () {
    const {
      filters,
      totalInApplication,
      totalInCommit,
      totalInReveal,
      totalInRegistry,
      totalWithdrawn,
      totalRejected
    } = this.state

    return (
      <div className='DomainsFilterPanel BoxFrame'>
        <div className='ui grid stackable'>
          <div className='SearchContainer column sixteen wide'>
            <span className='BoxFrameLabel ui grid'>DOMAIN FILTERS <Tooltip info={'The fields in this box filter the user view in the DOMAINS table.'} /></span>
            <div className='SearchTitle'>
              Search Domains
            </div>
            <div>
              <Input
                icon='search'
                iconPosition='left'
                placeholder='example.com'
                name='domain'
                id='DomainsFiltersPanelDomainSearch'
                defaultValue={filters.domain}
                onKeyUp={this.onSearchInput}
                type='text' />
            </div>
          </div>
          <div className='ListTitle'>
            Stage
          </div>
          <div className='ui grid'>
            <div className='sixteen wide column'>
              <ul className='ui list'>
                <li className='item'>
                  <div className='ui input'>
                    <input
                      type='checkbox'
                      id='DomainsFilterPanel_InRegistry'
                      name='inRegistry'
                      checked={!!filters.inRegistry}
                      onChange={this.onFilterChange}
                    />
                  </div>
                  <label htmlFor='DomainsFilterPanel_InRegistry'>In Registry</label> &nbsp;
                  <span className='f-grey f-12 f-os'>({totalInRegistry != null ? commafy(totalInRegistry) : '-'})</span>
                </li>
                <li className='item'>
                  <div className='ui input'>
                    <input
                      type='checkbox'
                      id='DomainsFilterPanel_InApplication'
                      name='inApplication'
                      checked={!!filters.inApplication}
                      onChange={this.onFilterChange}
                    />
                  </div>
                  <label htmlFor='DomainsFilterPanel_InApplication'>In Application</label> &nbsp;
                  <span className='f-grey f-12 f-os'>({totalInApplication != null ? commafy(totalInApplication) : '-'})</span>

                </li>
                <li className='item'>
                  <div className='ui input'>
                    <input
                      type='checkbox'
                      id='DomainsFilterPanel_InVotingCommit'
                      name='inVotingCommit'
                      checked={!!filters.inVotingCommit}
                      onChange={this.onFilterChange}
                    />
                  </div>
                  <label htmlFor='DomainsFilterPanel_InVotingCommit'>In Commit</label> &nbsp;
                  <span className='f-grey f-12 f-os'>({totalInCommit != null ? commafy(totalInCommit) : '-'})</span>
                </li>
                <li className='item'>
                  <div className='ui input'>
                    <input
                      type='checkbox'
                      id='DomainsFilterPanel_InVotingReveal'
                      name='inVotingReveal'
                      checked={!!filters.inVotingReveal}
                      onChange={this.onFilterChange}
                    />
                  </div>
                  <label htmlFor='DomainsFilterPanel_InVotingReveal'>In Reveal</label> &nbsp;
                  <span className='f-grey f-12 f-os'>({totalInReveal != null ? commafy(totalInReveal) : '-'})</span>
                </li>
                <li className='item'>
                  <div className='ui input'>
                    <input
                      type='checkbox'
                      id='DomainsFilterPanel_Rejected'
                      name='rejected'
                      checked={!!filters.rejected}
                      onChange={this.onFilterChange}
                    />
                  </div>
                  <label htmlFor='DomainsFilterPanel_Rejected'>Rejected</label> &nbsp;
                  <span className='f-grey f-12 f-os'>({totalRejected != null ? commafy(totalRejected) : '-'})</span>
                </li>
                <li className='item'>
                  <div className='ui input'>
                    <input
                      type='checkbox'
                      id='DomainsFilterPanel_Withdrawn'
                      name='withdrawn'
                      checked={!!filters.withdrawn}
                      onChange={this.onFilterChange}
                    />
                  </div>
                  <label htmlFor='DomainsFilterPanel_Withdrawn'>Withdrawn</label> &nbsp;
                  <span className='f-grey f-12 f-os'>({totalWithdrawn != null ? commafy(totalWithdrawn) : '-'})</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className='Reset'>
          <a href onClick={this.resetFilters}>Reset</a>
        </div>
      </div>
    )
  }

  onSearchInput (event) {
    const target = event.target
    const {name} = target
    const {filters} = this.state
    filters[name] = target.value

    if (this._isMounted) {
      this.setState(filters)
    }
    this.onFiltersChange(filters)
  }

  onFilterChange (event) {
    const target = event.target
    const {name, checked} = target

    const {filters} = this.state
    filters[name] = checked
    if (this._isMounted) {
      this.setState(filters)
    }
    this.onFiltersChange(filters)
  }

  resetFilters (event) {
    event.preventDefault()

    const filters = {
      domain: '',
      inRegistry: false,
      inApplication: false,
      inVotingCommit: false,
      inVotingReveal: false,
      rejected: false,
      withdrawn: false
    }
    if (this._isMounted) {
      this.setState({filters})
    }
    this.onFiltersChange(filters)

    // TODO: react way of reseting defaultValue to null
    const field = document.querySelector('#DomainsFiltersPanelDomainSearch')
    if (field) {
      field.value = ''
    }
  }

  async fetchStats () {
    try {
      // let totalStaked = await (await window.fetch(`${registryApiURL}/registry/domains/stake/count`)).json()
      const totalInApplication = await (await window.fetch(`${registryApiURL}/registry/domains/application/count`)).json()
      const totalInCommit = await (await window.fetch(`${registryApiURL}/registry/domains/incommit/count`)).json()
      const totalInReveal = await (await window.fetch(`${registryApiURL}/registry/domains/inreveal/count`)).json()
      const totalInRegistry = await (await window.fetch(`${registryApiURL}/registry/domains/registry/count`)).json()
      const totalWithdrawn = await (await window.fetch(`${registryApiURL}/registry/domains/withdrawn/count`)).json()
      const totalRejected = await (await window.fetch(`${registryApiURL}/registry/domains/rejected/count`)).json()

      // if (totalStaked) {
      //   totalStaked = totalStaked / Math.pow(10, token.decimals)
      // }

      if (this._isMounted) {
        this.setState({
          // totalStaked,
          totalInApplication,
          totalInCommit,
          totalInReveal,
          totalInRegistry,
          totalWithdrawn,
          totalRejected
        })
      }
    } catch (error) {
      console.log(error)
    }
  }
}

DomainsFilterPanel.propTypes = {
  filters: PropTypes.object,
  onFiltersChange: PropTypes.func
}

export default DomainsFilterPanel
