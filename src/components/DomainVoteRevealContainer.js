import React, { Component } from 'react'
import PropTypes from 'prop-types'
import toastr from 'toastr'
import moment from 'moment'
import { Popup, Input, Segment, Button, Dropdown } from 'semantic-ui-react'

import Countdown from './CountdownText'
import registry from '../services/registry'
import DomainVoteRevealInProgressContainer from './DomainVoteRevealInProgressContainer'
import DomainVoteTokenDistribution from './DomainVoteTokenDistribution'

import './DomainVoteRevealContainer.css'

class DomainVoteRevealContainer extends Component {
  constructor (props) {
    super()

    this.state = {
      domain: props.domain,
      account: registry.getAccount(),
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
    this.uploadClick = this.uploadClick.bind(this)

    this.getListing()
    this.getPoll()
    this.getChallenge()
    this.getCommit()
    this.getReveal()
  }

  componentDidMount () {
    this._isMounted = true
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  render () {
    const {
      domain,
      revealEndDate,
      inProgress,
      didChallenge,
      didCommit,
      didReveal
      // voteOption,
      // challengeId,
      // salt
    } = this.state

    const voteOptions = [
      {
        text: 'Support',
        value: '1'
      },
      {
        text: 'Oppose',
        value: '2'
      }
    ]

    const stageEndMoment = revealEndDate ? moment.unix(revealEndDate) : null
    const stageEnd = stageEndMoment ? stageEndMoment.format('YYYY-MM-DD HH:mm:ss') : '-'

    return (
      <div className='DomainVoteRevealContainer'>
        <div className='ui grid stackable'>
          <div className='column sixteen wide HeaderColumn'>
            <div className='row HeaderRow'>
              <div className='ui large header'>
              Stage: Reveal
              <Popup
                trigger={<i className='icon info circle' />}
                content='The first phase of the voting process is the commit phase where the ADT holder stakes a hidden amount of votes to SUPPORT or OPPOSE the domain application. The second phase is the reveal phase where the ADT holder reveals the staked amount of votes to either the SUPPORT or OPPOSE side.'
              />
              </div>
              <Button
                basic
                className='right refresh'
                onClick={this.updateStatus}
              >
                Refresh Status
              </Button>
            </div>
          </div>
          <div className='ui divider' />
          <div className='column sixteen wide center aligned'>
            <div>
              <p>
            Reveal stage ends
              </p>
              <p><strong>{stageEnd}</strong></p>
              <div>Remaining time: <Countdown
                endDate={stageEndMoment}
                onExpire={this.onCountdownExpire.bind(this)} /></div>
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
          {didReveal ? <div className='column sixteen wide center aligned'>
            <div className='ui message warning'>
              You've <strong>revealed</strong> for this domain.
            </div>
          </div>
          : null}
          <div className='ui divider' />
          <DomainVoteTokenDistribution domain={domain} />
          <div className='ui divider' />
          <div className='column sixteen wide center aligned'>
            <Segment className='LeftSegment' floated='left'>
              <div className='NumberCircleContainer'>
                <div className='NumberCircle'>1</div>
              </div>
                  Upload your JSON commit file to reveal your vote:
                <div className='UploadCommitButtonContainer'>
                  <Button className='UploadCommitButton' basic onClick={this.uploadClick}>Upload Commit &nbsp;<i className='icon long arrow up' /></Button>
                  <input
                    type='file'
                    name='file'
                    id='HiddenCommitFile'
                    ref='HiddenFileUploader' style={{display: 'none'}}
                    onChange={this.onFileInput}
                    className='ui file' />
                </div>
            </Segment>
            <Segment className='RightSegment' floated='right'>
                If you misplaced your JSON commit file, you can enter the information below to reveal:
                <div className='VoteRevealLabel'>
                  Challenge ID: <Input className='VoteRevealInput' />
                </div>
              <div className='VoteRevealLabel'>
                  Secret Phrase: <Input className='VoteRevealInput' />
              </div>
              <div className='VoteRevealLabel'>
                  Vote Option: <Dropdown className='VoteRevealInput' fluid selection options={voteOptions} />
              </div>
            </Segment>
          </div>
          <div className='SubmitVoteButtonContainer'>
            <Button
              className='SubmitVoteButton centered'
              basic
              type='submit'
              onClick={this.onFormSubmit}
              >
              Reveal Vote
            </Button>
          </div>

          {
          // <div className='column sixteen wide center aligned'>
          //   <form
          //     onSubmit={this.onFormSubmit}
          //     className='ui form'>
          //     <div className='ui field'>
          //       <p>Challenge ID: <label className='ui label'>{challengeId}</label></p>
          //     </div>
          //     <div className='ui field'>
          //       <label>Upload Commit File to reveal vote</label>
          //       <input
          //         type='file'
          //         name='file'
          //         onChange={this.onFileInput}
          //         className='ui file' />
          //     </div>
          //     <div className='ui field'>
          //         or
          //     </div>
          //     <div className='ui field'>
          //       <label>Secret Phrase (salt)</label>
          //       <div className='ui input small'>
          //         <input
          //           type='text'
          //           placeholder='phrase'
          //           id='DomainVoteRevealContainerSaltInput'
          //           defaultValue={salt}
          //           onKeyUp={event => this.setState({salt: parseInt(event.target.value, 10)})}
          //         />
          //       </div>
          //     </div>
          //     <div className='ui field'>
          //       <label>Vote Option<br /><small>must be what you committed</small></label>
          //     </div>
          //     <div className='ui two fields VoteOptions'>
          //       <div className='ui field'>
          //         <Radio
          //           label='SUPPORT'
          //           name='voteOption'
          //           value='1'
          //           checked={this.state.voteOption === 1}
          //           onChange={this.onVoteOptionChange}
          //         />
          //       </div>
          //       <div className='ui field'>
          //         <Radio
          //           label='OPPOSE'
          //           name='voteOption'
          //           value='0'
          //           checked={this.state.voteOption === 0}
          //           onChange={this.onVoteOptionChange}
          //         />
          //       </div>
          //     </div>
          //     <div className='ui field'>
          //       {voteOption === null
          //         ? <button
          //           className='ui button disabled'>
          //             Select Vote Option
          //         </button>
          //       : <button
          //         type='submit'
          //         className={`ui button ${voteOption ? 'blue' : 'purple'} right labeled icon`}>
          //         REVEAL {voteOption ? 'SUPPORT' : 'OPPOSE'} VOTE
          //         <i className={`icon thumbs ${voteOption ? 'up' : 'down'}`} />
          //       </button>
          //       }
          //     </div>
          //   </form>
          // </div>
        }

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

  uploadClick (e) {
    this.refs.HiddenFileUploader.click()
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

  async getCommit () {
    const {domain, account} = this.state

    if (!account) {
      return false
    }

    try {
      const didCommit = await registry.didCommit(domain)

      this.setState({
        didCommit: didCommit
      })
    } catch (error) {
      toastr.error('There was an error getting commit')
    }
  }

  async getReveal () {
    const {domain, account} = this.state

    if (!account) {
      return false
    }

    try {
      const didReveal = await registry.didReveal(domain)

      if (this._isMounted) {
        this.setState({
          didReveal: didReveal
        })
      }
    } catch (error) {
      toastr.error('There was an error getting reveal')
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
    }
  }

  async getChallenge () {
    const {domain, account} = this.state

    if (!account) {
      return false
    }

    try {
      const didChallenge = await registry.didChallenge(domain)

      if (this._isMounted) {
        this.setState({
          didChallenge
        })
      }
    } catch (error) {
      toastr.error('There was an error getting challenge')
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

    if (this._isMounted) {
      this.setState({
        inProgress: true
      })
    }

    try {
      const revealed = await registry.revealVote({domain, voteOption, salt})
      this.setState({
        inProgress: false
      })

      if (revealed) {
        toastr.success('Successfully revealed')

        // TODO: better way of resetting state
        setTimeout(() => {
          window.location.reload()
        }, 2e3)
      } else {
        toastr.error('Reveal did not go through')
      }
    } catch (error) {
      toastr.error('There was an error with your request')

      if (this._isMounted) {
        this.setState({
          inProgress: false
        })
      }
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

        if (this._isMounted) {
          this.setState({
            salt,
            voteOption
          })
        }

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

  onCountdownExpire () {
    // allow some time for new block to get mined and reload page
    setTimeout(() => {
      window.location.reload()
    }, 15000)
  }
}

DomainVoteRevealContainer.propTypes = {
  domain: PropTypes.string
}

export default DomainVoteRevealContainer
