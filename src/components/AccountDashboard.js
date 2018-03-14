import React, { Component } from 'react'
import PropTypes from 'prop-types'
import toastr from 'toastr'

import store from '../store'
import registry from '../services/registry'
import AccountStatsbar from './AccountStatsbar'
import RescueTokens from './RescueTokens'
import RequestTokenApprovalContainer from './RequestTokenApprovalContainer.js'
import RequestVotingRightsContainer from './RequestVotingRightsContainer.js'
import WithdrawVotingRightsContainer from './WithdrawVotingRightsContainer.js'
import UserAppliedDomains from './UserAppliedDomains.js'
import UserChallengedDomains from './UserChallengedDomains.js'
import UserCommitsToReveal from './UserCommitsToReveal.js'
import UserRewardsToClaim from './UserRewardsToClaim.js'
import AccountDashboardLoadingInProgress from './AccountDashboardLoadingInProgress'

import Eth from 'ethjs'
import _ from 'lodash'

import './AccountDashboard.css'

const url = 'https://adchain-registry-api-staging.metax.io/'
const big = (number) => new Eth.BN(number.toString(10))
const tenToTheNinth = big(10).pow(big(9))

class AccountDashboard extends Component {
  constructor (props) {
    super()

    this.state = {
      history: props.history,
      account: null,
      tableFilters: [],
      query: {},
      appliedDomains: [],
      challengedDomains: [],
      commitsToReveal: [],
      rewards: [],
      inProgress: false
    }

    const account = registry.getAccount()

    if (account) {
      this.state.account = account
    }

    this.state.tableFilters = [{id: 'account', value: account || '0x0'}]
    this.onQueryChange = this.onQueryChange.bind(this)
    this.updateTableFilters = this.updateTableFilters.bind(this)
    this.fetchAppliedDomains = this.fetchAppliedDomains.bind(this)
    this.fetchChallengedDomains = this.fetchChallengedDomains.bind(this)
    this.fetchCommitsToReveal = this.fetchCommitsToReveal.bind(this)
    this.fetchRewards = this.fetchRewards.bind(this)
    this.fetchDomainStage = this.fetchDomainStage.bind(this)
  }

  async componentDidMount () {
    this.setState({
      inProgress: true
    })
    await this.fetchAppliedDomains()
    await this.fetchChallengedDomains()
    await this.fetchCommitsToReveal()
    await this.fetchRewards()

    store.subscribe(() => {
      if (!this.state.account) {
        const account = registry.getAccount()
        this.setState({
          account
        })

        this.updateTableFilters()
      }
    })
    this.setState({
      inProgress: false
    })
  }

  render () {
    const {
      account,
      appliedDomains,
      challengedDomains,
      commitsToReveal,
      rewards,
      history,
      inProgress
    } = this.state

    return (
      <div className='AccountDashboard'>
        <div className='ui grid stackable padded'>
          <div className='column sixteen wide NoPaddingBottom'>
            <AccountStatsbar account={account} />
          </div>
          <div className='row NoPaddingBottom'>
            <div className='column five wide NoPaddingRight'>
              <RequestTokenApprovalContainer account={account} />
            </div>
            <div className='column five wide NoPaddingRight'>
              <RequestVotingRightsContainer account={account} />
            </div>
            <div className='column six wide'>
              <WithdrawVotingRightsContainer account={account} />
            </div>
          </div>
          { inProgress
            ? <AccountDashboardLoadingInProgress />
            : <div className='row DomainsRow'>
              <div className='column wide UserAppliedDomainsContainer'>
                <UserAppliedDomains appliedDomains={appliedDomains} history={history} />
              </div>
              <div className='column wide UserChallengedDomainsContainer NoPaddingRight'>
                <UserChallengedDomains challengedDomains={challengedDomains} history={history} />
              </div>
              <div className='column UserCommitsToRevealContainer wide NoPaddingRight'>
                <UserCommitsToReveal commitsToReveal={commitsToReveal} history={history} />
              </div>
              <div className='column UserRewardsToClaimContainer wide'>
                <UserRewardsToClaim rewards={rewards} history={history} />
              </div>
              <div className='column six wide'>
                <RescueTokens account={account} />
              </div>
            </div>
          }
        </div>
      </div>
    )
  }

  // React-table filter
  updateTableFilters () {
    let {query, account} = this.state

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
        } else if (k === 'domain') {
          domainFilter.value = query[k]
        }
      }
    }

    filter = new RegExp(filter.join('|'), 'gi')
    stageFilter.value = filter

    // 0x0 is for showing no rows if no account found (other empty account means show all)
    const accountFilter = {id: 'account', value: account || '0x0'}

    this.setState({tableFilters: [domainFilter, stageFilter, accountFilter]})
  }

  onQueryChange (query) {
    this.setState({query})

    console.log(query)
    this.updateTableFilters()
  }

  async fetchDomainStage (domain) {
    let listing
    try {
      listing = await registry.getListing(domain)
    } catch (error) {
      console.log('Error fetching domains')
      return false
    }
    let stage = ''

    const {
      applicationExpiry,
      isWhitelisted,
      challengeId
    } = listing

    const applicationExists = !!applicationExpiry
    const challengeOpen = (challengeId === 0 && !isWhitelisted && applicationExpiry)
    const commitOpen = await registry.commitStageActive(domain)
    const revealOpen = await registry.revealStageActive(domain)
    const isInRegistry = (isWhitelisted && !commitOpen && !revealOpen)

    if (isInRegistry) {
      stage = 'In Registry'
    } else if (challengeOpen) {
      stage = 'In Application'
    } else if (commitOpen) {
      stage = 'Voting - Commit'
    } else if (revealOpen) {
      stage = 'Voting - Reveal'
    } else if (applicationExists) {
      stage = 'View'
    } else {
      stage = 'Apply'
    }

    return stage
  }

  async fetchAppliedDomains () {
    const { account } = this.state

    if (!account) {
      return false
    }

    const response = await window.fetch(`${url}/registry/domains?account=${account}&include=applied`)
    const data = await response.json()

    for (let i = 0; i < data.length; i++) {
      if (data[i]) {
        data[i].stage = await this.fetchDomainStage(data[i].domain)
      }
    }

    this.setState({
      appliedDomains: data
    })
  }

  async fetchChallengedDomains () {
    const { account } = this.state

    if (!account) {
      return false
    }

    const response = await window.fetch(`${url}/registry/domains?account=${account}&include=challenged`)
    const data = await response.json()

    for (let i = 0; i < data.length; i++) {
      if (data[i]) {
        data[i].stage = await this.fetchDomainStage(data[i].domain)
      }
    }

    this.setState({
      challengedDomains: data
    })
  }

  async fetchCommitsToReveal () {
    const { account } = this.state

    if (!account) {
      return false
    }
    try {
      const response = await window.fetch(`${url}/registry/domains?account=${account}&filter=inreveal`)
      const data = await response.json()
      this.setState({
        commitsToReveal: data
      })
    } catch (error) {
      toastr.error('Error getting dashboard data')
      this.setState({
        commitsToReveal: []
      })
    }
  }

  async fetchRewards () {
    const { account } = this.state

    if (!account) {
      return false
    }
    try {
      const response = await window.fetch(`${url}/account/rewards?account=${account}`)
      let data = await response.json()

      data = _.filter(data, (domain) => domain.status === 'unclaimed')
      for (let i = 0; i < data.length; i++) {
        let reward = await registry.calculateVoterReward(data[i].sender, data[i].challenge_id, data[i].salt)
        data[i].reward = big(reward).div(tenToTheNinth).words[0]
      }
      this.setState({
        rewards: data
      })
    } catch (error) {
      console.log('Error fetching rewards')
    }
  }
}

AccountDashboard.propTypes = {
  history: PropTypes.object
}

export default AccountDashboard
