import React, { Component } from 'react'
import { Popup, Button, Segment } from 'semantic-ui-react'

import './RegistryGuideStaticInRegistry.css'

class RegistryGuideStaticInRegistry extends Component {
  render () {
    return (
      <div className='RegistryGuideStaticInRegistry BoxFrame'>
        <div className='ui grid stackable'>
          <div className='column sixteen wide HeaderColumn'>
            <div className='row HeaderRow'>
              <div className='ui large header'>
                Stage: In Registry
                <Popup
                  trigger={<i className='icon info circle' />}
                  content='The first phase of the voting process is the commit phase where the ADT holder stakes a hidden amount of votes to SUPPORT or OPPOSE the domain application. The second phase is the reveal phase where the ADT holder reveals the staked amount of votes to either the SUPPORT or OPPOSE side.'
                />
              </div>
            </div>
            <div className='ui divider' />
          </div>
          <div className='column sixteen wide center aligned'>
            <Segment.Group>
              <Segment className='SegmentOne'>
                <p>
                  You should challenge <strong>domain.com&#8217;s </strong>application
                  if you don&#8217;t believe it should be in the adChain Registry.
                  Clicking the &#8220;CHALLENGE&#8221; button below will
                  initiate <strong>domain.com&#8217;s </strong> Voting stage.
                </p>
              </Segment>
              <Segment className='SegmentTwo'>
                <p>
                  ADT required to challenge: <strong>100 ADT</strong>
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
                <Button basic className='ChallengeButton'>Challenge</Button>
              </Segment>
            </Segment.Group>
          </div>
        </div>
      </div>
    )
  }
}

export default RegistryGuideStaticInRegistry
