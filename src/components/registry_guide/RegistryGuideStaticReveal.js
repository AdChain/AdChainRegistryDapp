import React, { Component } from 'react'
import { Input, Segment, Button } from 'semantic-ui-react'
import Tooltip from '../Tooltip'

import './RegistryGuideStaticReveal.css'

class RegistryGuideStaticReveal extends Component {
  render () {
    return (
      <div className='RegistryGuideStaticReveal BoxFrame'>
        <div className='ui grid stackable'>
          <div className='column sixteen wide HeaderColumn'>
            <div className='row HeaderRow'>
              <div className='ui large header'>
                Stage: Reveal
                <Tooltip
                  info='The first phase of the voting process is the commit phase where the ADT holder stakes a hidden amount of votes to SUPPORT or OPPOSE the domain application. The second phase is the reveal phase where the ADT holder reveals the staked amount of votes to either the SUPPORT or OPPOSE side.'
                />
              </div>
            </div>
          </div>
          <div className='column sixteen wide center aligned'>
            <div>
              <p>
                Reveal stage ends
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
          <div className='column sixteen wide center aligned DomainVoteTokenDistribution'>
            <div className='ProgressContainer'>
              <p>
                ADT holders have revealed their vote to show:
              </p>
              <div className='BarContainer'>
                <div className='StatProgressBar'>
                  <div className='StatBarContainer'>
                    {
                    [
                      <div
                        key={Math.random()}
                        style={{ 'width': '40%' }}
                        title='40%'
                        className='StatBarFillContainer'>
                          40%
                        </div>,
                      <div
                        key={Math.random()}
                        style={{ 'width': '60%' }}
                        title='60%'
                        className='StatBarFillContainer'>
                          60%
                        </div>
                    ]
                    }
                  </div>
                  <div className='StatBarLegend'>
                    <label className='FillLabel'>
                      SUPPORT
                    </label>
                    <label className='FillLabel'>
                      OPPOSE
                    </label>
                  </div>
                </div>
              </div>
              <div className='Breakdown'>
                <div className='BreakdownItem'>
                  <div className='BreakdownItemBox' />
                  <span className='BreakdownItemLabel'>= 4,000 Votes</span>
                </div>
                <div className='BreakdownItem'>
                  <div className='BreakdownItemBox' />
                  <span className='BreakdownItemLabel'>= 6,000 Votes</span>
                </div>
              </div>
            </div>
          </div>
          <div className='column sixteen wide center aligned'>
            <Segment className='LeftSegment' floated='left'>
              Upload your JSON commit file to reveal your vote:
              <div className='UploadCommitButtonContainer'>
                <Button className='UploadCommitButton' basic>Upload Commit &nbsp;<i className='icon long arrow up' /></Button>
                <input
                  type='file'
                  name='file'
                  id='HiddenCommitFile'
                  ref='HiddenFileUploader' style={{ display: 'none' }}
                  className='ui file' />
              </div>
            </Segment>
            <Segment className='RightSegment' floated='right'>
              If you misplaced your JSON commit file, you can enter the information below to reveal:
              <div className='VoteRevealLabel'>
                <span className='VoteRevealLabelText'>
                  Challenge ID:
                </span>
                <Input id='DomainVoteRevealChallengeIdInput' className='VoteRevealInput' />
              </div>
              <div className='VoteRevealLabel'>
                <span className='VoteRevealLabelText'>
                  Secret Phrase:
                </span>
                <Input id='DomainVoteRevealSaltInput' className='VoteRevealInput' />
              </div>
              <div className='VoteRevealLabel'>
                <span className='VoteRevealLabelText'>
                  Vote Option:
                </span>
                <Input id='DomainVoteRevealSaltInput' className='VoteRevealInput' />
              </div>
            </Segment>
          </div>
          <div className='SubmitVoteButtonContainer'>
            <Button
              className='SubmitVoteButton centered'
              basic
              type='submit'
            >
              Reveal Vote
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

export default RegistryGuideStaticReveal
