import React, { Component } from 'react'
import PropTypes from 'prop-types'
import toastr from 'toastr'
import moment from 'moment'
import { Input, Button, Segment } from 'semantic-ui-react'
import Tooltip from '../Tooltip'
import randomInt from 'random-int'
import calculateGas from '../../utils/calculateGas'

import saveFile from '../../utils/saveFile'
import Countdown from '../CountdownText'
import registry from '../../services/registry'

import './DomainVoteCommitContainer.css'

class DomainVoteCommitContainer extends Component {
  constructor (props) {
    super()

    const salt = randomInt(1e6, 1e8)

    this.state = {
      votes: 0,
      domain: props.domain,
      applicationExpiry: null,
      challengeId: null,
      commitEndDate: null,
      revealEndDate: null,
      didChallenge: null,
      didCommit: null,
      salt,
      voteOption: null,
      enableDownload: false,
      commitDownloaded: false,
      revealReminderDownloaded: false,
      SupportState: 'SupportButton',
      OpposeState: 'OpposeButton'
    }

    this.getListing()
    this.getPoll()
    this.getChallenge()
    this.getCommit()

    this.onDepositKeyUp = this.onDepositKeyUp.bind(this)
    this.onVoteOptionChange = this.onVoteOptionChange.bind(this)
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onDownload = this.onDownload.bind(this)
    this.enableDownloadCheck = this.enableDownloadCheck.bind(this)
  }

  componentDidMount () {
    this._isMounted = true
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  componentWillUpdate () {
    setTimeout(() => {
      this.enableDownloadCheck()
    }, 0)
  }

  render () {
    const {
      // domain,
      commitEndDate,
      didChallenge,
      didCommit,
      salt,
      SupportState,
      OpposeState,
      // voteOption,
      challengeId,
      // enableDownload,
      commitDownloaded
      // votes
      // revealReminderDownloaded
    } = this.state

    const stageEndMoment = commitEndDate ? moment.unix(commitEndDate) : null
    const stageEnd = stageEndMoment ? stageEndMoment.format('MMMM Do YYYY HH:mm:ss') : '-'

    return (
      <div className='DomainVoteCommitContainer'>
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
          {didChallenge ? <div className='column sixteen wide center aligned'>
            <div className='ui message warning'>
              You've <strong>challenged</strong> this domain.
            </div>
          </div>
            : null}
          {didCommit ? <div className='column sixteen wide center aligned'>
            <div className='ui message warning'>
              You've <strong>committed</strong> for this domain.
            </div>
          </div>
            : null}
          <div className='ui divider' />
          <div className='column sixteen wide center aligned'>
            <div className='VotingDeadline'>
              <p>
              Voting stage ends:
              </p>
              <p><strong>{stageEnd}</strong></p>
              <div>Remaining time:
                <Countdown
                  endDate={stageEndMoment}
                  onExpire={this.onCountdownExpire.bind(this)} />
              </div>
            </div>
          </div>
          <div className='ui divider' />
          <div className='column sixteen wide center aligned'>
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
                      onKeyUp={this.onDepositKeyUp}
                    />
                  </div>
                </Segment>
              </Segment.Group>
              <Segment.Group horizontal>
                <Segment className='SegmentOne'>
                  <div className='NumberCircle'>2</div>
                  <label>Choose Your Vote Option:</label>
                </Segment>
                <Segment className='SegmentTwo'>
                  <Button
                    basic
                    className={SupportState}
                    name='voteOption'
                    value='1'
                    onClick={this.onVoteOptionChange}
                  >
                  Support
                  </Button>
                </Segment>
                <Segment className='SegmentThree'>
                  <Button
                    basic
                    className={OpposeState}
                    name='voteOption'
                    value='0'
                    onClick={this.onVoteOptionChange}
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
                    <Button className='DownloadCommitButton' basic onClick={this.onDownload}>Download Commit &nbsp;<i className='icon long arrow down' /></Button>
                  </div>
                </Segment>
                <Segment className='RightSegment' floated='right'>
                  If you misplace your commit, you can enter the information below to reveal your vote:
                  <div className='ChallengeID'>
                    Challenge ID: <strong>{challengeId}</strong>
                  </div>
                  <div>
                    Secret Phrase: <strong>{salt}</strong>
                  </div>
                </Segment>
              </div>
              <div className='SubmitVoteButtonContainer'>
                {
                  commitDownloaded
                    ? <Button className='SubmitVoteButton centered' basic onClick={this.onFormSubmit}>Submit Vote</Button>
                    : <Button className='SubmitVoteButton centered' basic disabled>Submit Vote</Button>
                }
              </div>
              {
                !commitDownloaded
                  ? <div className='SubmitMessage'>Please download the commit file in order to submit your vote</div>
                  : null
              }
            </form>
          </div>
        </div>
      </div>
    )
  }

  onDepositKeyUp (event) {
    if (this._isMounted) {
      this.setState({
        votes: event.target.value | 0 // coerce to int
      })
    }
  }

  onVoteOptionChange (event, { value }) {
    event.preventDefault()

    if (this._isMounted) {
      if (value === '1') {
        this.setState({
          voteOption: parseInt(value, 10),
          SupportState: 'SupportButton clicked',
          OpposeState: 'OpposeButton'

        })
      } else {
        this.setState({
          voteOption: parseInt(value, 10),
          OpposeState: 'OpposeButton clicked',
          SupportState: 'SupportButton'
        })
      }
    }
  }

  enableDownloadCheck () {
    const {
      votes,
      voteOption,
      enableDownload
    } = this.state

    if (!enableDownload && voteOption !== null && votes) {
      this.setState({
        enableDownload: true
      })
    }
  }

  onDownload (event) {
    event.preventDefault()

    const {
      domain,
      voteOption,
      salt,
      challengeId,
      commitEndDate
    } = this.state

    const json = {
      domain,
      voteOption,
      salt,
      challengeId,
      commitEndDate
    }

    const domainUnderscored = domain.replace('.', '_')
    const endDateString = moment.unix(commitEndDate).format('YYYY-MM-DD_HH-mm-ss')
    json.commitEndDate = endDateString

    const filename = `${domainUnderscored}--challenge_id_${challengeId}--commit_end_${endDateString}--commit-vote.json`
    saveFile(json, filename)

    this.setState({
      commitDownloaded: true
    })
    try {
      calculateGas({
        domain: domain,
        contract_event: false,
        event: 'download json',
        contract: 'none',
        event_success: true
      })
    } catch (error) {
      console.log('error reporting gas')
    }
  }

  onFormSubmit (event) {
    event.preventDefault()

    this.commit()
  }

  async getListing () {
    const {domain} = this.state
    const listing = await registry.getListing(domain)

    const {
      applicationExpiry,
      challengeId
    } = listing

    if (this._isMounted) {
      this.setState({
        applicationExpiry,
        challengeId
      })
    }
  }

  async getPoll () {
    const {domain} = this.state

    try {
      const {
        commitEndDate,
        revealEndDate
      } = await registry.getChallengePoll(domain)

      if (this._isMounted) {
        this.setState({
          commitEndDate: commitEndDate._i,
          revealEndDate: revealEndDate._i
        })
      }
    } catch (error) {
      toastr.error('There was an error with your request')
    }
  }

  async getChallenge () {
    const {domain} = this.state

    try {
      const didChallenge = await registry.didChallenge(domain)

      if (this._isMounted) {
        this.setState({
          didChallenge
        })
      }
    } catch (error) {
      toastr.error('There was an error with your request')
    }
  }

  async getCommit () {
    const {domain} = this.state

    try {
      const didCommit = await registry.didCommit(domain)

      if (this._isMounted) {
        this.setState({
          didCommit: didCommit
        })
      }
    } catch (error) {
      toastr.error('There was an error with your request')
    }
  }

  async commit () {
    const {
      domain,
      votes,
      salt,
      voteOption
    } = this.state

    if (voteOption === null) {
      toastr.error('Please select a vote option')
      return false
    }

    try {
      const committed = await registry.commitVote({domain, votes, voteOption, salt})
      if (committed) {
        // toastr.success('Successfully committed')
        await this.getCommit()
        try {
          calculateGas({
            domain: domain,
            contract_event: true,
            event: 'commit',
            contract: 'registry',
            vote_option: voteOption,
            stake: votes,
            event_success: true
          })
        } catch (error) {
          console.log('error reporting gas')
        }
        // TODO: better way of resetting state
        // setTimeout(() => {
        //   window.location.reload()
        // }, 1e3)
      } else {
        toastr.error('Commit did not go through')
      }
    } catch (error) {
      console.error('Commit Error: ', error)
      toastr.error('There was an error with your request')
      try {
        calculateGas({
          domain: domain,
          contract_event: true,
          event: 'commit',
          contract: 'registry',
          vote_option: voteOption,
          stake: votes,
          event_success: false
        })
      } catch (error) {
        console.log('error reporting gas')
      }
    }
  }

  onCountdownExpire () {
    // allow some time for new block to get mined and reload page
    setTimeout(() => {
      window.location.reload()
    }, 15000)
  }
}

DomainVoteCommitContainer.propTypes = {
  domain: PropTypes.string
}

export default DomainVoteCommitContainer
