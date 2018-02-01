import React, { Component } from 'react'
import PropTypes from 'prop-types'
import commafy from 'commafy'
import toastr from 'toastr'
import moment from 'moment'
import { Popup, Button, Segment } from 'semantic-ui-react'

import Countdown from './CountdownText'
import registry from '../services/registry'
import DomainChallengeInProgressContainer from './DomainChallengeInProgressContainer'

import './DomainChallengeContainer.css'

class DomainChallengeContainer extends Component {
  constructor (props) {
    super()

    this.state = {
      domain: props.domain,
      applicationExpiry: null,
      minDeposit: null,
      currentDeposit: null,
      inProgress: false
    }
  }

  componentDidMount () {
    this._isMounted = true

    this.getMinDeposit()
    this.getListing()
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  render () {
    const {
      domain,
      applicationExpiry,
      minDeposit,
      inProgress
    } = this.state

    const stageEndMoment = applicationExpiry ? moment.unix(applicationExpiry) : null
    const stageEnd = stageEndMoment ? stageEndMoment.format('YYYY-MM-DD HH:mm:ss') : '-'

    return (
      <div className='DomainChallengeContainer'>
        <div className='ui grid stackable'>
          <div className='column sixteen wide HeaderColumn'>
            <div className='row HeaderRow'>
              <div className='ui large header'>
              Stage: In Application
              <Popup
                trigger={<i className='icon info circle' />}
                content='The first phase of the voting process is the commit phase where the ADT holder stakes a hidden amount of votes to SUPPORT or OPPOSE the domain application. The second phase is the reveal phase where the ADT holder reveals the staked amount of votes to either the SUPPORT or OPPOSE side.'
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
          <div className='column sixteen wide center aligned'>
            <div className='ui message info'>
              <p>Challenge stage ends</p>
              <p><strong>{stageEnd}</strong></p>
              <p>Remaining time: <Countdown
                endDate={stageEndMoment}
                onExpire={this.onCountdownExpire.bind(this)} /></p>
            </div>
          </div>
          <div className='column sixteen wide center aligned'>
            <Segment.Group>
              <Segment className='SegmentOne'>
                <p>
                  You should challenge <strong>{domain}&#8217;s </strong>application
                  if you don&#8217;t believe it should be in the adChain Registry.
                  Clicking the &#8220;CHALLENGE&#8221; button below will
                  initiate <strong>{domain}&#8217;s </strong> Voting stage.
                </p>
              </Segment>
              <Segment className='SegmentTwo'>
                <div className='NumberCircle'>1</div>
                <p>
                  ADT required to challenge: <strong>{minDeposit ? commafy(minDeposit) : '-'} ADT</strong>
                  <br />
                Your percentage payout if your challenge is successful: <strong>50%</strong>
                </p>
              </Segment>
              <Segment className='SegmentThree'>
                <p>
                  If your challenge is successful once the Reveal stage ends, you will have your ADT reimbursed and be awarded the payout.
                </p>
              </Segment>
              <Segment className='SegmentFour'>
                <Button basic className='ChallengeButton' onClick={this.onChallenge.bind(this)}>Challenge</Button>
              </Segment>
            </Segment.Group>
          </div>
        </div>
        {inProgress ? <DomainChallengeInProgressContainer /> : null}
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

  async getListing () {
    const {domain} = this.state
    const listing = await registry.getListing(domain)

    const {
      applicationExpiry,
      currentDeposit
    } = listing

    if (this._isMounted) {
      this.setState({
        applicationExpiry,
        currentDeposit
      })
    }
  }

  onChallenge (event) {
    event.preventDefault()

    this.challenge()
  }

  async challenge () {
    const {domain} = this.state

    let inApplication = null

    try {
      inApplication = await registry.applicationExists(domain)
    } catch (error) {
      toastr.error(error)
    }

    if (inApplication) {
      if (this._isMounted) {
        this.setState({
          inProgress: true
        })
      }

      try {
        await registry.challenge(domain)

        toastr.success('Successfully challenged domain')

        if (this._isMounted) {
          this.setState({
            inProgress: false
          })
        }

        // TODO: better way of resetting state
        setTimeout(() => {
          window.location.reload()
        }, 2e3)
      } catch (error) {
        toastr.error(error.message)
        if (this._isMounted) {
          this.setState({
            inProgress: false
          })
        }
      }
    } else {
      toastr.error('Domain not in application')
    }
  }

  onCountdownExpire () {
    // allow some time for new block to get mined and reload page
    setTimeout(() => {
      window.location.reload()
    }, 15000)
  }
}

DomainChallengeContainer.propTypes = {
  domain: PropTypes.string
}

export default DomainChallengeContainer
