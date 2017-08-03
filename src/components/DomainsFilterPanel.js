import React, { Component } from 'react'

import './DomainsFilterPanel.css'

class DomainsFilterPanel extends Component {
  constructor (props) {
    super()

    this.state = {
      filters: props.filters
    }

    this.onFilterChange = this.onFilterChange.bind(this)
    this.onFiltersChange = props.onFiltersChange.bind(this)
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
              <input type='text' placeholder='Search Domain' />
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
                    id='DomainsFilterPanel_InVoting'
                    name='inVoting'
                    checked={!!filters.inVoting}
                    onChange={this.onFilterChange}
                  />
                </div>
                <label htmlFor='DomainsFilterPanel_InVoting'>In Voting</label>
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
                <label htmlFor='DomainsFilterPanel_Rejected'>Rejected</label>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  onFilterChange (event) {
    const target = event.target
    const {name, checked} = target

    const {filters} = this.state
    filters[name] = checked

    this.setState(filters)

    this.onFiltersChange(filters)
  }
}

export default DomainsFilterPanel
