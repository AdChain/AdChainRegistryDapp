import React, { Component } from 'react'
import Eth from 'ethjs'
import toastr from 'toastr'
import commafy from 'commafy'
import PubSub from 'pubsub-js'
import PropTypes from 'prop-types'
import { Button, Input, Segment } from 'semantic-ui-react'

import Tooltip from '../Tooltip'
import calculateGas from '../../utils/calculateGas'

import registry from '../../services/registry'
import DomainChallengeContainer from './DomainChallengeContainer'
import IndividualGuideModal from './IndividualGuideModal'

import './DomainInRegistryContainer.css'

const big = (number) => new Eth.BN(number.toString(10))
const tenToTheNinth = big(10).pow(big(9))

class DomainInRegistryContainer extends Component {
  constructor (props) {
    super()

    let displayChallengeModal = JSON.parse(window.localStorage.getItem('ChallengeGuide'))

    this.state = {
      domain: props.domain,
      account: registry.getAccount(),
      didClaim: false,
      minDeposit: null,
      doneWithdrawing: false,
      currentDeposit: null,
      stakedDifferenceUpdated: false,
      displayChallengeModal: !displayChallengeModal
    }

    this.withdrawListing = this.withdrawListing.bind(this)
    this.topOff = this.topOff.bind(this)
    this.withdrawADT = this.withdrawADT.bind(this)
  }

  componentDidMount () {
    this._isMounted = true
    this.getPoll()
    this.getMinDeposit()
  }

  componentWillUnmount () {
    this._isMounted = false
  }
  
  componentWillReceiveProps (next) {
    
    if (next.domainData) {
      this.setState({
        domainData: next.domainData,
        applicationExpiry: next.domainData.applicationExpiry,
      })
    }
  }

  render () {
    const {
      domain,
      account,
      minDeposit,
      doneWithdrawing,
      displayChallengeModal
    } = this.state

    const canWithdraw = (this.props.domainData.ownerAddress === account) ? true : false
    const currentDeposit = big(this.props.domainData.currentDeposit).div(tenToTheNinth)
    const stakedDifference = currentDeposit - minDeposit
    const formattedStakedDifference = stakedDifference ? stakedDifference > 0 ? '+' + commafy(stakedDifference) : commafy(stakedDifference) : 0
    const stakedDifferenceClass = stakedDifference > 0 ? 'StakedDifferencePositive' : stakedDifference < 0 ? 'StakedDifferenceNegative' : 'StakedDifferenceZero'

    let redirectState = this.props.redirectState ? this.props.redirectState.cameFromRedirect : false

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
            </div>
          </div>
          <div className='ui divider' />
          <DomainChallengeContainer domainData={this.props.domainData} domain={domain} source='InRegistry' currentDeposit={currentDeposit} />
          <div className='column sixteen wide center aligned'>
            { canWithdraw && !doneWithdrawing
              ? <div>
                <Segment className='LeftSegment' floated='left'>
                  <p>Remove listing for</p>
                  <span className='RequiredADT'>
                    <strong>{currentDeposit ? commafy(currentDeposit) : '0'} ADT</strong>
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
                    <div className='CurrentDeposit'><strong>{minDeposit ? commafy(minDeposit) : '0'} ADT</strong></div>
                  </div>
                  <div className='TopOffRow'>
                    <div className='StakedDifferenceLabel'>
                    Staked Difference:
                    </div>
                    <div className={stakedDifferenceClass}><strong>{stakedDifference ? formattedStakedDifference : '0'} ADT</strong></div>
                  </div>
                  <div className='TopOffLabel'>
                  Enter ADT Amount
                  </div>
                  <div className='ADTInputContainer'>
                    <Input type='number' placeholder='ADT' id='ADTAmount' className='ADTInput' min='0' />
                  </div>
                  <div className='DepositWithdrawButtonRow'>
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
                        onClick={this.withdrawADT}>Withdraw ADT</Button>
                    </div>
                  </div>
                </Segment>
              </div>
              : null
            }
          </div>
          {
            redirectState
              ? null
              : <IndividualGuideModal steps={'ChallengeGuide'} open={displayChallengeModal} />
          }
        </div>
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

  // async getReveal () {
  //   const {domain, account} = this.state

  //   if (!account) {
  //     return false
  //   }

  //   try {
  //     const didReveal = await registry.didReveal(domain)

  //     if (this._isMounted) {
  //       this.setState({
  //         didReveal: didReveal
  //       })
  //     }
  //   } catch (error) {
  //     console.error('Domain In Registry Container Get Reveal Error: ', error)
  //     toastr.error('There was an error with your request')
  //   }
  // }

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
      console.error('Domain In Registry Container Get Claims Error: ', error)
      toastr.error('There was an error with your request')
    }
  }

  async withdrawListing () {
    const {domain} = this.state

    try {
      let transactionInfo = {
        src: 'withdraw_listing',
        title: 'Withdraw Listing'
      }

      PubSub.publish('TransactionProgressModal.open', transactionInfo)
      await registry.exit(this.props.domainData.listingHash)
      this.setState({
        doneWithdrawing: true
      })
      PubSub.publish('DomainProfileActionContainer.getData')
      PubSub.publish('DomainProfileStageMap.updateStageMap')
      try {
        calculateGas({
          domain: domain,
          contract_event: true,
          event: 'exit',
          contract: 'registry',
          event_success: true
        })
      } catch (error) {
        console.log('error reporting gas')
      }
    } catch (error) {
      console.error('Domain In Registry Container Withdraw Listing Error: ', error)
      PubSub.publish('TransactionProgressModal.error')
      try {
        calculateGas({
          domain: domain,
          contract_event: true,
          event: 'exit',
          contract: 'registry',
          event_success: false
        })
      } catch (error) {
        console.log('error reporting gas')
      }
    }
  }

  async topOff () {
    const {domain, currentDeposit} = this.state

    const amount = document.getElementById('ADTAmount').value

    // Possibly include other verification checks
    if (parseInt(amount, 10) < 0) {
      toastr.error('You must enter a positive amount.')
      return
    }

    const stakedDeposit = parseInt(amount, 10) + parseInt(currentDeposit, 10)

    try {
      const {listingHash} = this.props.domainData

      await registry.deposit(listingHash, amount)
      if (this._isMounted) {
        this.setState({
          currentDeposit: stakedDeposit,
          stakedDifferenceUpdated: true
        })
        document.getElementById('ADTAmount').value = null
      }
      try {
        calculateGas({
          domain: domain,
          contract_event: true,
          event: 'top off',
          contract: 'registry',
          event_success: true
        })
      } catch (error) {
        console.log('error reporting gas')
      }
    } catch (error) {
      toastr.error('There was an error with your request')
      try {
        calculateGas({
          domain,
          contract_event: true,
          event: 'top off',
          contract: 'registry',
          event_success: false
        })
      } catch (error) {
        console.log('error reporting gas')
      }
    }
  }

  async withdrawADT () {
    const {domain, currentDeposit, minDeposit} = this.state

    const amount = document.getElementById('ADTAmount').value

    if (parseInt(currentDeposit, 10) - parseInt(amount, 10) < minDeposit) {
      toastr.error('You can only withdraw an amount of tokens that is less than or equal to the staked difference.')
      return
    }
    if (parseInt(amount, 10) < 0) {
      toastr.error('You must enter a positive amount.')
      return
    }

    try {
      let transactionInfo = {
        src: 'withdraw_ADT',
        title: 'Withdraw ADT'
      }
      const {listingHash} = this.props.domainData
      PubSub.publish('TransactionProgressModal.open', transactionInfo)
      await registry.withdraw(listingHash, amount)
      if (this._isMounted) {
        this.setState({
          currentDeposit: parseInt(currentDeposit, 10) - parseInt(amount, 10)
        })
        document.getElementById('ADTAmount').value = null
      }
      try {
        calculateGas({
          domain: domain,
          contract_event: true,
          event: 'withdraw',
          contract: 'registry',
          event_success: true
        })
      } catch (error) {
        console.log('error reporting gas')
      }
    } catch (error) {
      console.error(error)
      PubSub.publish('TransactionProgressModal.error')

      try {
        calculateGas({
          domain: domain,
          contract_event: true,
          event: 'withdraw',
          contract: 'registry',
          event_success: false
        })
      } catch (error) {
        console.log('error reporting gas')
      }
    }
  }
}

DomainInRegistryContainer.propTypes = {
  domain: PropTypes.string
}

export default DomainInRegistryContainer
