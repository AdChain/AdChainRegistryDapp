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
import { AirSwap } from '../airswap/AirSwap'
import RegistryGuideStaticChallenge from '../registry_guide/RegistryGuideStaticChallenge'
import RegistryGuideStaticInRegistry from '../registry_guide/RegistryGuideStaticInRegistry'
import RegistryGuideStaticVoting from '../registry_guide/RegistryGuideStaticVoting'
import RegistryGuideStaticReveal from '../registry_guide/RegistryGuideStaticReveal'
import RegistryGuideStaticDashboard from '../registry_guide/RegistryGuideStaticDashboard'
import RegistryGuideStaticDomainsTable from '../registry_guide/RegistryGuideStaticDomainsTable'
import DomainEmailNotifications from './DomainEmailNotifications'
import { registryApiURL } from '../../models/urls'
import PubSub from 'pubsub-js'

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
    this.getDomainName = this.getDomainName.bind(this)
    this.updateStaticContainer = this.updateStaticContainer.bind(this)

    // Delay required for table to properly update with filters
    setTimeout(() => {
      this.updateTableFilters(query)
    }, 10)

    // scroll to top
    window.scrollTo(0, -1)
  }

  async componentDidMount () {
    let returningUser = window.localStorage.getItem('returningUser')

    if (!returningUser || returningUser === 'false') {
      window.localStorage.setItem('returningUser', 'false')
    }
    const searchParams = new URLSearchParams(window.location.search)
    let kind = searchParams.get('kind')
    kind = kind ? kind.toLowerCase() : null
    const email = searchParams.get('email')
    const listingHash = searchParams.get('listingHash')

    if (kind) {
      if (listingHash) {
        const domain = await this.getDomainName(listingHash)
        this.state.history.push(`/domains/${domain}`)
      } else if (kind.includes('challenge')) {
        this.state.history.push('/')
      } else if (kind.includes('param')) {
        this.state.history.push('/governance')
      } else {
        this.setState({
          kind: kind,
          email: email
        })
      }
    }
  }

  componentWillMount () {
    this.updateStaticContainerEvent = PubSub.subscribe('DomainsContainer.updateStaticContainer', this.updateStaticContainer)
  }

  componentWillReceiveProps (nextProps) {
    // if (nextProps.location.key === this.props.location.key) {
    const query = qs.parse(nextProps.location.search.substr(1))
    this.setState({
      query: normalizeQueryObj(query)
    })
    this.updateTableFilters(query)
    // }
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.staticContainer !== prevState.staticContainer) {
      PubSub.publish('RegistryWalkthrough.resumeJoyride')
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
                <AirSwap />
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
                        : (staticContainer === 'applicationDomains')
                          ? <div className='column twelve wide'>
                            <RegistryGuideStaticDomainsTable source={'application'} />
                          </div>
                          : (staticContainer === 'commitDomains')
                            ? <div className='column twelve wide'>
                              <RegistryGuideStaticDomainsTable source={'commit'} />
                            </div>
                            : (staticContainer === 'revealDomains')
                              ? <div className='column twelve wide'>
                                <RegistryGuideStaticDomainsTable source={'reveal'} />
                              </div>
                              : <div className='column twelve wide DomainsTableColumns no-mobile-padding'>
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

  async getDomainName (listingHash) {
    const result = await (await window.fetch(`${registryApiURL}/registry/listing_hash?listing_hash=${listingHash}`)).json()
    return result.domain
  }

  updateStaticContainer (topic, staticContainer = null) {
    this.setState({
      staticContainer: staticContainer
    })
    // if (!staticContainer) {
    //   const query = qs.parse(this.props.location.search.substr(1))
    //   this.setState({
    //     query: normalizeQueryObj(query)
    //   })
    //   this.updateTableFilters(query)
    // }
  }
}

DomainsContainer.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object
}

export default DomainsContainer
