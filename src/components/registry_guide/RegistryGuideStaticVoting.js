import React, { Component } from 'react'
import { Input, Button, Segment } from 'semantic-ui-react'
import Tooltip from '../Tooltip'

import './RegistryGuideStaticVoting.css'

class RegistryGuideStaticVoting extends Component {
  render () {
    return (
      <div className='RegistryGuideStaticVoting BoxFrame'>
        <div className='ui grid stackable'>
          <div className='column sixteen wide HeaderColumn'>
            <div className='row HeaderRow'>
              <div className='ui large header'>
                Stage: Voting
                <Tooltip
                  info='The first phase of the voting process is the commit phase where the ADT holder stakes a hidden amount of votes to SUPPORT or OPPOSE the domain application. The second phase is the reveal phase where the ADT holder reveals the staked amount of votes to either the SUPPORT or OPPOSE side.'
                />
              </div>
            </div>
          </div>
          <div className='column sixteen wide center aligned StaticNoPadding'>
            <div>
              <p>
                Voting stage ends:
              </p>
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
          <div className='column sixteen wide center aligned StaticNoPadding'>
            <form className='ui form center aligned'>
              <Segment.Group horizontal>
                <Segment className='SegmentOne'>
                  <div className='NumberCircle'>1</div>
                  <label>Enter the Number of votes to commit:</label>
                </Segment>
                <Segment className='SegmentThree'>
                  <div className='ui input small'>
                    <Input
                      className='InputVoteCommit'
                      placeholder='ADT'
                    />
                  </div>
                </Segment>
              </Segment.Group>
              <Segment.Group horizontal className='WalkthroughStep4'>
                <Segment className='SegmentOne'>
                  <div className='NumberCircle'>2</div>
                  <label>Choose Your Vote Option:</label>
                </Segment>
                <Segment className='SegmentTwo'>
                  <Button
                    basic
                    name='voteOption'
                    value='1'
                    className='SupportButton'
                  >
                    Support
                  </Button>
                </Segment>
                <Segment className='SegmentThree'>
                  <Button
                    basic
                    name='voteOption'
                    value='0'
                    className='OpposeButton'
                  >
                    Oppose
                  </Button>
                </Segment>
              </Segment.Group>
              <div>
                <Segment className='LeftSegment' floated='left'>
                  <div>
                    <div className='NumberCircle NumCircle3'>3</div>
                  </div>
                  Your commit is needed to reveal your vote in the Reveal stage:
                  <div className='DownloadCommitButtonContainer'>
                    <Button className='DownloadCommitButton' basic>Download Commit &nbsp;<i className='icon long arrow down' /></Button>
                  </div>
                </Segment>
                <Segment className='RightSegment' floated='right'>
                  If you misplace your commit, you can enter the information below to reveal your vote:
                  <div className='ChallengeID'>
                    Challenge ID: <strong>38</strong>
                  </div>
                  <div>
                    Secret Phrase: <strong>9449182</strong>
                  </div>
                </Segment>
              </div>
              <div className='SubmitVoteButtonContainer'>
                <Button className='SubmitVoteButton centered' basic>Submit Vote</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default RegistryGuideStaticVoting
