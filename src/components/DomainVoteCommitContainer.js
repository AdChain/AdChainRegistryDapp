import React, { Component } from 'react'
import PropTypes from 'prop-types'
import toastr from 'toastr'
import moment from 'moment'
import { Radio } from 'semantic-ui-react'
import randomInt from 'random-int'

import saveFile from '../utils/saveFile'
import Countdown from './CountdownText'
import registry from '../services/registry'
import DomainVoteCommitInProgressContainer from './DomainVoteCommitInProgressContainer'

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
      inProgress: false,
      salt,
      voteOption: null,
      enableDownload: false
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

  componentWillUpdate () {
    setTimeout(() => {
      this.enableDownloadCheck()
    }, -1)
  }

  render () {
    const {
      domain,
      commitEndDate,
      didChallenge,
      didCommit,
      inProgress,
      salt,
      voteOption,
      challengeId,
      enableDownload
    } = this.state

    const stageEndMoment = commitEndDate ? moment.unix(commitEndDate) : null
    const stageEnd = stageEndMoment ? stageEndMoment.format('YYYY-MM-DD HH:mm:ss') : '-'

    return (
      <div className='DomainVoteCommitContainer'>
        <div className='ui grid stackable'>
          <div className='column sixteen wide'>
            <div className='ui large header center aligned'>
              VOTING – COMMIT
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
              You've <strong>commited</strong> for this domain.
            </div>
          </div>
          : null}
          <div className='column sixteen wide'>
            <p>
The first phase of the voting process is the commit phase where the ADT holder stakes a hidden amount of ADT to SUPPORT or OPPOSE the domain application. The second phase is the reveal phase where the ADT holder reveals the staked amount of ADT to either the SUPPORT or OPPOSE side.
            </p>
          </div>
          <div className='ui divider' />
          <div className='column sixteen wide center aligned'>
            <div className='ui message info'>
              <p>
              Voting commit stage ends
              </p>
              <p><strong>{stageEnd}</strong></p>
              <p>Remaning time: <Countdown endDate={stageEndMoment} /></p>
            </div>
          </div>
          <div className='ui divider' />
          <div className='column sixteen wide center aligned'>
            <form
              onSubmit={this.onFormSubmit}
              className='ui form center aligned'>
              <div className='ui field'>
                <label>VOTE or OPPOSE {domain}</label>
              </div>
              <div className='ui field'>
                <p>Challenge ID: <label className='ui label'>{challengeId}</label></p>
              </div>
              <div className='ui field'>
                <label>Enter ADT to Commit</label>
                <div className='ui input small'>
                  <input
                    type='text'
                    placeholder='100'
                    onKeyUp={this.onDepositKeyUp}
                  />
                </div>
              </div>
              <div className='ui field'>
                <label>Vote Option</label>
              </div>
              <div className='ui two fields VoteOptions'>
                <div className='ui field'>
                  <Radio
                    label='SUPPORT'
                    name='voteOption'
                    value='1'
                    checked={this.state.voteOption === 1}
                    onChange={this.onVoteOptionChange}
                  />
                </div>
                <div className='ui field'>
                  <Radio
                    label='OPPOSE'
                    name='voteOption'
                    value='0'
                    checked={this.state.voteOption === 0}
                    onChange={this.onVoteOptionChange}
                  />
                </div>
              </div>
              <div className='ui field'>
                <label>Salt<br/><small>PLEASE SAVE THIS. This will be required to reveal your vote and claim rewards.</small></label>
                <div className='ui message default'>
                  {salt}
                </div>
              </div>
              <div className='ui field'>
                <label><small>Download commit info required for reveal stage</small></label>
                <button
                  onClick={this.onDownload}
                  title='Download commit info'
                  className={`ui button ${enableDownload ? '' : 'disabled'} right labeled icon`}>
                  Download Commit
                  <i className='icon download'></i>
                </button>
              </div>
              <div className='ui field'>
                {voteOption === null ?
                  <button
                    type='submit'
                    className='ui button disabled'>
                      Select Vote Option
                  </button>
                :
                <button
                  type='submit'
                  className={`ui button ${voteOption ? 'blue' : 'purple'} right labeled icon`}>
                    VOTE TO {voteOption ? 'SUPPORT' : 'OPPOSE'} <i className={`icon thumbs ${voteOption ? 'up' : 'down'}`}></i>
                </button>
                }
              </div>
            </form>
          </div>
        </div>
        {inProgress ? <DomainVoteCommitInProgressContainer /> : null}
      </div>
    )
  }

  onDepositKeyUp (event) {
    this.setState({
      votes: event.target.value | 0
    })
  }

  onVoteOptionChange (event, { value }) {
    this.setState({
      voteOption: parseInt(value, 10)
    })
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

    const filename = `commit-vote--${domain.replace('.', '_')}--${challengeId}--${commitEndDate}.json`
    saveFile(json, filename)
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

    this.setState({
      applicationExpiry,
      challengeId
    })
  }

  async getPoll () {
    const {domain} = this.state

    try {
      const {
        commitEndDate,
        revealEndDate
      } = await registry.getChallengePoll(domain)

      this.setState({
        commitEndDate,
        revealEndDate
      })
    } catch (error) {
      toastr.error(error)
    }
  }

  async getChallenge () {
    const {domain} = this.state

    try {
      const didChallenge = await registry.didChallenge(domain)

      this.setState({
        didChallenge
      })
    } catch (error) {
      toastr.error(error)
    }
  }

  async getCommit () {
    const {domain} = this.state

    try {
      const didCommit = await registry.didCommit(domain)

      this.setState({
        didCommit: didCommit
      })
    } catch (error) {
      toastr.error(error)
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

    this.setState({
      inProgress: true
    })

    try {
      await registry.commitVote({domain, votes, voteOption, salt})
      toastr.success('Success')
      this.setState({
        inProgress: false
      })
    } catch (error) {
      toastr.error(error.message)
      this.setState({
        inProgress: false
      })
    }
  }
}

DomainVoteCommitContainer.propTypes = {
  domain: PropTypes.string
}

export default DomainVoteCommitContainer