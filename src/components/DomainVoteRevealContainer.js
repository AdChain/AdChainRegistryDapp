import React, { Component } from 'react'
import PropTypes from 'prop-types'
import commafy from 'commafy'
import toastr from 'toastr'
import moment from 'moment'
import { Radio } from 'semantic-ui-react'

import Countdown from './CountdownText'
import registry from '../services/registry'
import DomainVoteRevealInProgressContainer from './DomainVoteRevealInProgressContainer'
import StatProgressBar from './StatProgressBar'

import './DomainVoteRevealContainer.css'

class DomainVoteRevealContainer extends Component {
  constructor (props) {
    super()

    this.state = {
      domain: props.domain,
      applicationExpiry: null,
      votesFor: 0,
      votesAgainst: 0,
      commitEndDate: null,
      revealEndDate: null,
      inProgress: false,
      didChallenge: false,
      didCommit: false,
      didReveal: false,
      salt: null,
      voteOption: null,
      challengeId: null
    }

    this.onVoteOptionChange = this.onVoteOptionChange.bind(this)
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onFileInput = this.onFileInput.bind(this)

    this.getListing()
    this.getPoll()
    this.getChallenge()
    this.getCommit()
    this.getReveal()
  }

  render () {
    const {
      votesFor,
      votesAgainst,
      revealEndDate,
      inProgress,
      didChallenge,
      didCommit,
      didReveal,
      voteOption,
      challengeId,
      salt
    } = this.state

    const stageEndMoment = revealEndDate ? moment.unix(revealEndDate) : null
    const stageEnd = stageEndMoment ? stageEndMoment.format('YYYY-MM-DD HH:mm:ss') : '-'

    // "N | 0" coerces to int
    const totalVotes = ((votesFor + votesAgainst) | 0)
    const supportFill = ((totalVotes / votesFor * 1e2) | 0)
    const opposeFill = ((totalVotes / votesAgainst * 1e2) | 0)

    return (
      <div className='DomainVoteRevealContainer'>
        <div className='ui grid stackable'>
          <div className='column sixteen wide'>
            <div className='ui large header center aligned'>
              VOTING – REVEAL
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
          {didReveal ? <div className='column sixteen wide center aligned'>
            <div className='ui message warning'>
              You've <strong>revealed</strong> for this domain.
            </div>
          </div>
          : null}
          <div className='column sixteen wide'>
            <p>
The first phase of the voting process is the commit phase where the ADT holder stakes a hidden amount of ADT to SUPPORT or OPPOSE the domain application. The second phase is the reveal phase where the ADT holder reveals the staked amount of ADT to either the SUPPORT or OPPOSE side.
            </p>
          </div>
          <div className='ui divider' />
          <div className='column sixteen wide center aligned ProgressContainer'>
            <p>
              ADT holders have revealed their vote to show:
            </p>
            <div className='BarContainer'>
              <StatProgressBar
                fills={[supportFill, opposeFill]}
                showFillLabels
                showLegend
                fillLabels={['SUPPORT', 'OPPOSE']}
              />
            </div>
            <div className='Breakdown'>
              <div className='BreakdownItem'>
                <div className='BreakdownItemBox'></div>
                <span className='BreakdownItemLabel'>{commafy(votesFor)} ADT</span>
              </div>
              <div className='BreakdownItem'>
                <div className='BreakdownItemBox'></div>
                <span className='BreakdownItemLabel'>{commafy(votesAgainst)} ADT</span>
              </div>
            </div>
          </div>
          <div className='ui divider' />
          <div className='column sixteen wide center aligned'>
            <div className='ui message info'>
              <p>
            Reveal stage ends
              </p>
              <p><strong>{stageEnd}</strong></p>
              <p>Remaning time: <Countdown endDate={stageEndMoment} /></p>
            </div>
          </div>
          <div className='ui divider' />
          <div className='column sixteen wide center aligned'>
            <form
              onSubmit={this.onFormSubmit}
              className='ui form'>
              <div className='ui field'>
                <p>Challenge ID: <label className='ui label'>{challengeId}</label></p>
              </div>
              <div className='ui field'>
                <label>Upload Commit File to reveal vote</label>
                <input
                  type='file'
                  name='file'
                  onChange={this.onFileInput}
                  className='ui file' />
              </div>
              <div className='ui field'>
                  or
              </div>
              <div className='ui field'>
                <label>Secret Phrase (salt)</label>
                <div className='ui input small'>
                  <input
                    type='text'
                    placeholder='phrase'
                    id='DomainVoteRevealContainerSaltInput'
                    defaultValue={salt}
                    onKeyUp={event => this.setState({salt: parseInt(event.target.value, 10)})}
                  />
                </div>
              </div>
              <div className='ui field'>
                <label>Vote Option<br /><small>must be what you committed</small></label>
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
                {voteOption === null ?
                  <button
                    className='ui button disabled'>
                      Select Vote Option
                  </button>
                :
                <button
                  type='submit'
                  className={`ui button ${voteOption ? 'blue' : 'purple'} right labeled icon`}>
                  REVEAL {voteOption ? 'SUPPORT' : 'OPPOSE'} VOTE
                  <i className={`icon thumbs ${voteOption ? 'up' : 'down'}`}></i>
                </button>
                }
              </div>
            </form>
          </div>
        </div>
        {inProgress ? <DomainVoteRevealInProgressContainer /> : null}
      </div>
    )
  }

  onVoteOptionChange (event, { value }) {
    this.setState({
      voteOption: parseInt(value, 10)
    })
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

  async getReveal () {
    const {domain} = this.state

    try {
      const didReveal = await registry.didReveal(domain)

      this.setState({
        didReveal: didReveal
      })
    } catch (error) {
      toastr.error(error)
    }
  }

  async getPoll () {
    const {domain} = this.state

    try {
      const {
        votesFor,
        votesAgainst,
        commitEndDate,
        revealEndDate
      } = await registry.getChallengePoll(domain)

      this.setState({
        votesFor,
        votesAgainst,
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

  onFormSubmit (event) {
    event.preventDefault()

    this.reveal()
  }

  async reveal () {
    const {domain, salt, voteOption} = this.state

    if (!salt) {
      toastr.error('Please enter salt value')
      return false
    }

    if (voteOption === null) {
      toastr.error('Please select a vote option')
      return false
    }

    this.setState({
      inProgress: true
    })

debugger
    try {
      await registry.revealVote({domain, voteOption, salt})
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

  onFileInput (event) {
    event.preventDefault()
    const file = event.target.files[0]
    const fr = new window.FileReader()

    fr.onload = () => {
      const contents = fr.result

      try {
        const {salt, voteOption} = JSON.parse(contents)

        this.setState({
          salt,
          voteOption
        })

        // TODO: proper way of setting defaultValue
        const saltInput = document.querySelector('#DomainVoteRevealContainerSaltInput')
        if (saltInput) {
          saltInput.value = salt
        }
      } catch (error) {
        toastr.error('Invalid Commit JSON file')
        return false
      }
    }

    fr.readAsText(file)
  }
}

DomainVoteRevealContainer.propTypes = {
  domain: PropTypes.string
}

export default DomainVoteRevealContainer