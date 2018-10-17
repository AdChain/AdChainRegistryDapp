import React, { Component } from 'react'
import PropTypes from 'prop-types'
import toastr from 'toastr'

import store from '../../store'
import registry from '../../services/registry'
import AccountStatsbar from './AccountStatsbar'
import ExpiredVotingADT from './ExpiredVotingADT'
import RequestTokenApprovalContainer from './RequestTokenApprovalContainer.js'
import RequestVotingRightsContainer from './RequestVotingRightsContainer.js'
import WithdrawVotingRightsContainer from './WithdrawVotingRightsContainer.js'
import UserAppliedDomains from './UserAppliedDomains.js'
import UserChallengedDomains from './UserChallengedDomains.js'
import UserCommitsToReveal from './UserCommitsToReveal.js'
import UserRewardsToClaim from './UserRewardsToClaim.js'
import AccountDashboardLoadingInProgress from './AccountDashboardLoadingInProgress'
import Tooltip from '../Tooltip'
import getDomainState from '../../utils/getDomainState'
import { registryApiURL } from '../../models/urls'

import Eth from 'ethjs'
import _ from 'lodash'

import './AccountDashboard.css'

const big = (number) => new Eth.BN(number.toString(10))
const tenToTheNinth = big(10).pow(big(9))

class AccountDashboard extends Component {
  constructor (props) {
    super()

    this.state = {
      history: props.history,
      account: '',
      appliedDomains: [],
      challengedDomains: [],
      commitsToReveal: [],
      rewards: [],
      inProgress: false
    }

    this.fetchAppliedDomains = this.fetchAppliedDomains.bind(this)
    this.fetchChallengedDomains = this.fetchChallengedDomains.bind(this)
    this.fetchCommitsToReveal = this.fetchCommitsToReveal.bind(this)
    this.fetchRewards = this.fetchRewards.bind(this)
    this.fetchDomainStage = this.fetchDomainStage.bind(this)
    this.fetchWithdrawn = this.fetchWithdrawn.bind(this)
  }

  componentWillMount () {
    this.setState({
      account: registry.getAccount() || '0x0'
    })
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  async componentDidMount () {
    this._isMounted = true

    if (this._isMounted) {
      this.setState({
        inProgress: true
      })
    }
    let withdrawn = await this.fetchWithdrawn()
    await this.fetchAppliedDomains(withdrawn)
    await this.fetchChallengedDomains(withdrawn)
    await this.fetchCommitsToReveal()
    await this.fetchRewards()

    if (this._isMounted) {
      this.setState({
        inProgress: false
      })
    }

    store.subscribe(() => {
      if (!this.state.account) {
        const account = registry.getAccount()
        this.setState({
          account
        })
      }
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
          <div className='row NoPaddingBottom f-13'>
            <div className='column five wide NoPaddingRight'>
              <RequestTokenApprovalContainer account={account} />
            </div>
            <div className='column eleven wide TokensUsedForVoting'>
              <div className='BoxFrame'>
                <span className='ui grid BoxFrameLabel'>PRE-APPROVE TOKENS FOR VOTING<Tooltip info={'Pre-Approve Voting Rights to reduce the number of MetaMask transactions.'} /></span>
                <div className='ui grid'>
                  <div className='row f-13 VotingUtilitiesRow'>
                    <RequestVotingRightsContainer account={account} contract={'registry'} />
                    <ExpiredVotingADT account={account} contract={'registry'} />
                    <WithdrawVotingRightsContainer account={account} contract={'registry'} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {
            inProgress
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
              </div>
          }
        </div>
      </div>
    )
  }

  async fetchDomainStage (domainData, withdrawn) {
    try {
      let domainState = await getDomainState(domainData)

      // If rejected --> Check to see if listing is withdrawn
      if (domainState.stage === 'rejected') {
        if (withdrawn[domainState.listingHash]) {
          domainState.label = <span><i className='icon sign out alternate' />Withdrawn</span>
        }
      }

      return domainState.label
    } catch (error) {
      console.error(error)
    }
  }

  async fetchWithdrawn () {
    try{
      let withdrawn = await (await window.fetch(`${registryApiURL}/registry/domains?filter=withdrawn`)).json()
      // Create a hash map of hashes so lookup is faster
      withdrawn = _.keyBy(withdrawn, 'domainHash')
      return withdrawn
    }catch(error){
      console.log(error, "did not fetch withdrawn")
      return []
    }
  }

  async fetchAppliedDomains (withdrawn) {
    const { account } = this.state

    if (!account || account === '0x0') {
      return null
    }

    try {
      const response = await window.fetch(`${registryApiURL}/registry/domains?account=${account}&include=applied`)
      const data = await response.json()
      let appliedDomains = []

      for (let i = 0; i < data.length; i++) {
        let domainExists = false
        if (data[i]) {
          for (let j = 0; j < appliedDomains.length; j++) {
            if (data[i].domain === appliedDomains[j].domain) {
              domainExists = true
              break
            }
          }
          if (!domainExists) {
            try {
              data[i].stage = await this.fetchDomainStage(data[i], withdrawn)
              appliedDomains.push(data[i])
            } catch (error) {
              console.log('Error fetching stage')
            }
          }
        }
      }
      if (this._isMounted) {
        this.setState({
          appliedDomains
        })
      }
    } catch (error) {
      console.error(error)
      toastr.error('Error getting data for applied domains')
      if (this._isMounted) {
        this.setState({
          appliedDomains: []
        })
      }
    }
  }

  async fetchChallengedDomains (withdrawn) {
    const { account } = this.state

    if (!account || account === '0x0') {
      return false
    }

    try {
      const response = await window.fetch(`${registryApiURL}/registry/domains?account=${account}&include=challenged`)
      const data = await response.json()

      for (let i = 0; i < data.length; i++) {
        if (data[i]) {
          data[i].stage = await this.fetchDomainStage(data[i], withdrawn)
        }
      }

      if (this._isMounted) {
        if (!data.error) {
          this.setState({
            challengedDomains: data
          })
        } else {
          this.setState({
            challengedDomains: []
          })
        }
      }
    } catch (error) {
      console.error(error)
      toastr.error('Error getting data for challenged domains')
      if (this._isMounted) {
        this.setState({
          challengedDomains: []
        })
      }
    }
  }

  async fetchCommitsToReveal () {
    const { account } = this.state

    if (!account || account === '0x0') {
      return false
    }
    try {
      const response = await window.fetch(`${registryApiURL}/account/rewards?account=${account}&status=revealing`)
      const data = await response.json()
      if (this._isMounted) {
        if (!data.error) {
          this.setState({
            commitsToReveal: data
          })
        } else {
          this.setState({
            commitsToReveal: []
          })
        }
      }
    } catch (error) {
      console.error(error)
      toastr.error('Error getting data for domains to reveal')
      if (this._isMounted) {
        this.setState({
          commitsToReveal: []
        })
      }
    }
  }

  async fetchRewards () {
    const { account } = this.state

    if (!account || account === '0x0') {
      return false
    }
    try {
      const response = await window.fetch(`${registryApiURL}/account/rewards?account=${account}&status=unclaimed`)
      let data = await response.json()

      for (let i = 0; i < data.length; i++) {
        let reward = await registry.calculateVoterReward(data[i].sender, data[i].challenge_id, data[i].salt)
        data[i].reward = big(reward).div(tenToTheNinth).words[0]
      }
      if (this._isMounted) {
        if (!data.error) {
          this.setState({
            rewards: data
          })
        } else {
          this.setState({
            rewards: []
          })
        }
      }
    } catch (error) {
      console.error(error)
      toastr.error('Error getting data for rewards to claim')
      if (this._isMounted) {
        this.setState({
          rewards: []
        })
      }
    }
  }
}

AccountDashboard.propTypes = {
  history: PropTypes.object
}

export default AccountDashboard
