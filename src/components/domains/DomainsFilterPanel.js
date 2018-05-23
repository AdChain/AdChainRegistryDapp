import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PubSub from 'pubsub-js'
import commafy from 'commafy'
import Tooltip from '../Tooltip'
import store from '../../store'
import isMobile from 'is-mobile'
// import token from '../../services/token'
import filterIcon from "../../components/assets/filter_icon.svg"
import { Input } from 'semantic-ui-react'
import { registryApiURL } from '../../models/urls'


import './DomainsFilterPanel.css'

class DomainsFilterPanel extends Component {
  constructor(props) {
    super()

    this.state = {
      filters: props.filters,
      totalStaked: 0,
      inApplication: 0,
      inCommit: 0,
      inReveal: 0,
      inRegistry: 0,
      withdrawn: 0,
      rejected: 0,
      fetching: false,
      showFilters: !isMobile(),
      toggle: true
    }

    this.onSearchInput = this.onSearchInput.bind(this)
    this.onFilterChange = this.onFilterChange.bind(this)
    this.onFiltersChange = props.onFiltersChange.bind(this)
    this.resetFilters = this.resetFilters.bind(this)

    // this.fetchStats()
  }

  componentDidMount() {
    this._isMounted = true

    this.fetchStats()
    store.subscribe(x => {
      this.fetchStats()
    })
    this.toggleEvent = PubSub.subscribe("DomainsFilterPanel.toggle", this.toggle.bind(this))
  }

  componentWillReceiveProps(props) {
    if (this._isMounted) {
      this.setState({
        filters: props.filters
      })
    }
  }
  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    const {
      toggle,
      filters,
      inApplication,
      inCommit,
      inReveal,
      inRegistry,
      withdrawn,
      rejected,
      showFilters,
    } = this.state

    return (
      <div className={toggle ? 'DomainsFilterPanel BoxFrame' :'hide'}>
        <div className='ui grid stackable'>
          <div className='SearchContainer column sixteen wide'>
            <span className='BoxFrameLabel ui grid mobile-hide'>DOMAIN FILTERS <Tooltip info={'The fields in this box filter the user view in the DOMAINS table.'} /></span>
            <div className='SearchTitle mobile-hide'>
              Search Domains
            </div>
            <div>
              <Input
                icon='search'
                iconPosition='left'
                placeholder='SEARCH DOMAIN'
                name='domain'
                id='DomainsFiltersPanelDomainSearch'
                defaultValue={filters.domain}
                onKeyUp={this.onSearchInput}
                type='text' />
            </div>
            <img className={isMobile() ? 'FilterIcon': 'hide'} onClick={() => { this.toggleFilters() }} src={filterIcon} alt='filter'/>
          </div>
          <div className={showFilters ? '' : 'hide'}>
            <div className='ListTitle'>
              FILTERS
            </div >
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
                  <span className='f-grey f-12 f-os'>({inRegistry != null ? commafy(inRegistry) : '-'})</span>
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
                  <span className='f-grey f-12 f-os'>({inApplication != null ? commafy(inApplication) : '-'})</span>

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
                  <span className='f-grey f-12 f-os'>({inCommit != null ? commafy(inCommit) : '-'})</span>
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
                  <span className='f-grey f-12 f-os'>({inReveal != null ? commafy(inReveal) : '-'})</span>
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
                  <span className='f-grey f-12 f-os'>({rejected != null ? commafy(rejected) : '-'})</span>
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
                  <span className='f-grey f-12 f-os'>({withdrawn != null ? commafy(withdrawn) : '-'})</span>
                  </li>
                </ul>
              </div>
            </div>
          <div className='Reset'>
            <a href onClick={this.resetFilters}>Reset</a>
          </div>
          </div>
        </div>
      </div>

    )
  }
  toggle(){
    this.setState({
      toggle: !this.state.toggle
    })
  }

  onSearchInput(event) {
    const target = event.target
    const { name } = target
    const { filters } = this.state
    filters[name] = target.value

    if (this._isMounted) {
      this.setState(filters)
    }
    this.onFiltersChange(filters)
  }

  onFilterChange(event) {
    const target = event.target
    const { name, checked } = target

    const { filters } = this.state
    filters[name] = checked
    if (this._isMounted) {
      this.setState({ filters })
    }
    this.onFiltersChange(filters)
  }

  resetFilters(event) {
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
      this.setState({ filters })
    }
    this.onFiltersChange(filters)

    // TODO: react way of reseting defaultValue to null
    const field = document.querySelector('#DomainsFiltersPanelDomainSearch')
    if (field) {
      field.value = ''
    }
  }

  toggleFilters() {
    this.setState({
      showFilters: !this.state.showFilters
    })
  }

  async fetchStats() {
    if (this.state.fetching === true) {
      return null
    }

    if (this._isMounted) {
      this.setState({ fetching: true })
    }

    try {
      // let totalStaked = await (await window.fetch(`${registryApiURL}/registry/domains/stake/count`)).json()
      const {
        inRegistry,
        inApplication,
        inCommit,
        inReveal,
        rejected,
        withdrawn
      } = await (await window.fetch(`${registryApiURL}/registry/domains/count`)).json()

      if (this._isMounted) {
        this.setState({
          // totalStaked,
          inApplication,
          inCommit,
          inReveal,
          inRegistry,
          withdrawn,
          rejected,
          fetching: false
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
