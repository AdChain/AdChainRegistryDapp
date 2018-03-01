import React, { Component } from 'react'
import PropTypes from 'prop-types'
import toastr from 'toastr'
import moment from 'moment'
import { Popup, Input, Button, Segment } from 'semantic-ui-react'
import randomInt from 'random-int'

import saveFile from '../utils/saveFile'
import generateReminder from '../utils/generateReminder'
import Countdown from './CountdownText'
import ParameterizerService from '../services/parameterizer'
import DomainVoteCommitInProgressContainer from './DomainVoteCommitInProgressContainer'

import './DomainVoteCommitContainer.css'

class GovernanceVoteCommitContainer extends Component {
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
      inProgress: false,
      salt,
      voteOption: null,
      enableDownload: false,
      commitDownloaded: false,
      revealReminderDownloaded: false,
      SupportState: 'SupportButton',
      OpposeState: 'OpposeButton'
    }

    this.onDepositKeyUp = this.onDepositKeyUp.bind(this)
    this.onVoteOptionChange = this.onVoteOptionChange.bind(this)
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onDownload = this.onDownload.bind(this)
    this.onReminderDownload = this.onReminderDownload.bind(this)
    this.enableDownloadCheck = this.enableDownloadCheck.bind(this)
  }

  async componentWillMount () {
    await this.getPoll()
    await this.getCommit()
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
      inProgress,
      salt,
      SupportState,
      OpposeState,
      // voteOption,
      challengeId
      // enableDownload,
      // commitDownloaded,
      // votes
      // revealReminderDownloaded
    } = this.state

    const stageEndMoment = commitEndDate ? moment.unix(commitEndDate) : null
    const stageEnd = stageEndMoment ? stageEndMoment.format('MMMM Do YYYY HH:mm:ss') : '-'

    return (
      <div className='DomainVoteCommitContainer'>
        <div className='ui grid stackable pd-20'>
          <div className='column sixteen wide HeaderColumn'>
            <div className='row HeaderRow'>
              <div className='ui large header'>
              Stage: Voting
              <Popup
                trigger={<i className='icon info circle' />}
                content='The first phase of the voting process is the commit phase where the ADT holder stakes a hidden amount of votes to SUPPORT or OPPOSE the domain application. The second phase is the reveal phase where the ADT holder reveals the staked amount of votes to either the SUPPORT or OPPOSE side.'
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
              {

              // <div className='ui field'>
              //   <p>Challenge ID: <label className='ui label'>{challengeId}</label></p>
              // </div>
            }
              <Segment.Group horizontal>
                <Segment className='SegmentOne'>
                  <div className='NumberCircle'>1</div>
                  <label>Enter the Number of votes to commit:</label>
                  {
              // </Segment>
              // <Segment className='SegmentTwo'>
            }
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
                  <div>
                    Challenge ID: <strong>{challengeId}</strong>
                  </div>
                  <div>
                    Secret Phrase: <strong>{salt}</strong>
                  </div>
                </Segment>
              </div>
              <div className='SubmitVoteButtonContainer'>
                <Button className='SubmitVoteButton centered' basic onClick={this.onFormSubmit}>Submit Vote</Button>
              </div>
            </form>
          </div>
        </div>
        { inProgress ? <DomainVoteCommitInProgressContainer /> : null }
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

    const filename = `${domainUnderscored}--challenge_id_${challengeId}--commit_end_${endDateString}--commit-vote.json`
    saveFile(json, filename)

    this.setState({
      commitDownloaded: true
    })
  }

  async onReminderDownload (event) {
    event.preventDefault()

    const {
      domain,
      challengeId,
      commitEndDate
    } = this.state

    const domainUnderscored = domain.replace('.', '_')
    const revealDate = moment.unix(commitEndDate)
    const revealDateString = revealDate.format('YYYY-MM-DD_HH-mm-ss')

    const filename = `${domainUnderscored}--challenge_id_${challengeId}--reveal_start_${revealDateString}--reminder.ics`
    const title = `Reveal Vote for ${domain}`
    const url = `${window.location.protocol}//${window.location.host}/domains/${domain}`

    const data = await generateReminder({
      start: revealDate,
      title,
      url
    })

    saveFile(data, filename)

    this.setState({
      revealReminderDownloaded: true
    })
  }

  onFormSubmit (event) {
    event.preventDefault()
    this.commit()
  }

  async getPoll () {
    try {
      const {
        commitEndDate,
        revealEndDate
      } = await ParameterizerService.getChallengePoll(this.props.proposal.propId)

      if (this._isMounted) {
        this.setState({
          commitEndDate,
          revealEndDate
        })
      }
    } catch (error) {
      toastr.error('There was an error getting challenge poll')
    }
  }

  async getChallenge () {
    try {
      const didChallenge = await ParameterizerService.didChallenge(this.props.proposal.propId)

      if (this._isMounted) {
        this.setState({
          didChallenge
        })
      }
    } catch (error) {
      toastr.error('There was an error getting challenge')
    }
  }

  async getCommit () {
    try {
      const didCommit = await ParameterizerService.didCommit(this.props.proposal.challengeId)

      if (this._isMounted) {
        this.setState({
          didCommit: didCommit
        })
      }
    } catch (error) {
      toastr.error('There was an error getting commit')
    }
  }

  async commit () {
    const {
      votes,
      salt,
      voteOption
    } = this.state

    const propId = this.props.proposal.propId
    const challengeId = this.props.proposal.challengeId

    if (voteOption === null) {
      toastr.error('Please select a vote option')
      return false
    }

    if (this._isMounted) {
      this.setState({
        inProgress: true
      })
    }

    try {
      console.log(challengeId, propId, votes, voteOption, salt)
      const committed = await ParameterizerService.commitVote({challengeId, propId, votes, voteOption, salt})

      if (this._isMounted) {
        this.setState({
          inProgress: false
        })
      }

      if (committed) {
        toastr.success('Successfully committed')

        // TODO: better way of resetting state
        setTimeout(() => {
          window.location.reload()
        }, 1e3)
      } else {
        toastr.error('Commit did not go through')
      }
    } catch (error) {
      console.log('error: ', error)
      toastr.error('There was an error with your request')
      if (this._isMounted) {
        this.setState({
          inProgress: false
        })
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

GovernanceVoteCommitContainer.propTypes = {
  domain: PropTypes.string
}

export default GovernanceVoteCommitContainer
