import React, { Component } from 'react'
import commafy from 'commafy'
import toastr from 'toastr'
import moment from 'moment'
import { Button } from 'semantic-ui-react'
// import { soliditySHA3 } from 'ethereumjs-abi'
import Tooltip from '../Tooltip'
import Countdown from '../CountdownText'
import ParameterizerService from '../../services/parameterizer'
// import DomainChallengeInProgressContainer from '../single_domain/DomainChallengeInProgressContainer'

import '../single_domain/DomainChallengeContainer.css'

class GovernanceChallengeContainer extends Component {
  constructor (props) {
    super()

    this.state = {
      domain: props.domain,
      applicationExpiry: null,
      minDeposit: null,
      currentDeposit: null,
      // inProgress: false,
      source: props.source
    }

    this.updateStatus = this.updateStatus.bind(this)
  }

  componentDidMount () {
    this._isMounted = true
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  render () {
    if (!this.props) return false
    const {
      appExpiry,
      // inProgress,
      stage,
      // name,
      // color,
      propId,
      normalizedName
    } = this.props.proposal

    const minDeposit = this.props.governanceParameterProposals.pMinDeposit.value / 1000000000
    const pDispensationPct = this.props.governanceParameterProposals.pDispensationPct.value

    const stageEndMoment = appExpiry ? moment.unix(appExpiry) : null
    const stageEnd = stageEndMoment ? stageEndMoment.format('YYYY-MM-DD HH:mm:ss') : '-'

    return (
      <div className='DomainChallengeContainer ProposalChallengeContainer'>
        <div className='ui grid stackable pd-20'>
          {
            (stage === 'InRegistry') ? null
              : <div className='column sixteen wide HeaderColumn'>
                <div className='row HeaderRow'>
                  <div className='ui large header'>
                  Stage: In Application
                    <Tooltip
                      info='The first phase of the voting process is the commit phase where the ADT holder stakes a hidden amount of votes to SUPPORT or OPPOSE the domain application. The second phase is the reveal phase where the ADT holder reveals the staked amount of votes to either the SUPPORT or OPPOSE side.'
                    />
                  </div>
                  <span>
                    {normalizedName}
                  </span>
                </div>
                <div className='ui divider' />
              </div>
          }

          {
            (stage === 'InRegistry') ? null
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
          <div className='column sixteen wide center aligned GovernanceChallengeInfo'>
            <div>
              <div>
                <p>ADT Required to Challenge</p>
                <span className='RequiredADT'>
                  <strong>{minDeposit ? commafy(minDeposit) : '-'} ADT</strong>
                </span>
              </div>
              <div className='PayoutPercentageContainer'>
                <p>Your Percentage Payout if Successful: </p><span className='PayoutPercentage'><strong>{pDispensationPct}%</strong></span>
              </div>
            </div>
            <Button basic className='ChallengeButton' onClick={() => this.challenge(propId)}>Challenge</Button>
          </div>
        </div>
      </div>
    )
  }

  async updateStatus (name, value) {
    try {
      await ParameterizerService.processProposal(name, value)
    } catch (error) {
      toastr.error('There was an error updating domain status')
      console.error(error)
    }
  }

  async challenge (propId) {
    // let result
    let propExists = null

    try {
      propExists = await ParameterizerService.propExists(propId)
    } catch (error) {
      toastr.error('Error')
    }

    if (propExists) {
      try {
        await ParameterizerService.challengeReparameterization(this.props.governanceParameterProposals.pMinDeposit.value, propId)
        toastr.success('Successfully challenged parameter')

        // TODO: better way of resetting state
        // setTimeout(() => {
        //   window.location.reload()
        // }, 2e3)
      } catch (error) {
        toastr.error('Error')
      }
    } else {
      toastr.error('Proposal not in application')
    }
  }

  onCountdownExpire () {
    // allow some time for new block to get mined and reload page
    setTimeout(() => {
      window.location.reload()
    }, 15000)
  }
}

export default GovernanceChallengeContainer
