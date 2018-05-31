import React, { Component } from 'react'
import PropTypes from 'prop-types'
import commafy from 'commafy'
import toastr from 'toastr'
import moment from 'moment'
import isMobile from 'is-mobile'
import { Button } from 'semantic-ui-react'
import Tooltip from '../Tooltip'

import Countdown from '../CountdownText'
import registry from '../../services/registry'
import parametizer from '../../services/parameterizer'
import PubSub from 'pubsub-js'
import IndividualGuideModal from './IndividualGuideModal'
import { createPostChallenge } from '../../services/redditActions'

import './DomainChallengeContainer.css'

class DomainChallengeContainer extends Component {
  constructor(props) {
    super(props)
    let displayChallengeModal = JSON.parse(window.localStorage.getItem('ChallengeGuide'))
    const { domainData, domain } = props
    this.state = {
      domain,
      reason: '',
      domainData,
      minDeposit: null,
      currentDeposit: null,
      source: props.source,
      dispensationPct: null,
      applicationExpiry: null,
      displayChallengeModal: !displayChallengeModal
    }
    
    this.handleChange = this.handleChange.bind(this)
    this.getDispensationPct = this.getDispensationPct.bind(this)
  }

  async componentDidMount() {
    this._isMounted = true

    await this.getMinDeposit()
    await this.getDispensationPct()
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    const {
      source,
      reason,
      minDeposit,
      dispensationPct,
      displayChallengeModal
    } = this.state

    const {
      applicationExpiry,
      currentDeposit
    } = this.props.domainData

    const stageEndMoment = applicationExpiry ? moment.unix(applicationExpiry) : null
    const stageEnd = stageEndMoment ? stageEndMoment.format('YYYY-MM-DD HH:mm:ss') : '-'
    const stakedDifference = currentDeposit - minDeposit
    let redirectState = this.props.redirectState ? this.props.redirectState.cameFromRedirect : false

    return (
      <div className='DomainChallengeContainer'>
        <div className='ui grid stackable'>
          {
            (source === 'InRegistry') ? null
              : <div className='column sixteen wide HeaderColumn'>
                <div className='row HeaderRow'>
                  <div className='ui large header'>
                    Stage: In Application
                    <Tooltip
                      info='The first phase of the voting process is the commit phase where the ADT holder stakes a hidden amount of votes to SUPPORT or OPPOSE the domain application. The second phase is the reveal phase where the ADT holder reveals the staked amount of votes to either the SUPPORT or OPPOSE side.'
                    />
                  </div>
                </div>
                <div className='ui divider' />
              </div>
          }

          {
            (source === 'InRegistry') ? null
              : <div className='column sixteen wide center aligned'>
                <div>
                  <p>Challenge stage ends</p>
                  <p><strong>{stageEnd}</strong></p>
                  <div>Remaining time: <Countdown
                    endDate={stageEndMoment}
                    onExpire={this.onCountdownExpire.bind(this)} /></div>
                </div>
              </div>
          }
          <div className='column sixteen wide center aligned ChallengeInfoContainer'>
            <div>
              <div>
                <p>ADT Required to Challenge</p>
                <span className='RequiredADT'>
                  <strong>{minDeposit ? commafy(minDeposit) : '-'} ADT</strong>
                </span>
                {
                  (source === 'InRegistry') ? null
                    : <div className='NumberCircle'>1</div>
                }
              </div>
              {
                (stakedDifference < 0)
                  ? <div className='TouchRemoveMessage'>
                    <p>Challenging this domain will remove it from the registry since the listing has less ADT staked than required.</p>
                  </div>
                  : <div className='PayoutPercentageContainer'>
                    <p>Your Percentage Payout if Successful: </p><span className='PayoutPercentage'><strong>{dispensationPct}%</strong></span>
                  </div>
              }
            </div>
            <div className="form desktop-hide">
              <span className='fw-600'>Enter Challenge Reasoning</span>
              <br /><br />
              <input className="MobileChallengeReasonInput" name="reason" value={reason} onChange={this.handleChange} type='text' placeholder='15 character minimum' />
            </div>

            <Button basic className='ChallengeButton' onClick={this.onChallenge.bind(this)}>Challenge</Button>
          </div>
        </div>
        {
          source === 'InRegistry'
            ? null
            : redirectState
              ? null
              : <IndividualGuideModal steps={'ChallengeGuide'} open={displayChallengeModal} />
        }
      </div>
    )
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  async getMinDeposit() {
    if (this._isMounted) {
      this.setState({
        minDeposit: (await registry.getMinDeposit()).toNumber()
      })
    }
  }

  onChallenge(event) {
    event.preventDefault()
    this.challenge()
  }

  async challenge() {

    const { domain, minDeposit, reason } = this.state
    const { listingHash } = this.props.domainData

    let inApplication = null

    try {
      inApplication = await registry.applicationExists(listingHash)
    } catch (error) {
      toastr.error('Error')
    }



    if (inApplication) {

      try {
        let data = {
          domain,
          listingHash,
          stake: minDeposit,
          action: 'challenge'
        }
        if (isMobile()) {
          let data = ''
          if (reason.length < 15) {
            toastr.error("Challenge reasoning has 15 character minimum")
            return
          }
          await registry.challenge(listingHash, data)
          await createPostChallenge(domain, reason)
          PubSub.publish('DomainProfile.fetchSiteData')
        } else {
          PubSub.publish('RedditConfirmationModal.show', data)
        }

      } catch (error) {
        console.log("error", error)
        toastr.error('Error')
      }
    } else {
      toastr.error('Domain not in application')
    }
  }

  onCountdownExpire() {
    // allow some time for new block to get mined and reload page
    setTimeout(() => {
      window.location.reload()
    }, 15000)
  }

  async getDispensationPct() {
    try {
      parametizer.get('dispensationPct')
        .then((response) => {
          let result = response.toNumber()
          this.setState({
            dispensationPct: result
          })
        })
    } catch (error) {
      console.error(error)
    }
  }
}

DomainChallengeContainer.propTypes = {
  domain: PropTypes.string
}

export default DomainChallengeContainer
