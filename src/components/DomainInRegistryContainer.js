import React, { Component } from 'react'
import PropTypes from 'prop-types'
import toastr from 'toastr'
import { Button, Input, Segment } from 'semantic-ui-react'
import commafy from 'commafy'
import Tooltip from './Tooltip'

import registry from '../services/registry'
import './DomainInRegistryContainer.css'
import DomainChallengeInProgressContainer from './DomainChallengeInProgressContainer'
import WithdrawInProgressContainer from './WithdrawInProgressContainer'
import TopOffInProgressContainer from './TopOffInProgressContainer'
import DomainChallengeContainer from './DomainChallengeContainer'
import Eth from 'ethjs'

const big = (number) => new Eth.BN(number.toString(10))
const tenToTheNinth = big(10).pow(big(9))

class DomainInRegistryContainer extends Component {
  constructor (props) {
    super()

    this.state = {
      domain: props.domain,
      account: registry.getAccount(),
      didReveal: false,
      didClaim: false,
      inChallengeProgress: false,
      inWithdrawProgress: false,
      inTopOffProgress: false,
      minDeposit: null,
      canWithdraw: false,
      currentDeposit: null
    }

    this.onChallenge = this.onChallenge.bind(this)
    this.withdrawListing = this.withdrawListing.bind(this)
    this.topOff = this.topOff.bind(this)
    this.updateStatus = this.updateStatus.bind(this)
    this.updateStageMap = props.updateStageMap
  }

  componentDidMount () {
    this._isMounted = true

    this.getPoll()
    this.getReveal()
    // this.getClaims()
    this.getMinDeposit()
    this.getCurrentDeposit()
    this.checkOwner()
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  render () {
    const {
      domain,
      inChallengeProgress,
      inWithdrawProgress,
      inTopOffProgress,
      minDeposit,
      canWithdraw,
      currentDeposit
    } = this.state

    const stakedDifference = minDeposit - currentDeposit
    const stakedDifferenceClass = stakedDifference > 0 ? 'StakedDifferenceNegative' : stakedDifference < 0 ? 'StakedDifferencePositive' : 'StakedDifferenceZero'

    // const hasVotes = (votesFor || votesAgainst)

    return (
      <div className='DomainInRegistryContainer'>
        <div className='ui grid stackable'>
          <div className='column sixteen wide HeaderColumn'>
            <div className='row HeaderRow'>
              <div className='ui large header'>
              Stage: In Registry
                <Tooltip
                  info='The first phase of the voting process is the commit phase where the ADT holder stakes a hidden amount of votes to SUPPORT or OPPOSE the domain application. The second phase is the reveal phase where the ADT holder reveals the staked amount of votes to either the SUPPORT or OPPOSE side.'
                />
              </div>
              <Button
                basic
                className='right refresh'
                onClick={this.updateStatus}
              >
                Refresh Status
              </Button>
            </div>
          </div>
          <div className='ui divider' />
          <DomainChallengeContainer domain={domain} source='InRegistry' />
          <div className='column sixteen wide center aligned'>
            { canWithdraw
              ? <div>
                <Segment className='LeftSegment' floated='left'>
                  <p>Remove listing for</p>
                  <span className='RequiredADT'>
                    <strong>{currentDeposit ? commafy(currentDeposit) : '-'} ADT</strong>
                  </span>
                  <p className='RemoveInfo'>
                  Withdrawing your listing completely removes it from the adchain Registry and reimburses you the ADT amount above.
                  </p>
                  <div className='RemoveButtonContainer'>
                    <Button
                      className='RemoveButton'
                      basic
                      onClick={this.withdrawListing}>Remove Listing</Button>
                  </div>
                </Segment>
                <Segment className='RightSegment' floated='right'>
                  <div className='TopOffRow'>
                    <div className='CurrentDepositLabel'>
                  Current minDeposit:
                    </div>
                    <div className='CurrentDeposit'><strong>{minDeposit ? commafy(minDeposit) : '-'} ADT</strong></div>
                  </div>
                  <div className='TopOffRow'>
                    <div className='StakedDifferenceLabel'>
                    Staked Difference:
                    </div>
                    <div className={stakedDifferenceClass}><strong>{stakedDifference ? commafy(stakedDifference) : '-'} ADT</strong></div>
                  </div>
                  <div className='TopOffLabel'>
                  Enter ADT Amount
                  </div>
                  <div className='TopOffInputContainer'>
                    <Input type='number' placeholder='ADT' id='TopOff' className='TopOffInput' />
                  </div>
                  <div className='TopOffButtonContainer'>
                    <Button
                      className='TopOffButton'
                      basic
                      onClick={this.topOff}>Deposit ADT</Button>
                  </div>
                  <div className='WithdrawButtonContainer'>
                    <Button
                      className='WithdrawButton'
                      basic
                      onClick={this.topOff}>Withdraw ADT</Button>
                  </div>
                </Segment>
              </div>
              : null
            }
          </div>
        </div>
        {inChallengeProgress ? <DomainChallengeInProgressContainer /> : null}
        {inWithdrawProgress ? <WithdrawInProgressContainer /> : null}
        {inTopOffProgress ? <TopOffInProgressContainer /> : null}
      </div>
    )
  }

  async getMinDeposit () {
    if (this._isMounted) {
      this.setState({
        minDeposit: (await registry.getMinDeposit()).toNumber()
      })
    }
  }

  async getReveal () {
    const {domain, account} = this.state

    if (!account) {
      return false
    }

    try {
      const didReveal = await registry.didReveal(domain)

      if (this._isMounted) {
        this.setState({
          didReveal: didReveal
        })
      }
    } catch (error) {
      toastr.error('There was an error with your request')
    }
  }

  async getPoll () {
    const {domain} = this.state

    try {
      const {
        votesFor,
        votesAgainst
      } = await registry.getChallengePoll(domain)

      if (this._isMounted) {
        this.setState({
          votesFor,
          votesAgainst
        })
      }
    } catch (error) {

    }
  }

  async getClaims () {
    const {domain, account} = this.state

    if (!account) {
      return false
    }

    try {
      const claimed = await registry.didClaim(domain)

      if (this._isMounted) {
        this.setState({
          didClaim: claimed
        })
      }
    } catch (error) {
      toastr.error('There was an error with your request')
    }
  }

  onChallenge (event) {
    event.preventDefault()

    this.challenge()
  }

  async checkOwner () {
    const {domain, account} = this.state

    try {
      const listing = await registry.getListing(domain)
      if (listing.ownerAddress === account) {
        this.setState({
          canWithdraw: true
        })
      }
    } catch (error) {
      toastr.error('There was an error with your request')
    }
  }

  async updateStatus () {
    const {domain} = this.state
    try {
      await registry.updateStatus(domain)
    } catch (error) {
      toastr.error('There was an error updating status')
      console.error(error)
    }
  }

  async getCurrentDeposit () {
    const {domain} = this.state
    try {
      const listing = await registry.getListing(domain)
      if (listing.currentDeposit) {
        this.setState({
          currentDeposit: big(listing.currentDeposit).div(tenToTheNinth)
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  async withdrawListing () {
    const {domain} = this.state

    if (this._isMounted) {
      this.setState({
        inWithdrawProgress: true
      })
    }

    try {
      await registry.exit(domain)
      this.setState({
        canWithdraw: false
      })
      toastr.success('Successfully withdrew listing')
      if (this._isMounted) {
        this.setState({
          inWithdrawProgress: false
        })
      }
    } catch (error) {
      toastr.error('There was an error with your request')
      if (this._isMounted) {
        this.setState({
          inWithdrawProgress: false
        })
      }
    }
  }

  async topOff () {
    const {domain, currentDeposit} = this.state
    const amount = document.getElementById('TopOff').value

    // Possibly include other verification checks

    if (this._isMounted) {
      this.setState({
        inTopOffProgress: true
      })
    }

    try {
      await registry.deposit(domain, amount)
      if (this._isMounted) {
        this.setState({
          currentDeposit: parseInt(amount, 10) + parseInt(currentDeposit, 10),
          inTopOffProgress: false
        })
        document.getElementById('TopOff').value = null
      }
    } catch (error) {
      toastr.error('There was an error with your request')
      this.setState({
        inTopOffProgress: false
      })
    }
  }

  async challenge () {
    const {domain} = this.state

    let inApplication = null

    try {
      inApplication = await registry.applicationExists(domain)
    } catch (error) {
      toastr.error('There was an error with your request')
    }

    if (inApplication) {
      if (this._isMounted) {
        this.setState({
          inChallengeProgress: true
        })
      }

      try {
        await registry.challenge(domain)

        toastr.success('Successfully challenged domain')

        if (this._isMounted) {
          this.setState({
            inChallengeProgress: false
          })
        }

        // TODO: better way of resetting state
        setTimeout(() => {
          window.location.reload()
        }, 2e3)
      } catch (error) {
        toastr.error('There was an error with your request')
        if (this._isMounted) {
          this.setState({
            inChallengeProgress: false
          })
        }
      }
    } else {
      toastr.error('Domain not in application')
    }
  }
}

DomainInRegistryContainer.propTypes = {
  domain: PropTypes.string
}

export default DomainInRegistryContainer
