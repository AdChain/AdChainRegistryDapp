import React, { Component } from 'react'
import PropTypes from 'prop-types'
import qs from 'qs'
import updateQuery from 'update-query'

import normalizeQueryObj from '../../utils/normalizeQueryObj'

// import RegistryStatsbar from './RegistryStatsbar'
// import AdtCalculator from '../AdtCalculator'
import DomainsTable from './DomainsTable'
import DomainsFilterPanel from './DomainsFilterPanel'
import WelcomeModal from '../WelcomeModal'
import RegistryGuideStaticChallenge from '../registry_guide/RegistryGuideStaticChallenge'
import RegistryGuideStaticInRegistry from '../registry_guide/RegistryGuideStaticInRegistry'
import RegistryGuideStaticVoting from '../registry_guide/RegistryGuideStaticVoting'
import RegistryGuideStaticReveal from '../registry_guide/RegistryGuideStaticReveal'
import RegistryGuideStaticDashboard from '../registry_guide/RegistryGuideStaticDashboard'
import DomainEmailNotifications from './DomainEmailNotifications'

import './DomainsContainer.css'

class DomainsContainer extends Component {
  constructor (props) {
    super()

    const query = qs.parse(props.location.search.substr(1))

    this.state = {
      query: normalizeQueryObj(query),
      history: props.history,
      tableFilters: [],
      staticContainer: null,
      kind: null,
      email: null
    }
    this.onQueryChange = this.onQueryChange.bind(this)
    this.updateTableFilters = this.updateTableFilters.bind(this)

    // Delay required for table to properly update with filters
    setTimeout(() => {
      this.updateTableFilters(query)
    }, 0)

    // scroll to top
    window.scrollTo(0, -1)
  }

  componentDidMount () {
    let returningUser = window.localStorage.getItem('returningUser')

    if (!returningUser || returningUser === 'false') {
      window.localStorage.setItem('returningUser', 'false')
    }
    const searchParams = new URLSearchParams(window.location.search)
    const kind = searchParams.get('kind')
    const email = searchParams.get('email')
    const listingHash = searchParams.get('')
    if (kind) {
      this.setState({
        kind: kind,
        email: email
      })
    }
  }

  componentWillReceiveProps (nextProps) {
    // if (nextProps.location.key === this.props.location.key) {
    const query = qs.parse(nextProps.location.search.substr(1))
    this.setState({
      query: normalizeQueryObj(query),
      staticContainer: nextProps.staticContainer
    })
    this.updateTableFilters(query)
    // }
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.staticContainer !== prevProps.staticContainer) {
      prevProps.resumeJoyride()
    }
  }

  render () {
    const {
      query,
      history,
      tableFilters,
      staticContainer,
      kind,
      email
    } = this.state

    return (
      <div className='DomainsContainer'>
        <div className='ui grid stackable padded'>
          {
            /* <div className='column ten wide NoPaddingBottom NoPaddingRight'>
            <RegistryStatsbar />
          </div>
          <div className='column six wide NoPaddingBottom'>
            <AdtCalculator />
          </div> */
          }
          <div className='column sixteen wide'>
            <div className='ui grid stackable'>
              <div className='column four wide NoPaddingRight'>
                {
                  (staticContainer === 'dashboard')
                    ? <RegistryGuideStaticDashboard />
                    : <DomainsFilterPanel
                      filters={query}
                      onFiltersChange={this.onQueryChange}
                    />
                }
                <DomainEmailNotifications history={history} kind={kind} email={email} />
              </div>
              {
                (staticContainer === 'challenge')
                  ? <div className='column six wide'>
                    <RegistryGuideStaticChallenge />
                  </div>
                  : (staticContainer === 'registry')
                    ? <div className='column six wide'>
                      <RegistryGuideStaticInRegistry />
                    </div>
                    : (staticContainer === 'voting')
                      ? <div className='column six wide'>
                        <RegistryGuideStaticVoting />
                      </div>
                      : (staticContainer === 'reveal')
                        ? <div className='column six wide'>
                          <RegistryGuideStaticReveal />
                        </div>
                        : <div className='column twelve wide'>
                          <DomainsTable
                            history={history}
                            filters={tableFilters}
                          />
                        </div>
              }
            </div>
            {
              // window.localStorage.returningUser === 'false' ? <WelcomeModal /> : null
            }
            <WelcomeModal />
          </div>
        </div>
      </div>
    )
  }

  // If you want to create/remove a filter, code pertaining to the domain
  // filters is located here, DomainsFilterPanel, and bottom of DomainsTable.
  // This function get passed down as props to DomainFiltersPanel.js.
  onQueryChange (query) {
    const url = window.location.href
    const newQuery = updateQuery(url, query)
    window.history.replaceState({}, window.location.pathname, newQuery)

    this.setState({query})
    this.updateTableFilters(query)
  }

  // React-table filter
  updateTableFilters (query) {
    const stageFilter = {
      id: 'stage',
      value: undefined
    }

    const domainFilter = {
      id: 'domain',
      value: undefined
    }

    let filter = []
    // TODO: better way
    for (let k in query) {
      if (query[k]) {
        if (k === 'inRegistry') {
          filter.push('in_registry')
        } else if (k === 'inApplication') {
          filter.push('in_application')
        } else if (k === 'inVoting') {
          filter.push('voting_commit')
          filter.push('voting_reveal')
        } else if (k === 'inVotingCommit') {
          filter.push('voting_commit')
        } else if (k === 'inVotingReveal') {
          filter.push('voting_reveal')
        } else if (k === 'rejected') {
          filter.push('rejected')
        } else if (k === 'withdrawn') {
          filter.push('withdrawn')
        } else if (k === 'domain') {
          domainFilter.value = query[k]
        }
      }
    }

    filter = new RegExp(filter.join('|'), 'gi')
    stageFilter.value = filter
    this.setState({tableFilters: [domainFilter, stageFilter]})
  }
}

DomainsContainer.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object
}

export default DomainsContainer
