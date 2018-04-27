import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'
import Tooltip from '../Tooltip'

import './RegistryGuideStaticChallenge.css'

class RegistryGuideStaticChallenge extends Component {
  render () {
    return (
      <div className='RegistryGuideStaticChallenge BoxFrame'>
        <div className='ui grid stackable'>
          <div className='column sixteen wide HeaderColumn'>
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
          <div className='column sixteen wide center aligned'>
            <div>
              <p>Challenge stage ends</p>
              <p><strong>February 2nd, 2018 @ 02:13:40 PST</strong></p>
              <div>Remaining time:
                <div className='CountdownText'>
                  <div className='CountdownUnit'>
                        02
                    <span className='CountdownLabel'>days</span>
                  </div>
                  <div className='CountdownUnit'>
                        13
                    <span className='CountdownLabel'>hours</span>
                  </div>
                  <div className='CountdownUnit'>
                        26
                    <span className='CountdownLabel'>minutes</span>
                  </div>
                  <div className='CountdownUnit'>
                        10
                    <span className='CountdownLabel'>seconds</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='column sixteen wide center aligned ChallengeInfoContainer'>
            <div>
              <div>
                <p>ADT Required to Challenge</p>
                <span className='RequiredADT'>
                  <strong>150 ADT</strong>
                </span>
                <div className='NumberCircle'>1</div>
              </div>
              <div className='PayoutPercentageContainer'>
                <p>Your Percentage Payout if Successful: </p><span className='PayoutPercentage'><strong>50%</strong></span>
              </div>
            </div>
            <Button basic className='ChallengeButton'>Challenge</Button>
          </div>
        </div>
      </div>
    )
  }
}

export default RegistryGuideStaticChallenge
