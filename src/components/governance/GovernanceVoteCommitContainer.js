import React, { Component } from 'react'
import PropTypes from 'prop-types'
import toastr from 'toastr'
import moment from 'moment'
import { Input, Button, Segment } from 'semantic-ui-react'
import Tooltip from '../Tooltip'
import randomInt from 'random-int'
import saveFile from '../../utils/saveFile'
import Countdown from '../CountdownText'
import ParameterizerService from '../../services/parameterizer'

import '../single_domain/DomainVoteCommitContainer.css'

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
      commitEndDate,
      didChallenge,
      didCommit,
      salt,
      SupportState,
      OpposeState,
      // voteOption,
      // enableDownload,
      commitDownloaded,
      // votes
      // revealReminderDownloaded
    } = this.state

    const { challengeId, normalizedName } = this.props.proposal
    const stageEndMoment = commitEndDate ? moment.unix(commitEndDate) : null
    const stageEnd = stageEndMoment ? stageEndMoment.format('MMMM Do YYYY HH:mm:ss') : '-'

    return (
      <div className='DomainVoteCommitContainer GovernanceVoteCommitContainer'>
        <div className='ui grid stackable pd-20'>
          <div className='column sixteen wide HeaderColumn'>
            <div className='row HeaderRow'>
              <div className='ui large header'>
              Stage: Voting
                <Tooltip
                  info='The first phase of the voting process is the commit phase where the ADT holder stakes a hidden amount of votes to SUPPORT or OPPOSE the parameter application. The second phase is the reveal phase where the ADT holder reveals the staked amount of votes to either the SUPPORT or OPPOSE side.'
                />
              </div>
              <span>
                {normalizedName}
              </span>
            </div>
          </div>
          {didChallenge ? <div className='column sixteen wide center aligned'>
            <div className='ui message warning'>
              You've <strong>challenged</strong> this Parameter.
            </div>
          </div>
            : null}
          {didCommit ? <div className='column sixteen wide center aligned'>
            <div className='ui message warning'>
              You've <strong>committed</strong> votes for this proposal.
            </div>
          </div>
            : null}
          <div className='ui divider' style={{width: '100%'}} />
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

          <div className='column sixteen wide center aligned'>
            <form className='ui form center aligned'>
              {

              // <div className='ui field'>
              //   <p>Challenge ID: <label className='ui label'>{challengeId}</label></p>
              // </div>
              }
              <Segment.Group horizontal>
                <Segment className='SegmentOne' >
                  <div className='NumberCircle'>1</div>
                  <label style={{lineHeight: 1.8, fontSize: '13px', paddingLeft: '16px'}}>
                  Enter the number of votes to commit:
                  </label>
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
                <Segment className='SegmentOne' >
                  <div className='NumberCircle'>2</div>
                  <label style={{lineHeight: 1.8, fontSize: '13px', paddingLeft: '16px'}}>
                    Choose your vote option for the <b><u>proposal</u></b>:
                  </label>
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
                <Segment className='LeftSegment' style={{fontSize: '11px'}} floated='left'>
                  <div>
                    <div className='NumberCircle NumCircle3'>3</div>
                  </div>
                  Your commit is needed to reveal your vote in the Reveal stage:
                  <div className='DownloadCommitButtonContainer'>
                    <Button className='DownloadCommitButton' basic onClick={this.onDownload}>Download Commit &nbsp;<i className='icon long arrow down' /></Button>
                  </div>
                </Segment>
                <Segment className='RightSegment' style={{lineHeight: 2, fontSize: '11px'}} floated='right'>
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

  onFormSubmit (event) {
    event.preventDefault()
    this.commit()
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
      voteOption,
      salt,
      commitEndDate
    } = this.state
    const {
      challengeId,
      name
    } = this.props.proposal

    const json = {
      salt,
      voteOption,
      challengeId,
      commitEndDate
    }

    const endDateString = moment.unix(commitEndDate).format('YYYY-MM-DD_HH-mm-ss')
    json.commitEndDate = endDateString
    const filename = `${name}--challenge_id_${challengeId}--commit_end_${endDateString}--commit-vote.json`
    saveFile(json, filename)

    this.setState({
      commitDownloaded: true
    })
  }

  async getPoll () {
    try {
      const {challengeId, propId} = this.props.proposal
      const {
        votesFor,
        votesAgainst,
        commitEndDate,
        revealEndDate
      } = await ParameterizerService.getChallengePoll(challengeId, propId)

      if (this._isMounted) {
        this.setState({
          votesFor,
          votesAgainst,
          commitEndDate,
          revealEndDate
        })
      }
    } catch (error) {
      toastr.error('There was an error getting poll')
      console.log('get poll error: ', error)
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

    try {
      const committed = await ParameterizerService.commitVote({challengeId, propId, votes, voteOption, salt})

      if (committed) {
        toastr.success('Successfully committed')

        // TODO: better way of resetting state
        // setTimeout(() => {
        //   window.location.reload()
        // }, 1e3)
      } else {
        toastr.error('Commit did not go through')
      }
    } catch (error) {
      console.log('error: ', error)
      toastr.error('There was an error with your request')
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
