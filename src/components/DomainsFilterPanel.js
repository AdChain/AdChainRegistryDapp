import React, { Component } from 'react'
// import PropTypes from 'prop-types'

import './DomainsFilterPanel.css'

class DomainsFilterPanel extends Component {
  constructor (props) {
    super()

    this.state = {
      filters: props.filters
    }

    this.onSearchInput = this.onSearchInput.bind(this)
    this.onFilterChange = this.onFilterChange.bind(this)
    this.onFiltersChange = props.onFiltersChange.bind(this)
    this.resetFilters = this.resetFilters.bind(this)
  }

  componentWillReceiveProps (props) {
    this.setState({
      filters: props.filters
    })
  }

  render () {
    const filters = this.state.filters

    return (
      <div className='DomainsFilterPanel BoxFrame'>
        <div className='ui grid stackable'>
          <div className='SearchContainer column sixteen wide'>
            <div className='ui left icon input'>
              <i className='search icon' />
              <input
                name='domain'
                id='DomainsFiltersPanelDomainSearch'
                defaultValue={filters.domain}
                onKeyUp={this.onSearchInput}
                type='text'
                placeholder='Search Domain' />
            </div>
          </div>
          <div className='column sixteen wide'>
            <div className='ListTitle'>
            Status
            </div>
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
                <label htmlFor='DomainsFilterPanel_InRegistry'>In Registry</label>
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
                <label htmlFor='DomainsFilterPanel_InApplication'>In Application</label>
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
                <label htmlFor='DomainsFilterPanel_InVotingCommit'>In Voting Commit</label>
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
                <label htmlFor='DomainsFilterPanel_InVotingReveal'>In Voting Reveal</label>
              </li>
            </ul>
          </div>
          <div className='column sixteen wide'>
            <div className='Reset'>
              <a href onClick={this.resetFilters}>Reset</a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  onSearchInput (event) {
    const target = event.target
    const {name} = target

    const {filters} = this.state
    filters[name] = target.value

    this.setState(filters)
    this.onFiltersChange(filters)
  }

  onFilterChange (event) {
    const target = event.target
    const {name, checked} = target

    const {filters} = this.state
    filters[name] = checked

    this.setState(filters)

    this.onFiltersChange(filters)
  }

  resetFilters (event) {
    event.preventDefault()

    const filters = {
      domain: '',
      inRegistry: false,
      inApplication: false,
      inVotingCommit: false,
      inVotingReveal: false
    }

    this.setState({filters})
    this.onFiltersChange(filters)

    // TODO: react way of reseting defaultValue to null
    const field = document.querySelector('#DomainsFiltersPanelDomainSearch')
    if (field) {
      field.value = ''
    }
  }
}

/*
DomainsFilterPanel.propTypes = {
  filters: PropTypes.object,
  onFiltersChange: PropTypes.function
}
*/

export default DomainsFilterPanel
