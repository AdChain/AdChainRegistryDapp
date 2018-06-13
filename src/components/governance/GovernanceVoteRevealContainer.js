import React, { Component } from 'react'
import PropTypes from 'prop-types'
import toastr from 'toastr'
import moment from 'moment'
import { Input, Segment, Button, Dropdown } from 'semantic-ui-react'
import Tooltip from '../Tooltip'

import Countdown from '../CountdownText'
import ParameterizerService from '../../services/parameterizer'
import registry from '../../services/registry'
import PubSub from 'pubsub-js'
// import DomainVoteTokenDistribution from './DomainVoteTokenDistribution'

import '../single_domain/DomainVoteRevealContainer.css'

class GovernanceVoteRevealContainer extends Component {
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
      // inProgress: false,
      didChallenge: false,
      didCommit: false,
      didReveal: false,
      salt: '',
      voteOption: '',
      challengeId: ''
    }

    this.onVoteOptionChange = this.onVoteOptionChange.bind(this)
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onFileInput = this.onFileInput.bind(this)
    this.uploadClick = this.uploadClick.bind(this)
    this.onSaltChange = this.onSaltChange.bind(this)
  }

  componentWillReceiveProps () {

  }

  async componentDidMount () {
    this._isMounted = true
    await this.getPoll()
    await this.getCommit()
    await this.getReveal()
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  render () {
    const {
      revealEndDate,
      // inProgress,
      didChallenge,
      didCommit,
      didReveal
      // voteOption,
      // challengeId,
      // salt
    } = this.state

    const { normalizedName } = this.props.proposal

    const voteOptions = [
      { key: 1, text: 'Support', value: 1 },
      { key: 2, text: 'Oppose', value: 0 }
    ]

    const stageEndMoment = revealEndDate ? moment.unix(revealEndDate) : null
    const stageEnd = stageEndMoment ? stageEndMoment.format('YYYY-MM-DD HH:mm:ss') : '-'

    return (
      <div className='DomainVoteRevealContainer GovernanceVoteRevealContainer pd-25'>
        <div className='ui grid stackable'>
          <div className='column sixteen wide HeaderColumn'>
            <div className='row HeaderRow'>
              <div className='ui large header'>
              Stage: Reveal
                <Tooltip
                  info='The first phase of the voting process is the commit phase where the ADT holder stakes a hidden amount of votes to SUPPORT or OPPOSE the parameter application. The second phase is the reveal phase where the ADT holder reveals the staked amount of votes to either the SUPPORT or OPPOSE side.'
                />
              </div>
              <span>
                {normalizedName}
              </span>
            </div>
          </div>
          <div className='ui divider' style={{width: '100%'}} />
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
              You've <strong>challenged</strong> this proposal.
            </div>
          </div>
            : null}
          {didCommit ? <div className='column sixteen wide center aligned'>
            <div className='ui message warning'>
              You've <strong>committed</strong> vote for this proposal.
            </div>
          </div>
            : null}
          {didReveal ? <div className='column sixteen wide center aligned'>
            <div className='ui message warning'>
              You've <strong>revealed</strong> for this proposal.
            </div>
          </div>
            : null}
          {
            // need to add domainvotetokendistribution functionality for governance
          // <DomainVoteTokenDistribution {...this.props} />
          }
          <div className='column sixteen wide center aligned'>
            <Segment className='LeftSegment' floated='left'>
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
                <span className='VoteRevealLabelText'>
                    Challenge ID:
                </span>
                <Input id='DomainVoteRevealChallengeIdInput' value={this.state.challengeId} className='VoteRevealInput' />
              </div>
              <div className='VoteRevealLabel'>
                <span className='VoteRevealLabelText'>
                  Secret Phrase:
                </span>
                <Input id='DomainVoteRevealSaltInput' onChange={this.onSaltChange} className='VoteRevealInput' />
              </div>
              <div className='VoteRevealLabel'>
                <span className='VoteRevealLabelText'>
                  Vote Option:
                </span>
                <Dropdown
                  onChange={this.onVoteOptionChange}
                  options={voteOptions}
                  placeholder=''
                  selection
                  id='DomainVoteRevealVoteOption'
                  className='VoteRevealDropdown'
                  value={this.state.voteOption}
                />
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
        </div>
      </div>
    )
  }

  onVoteOptionChange (event, { value }) {
    this.setState({
      voteOption: parseInt(value, 10)
    })
  }

  onSaltChange (e) {
    this.setState({
      salt: e.target.value
    })
  }

  uploadClick (e) {
    this.refs.HiddenFileUploader.click()
  }

  async getReveal () {
    const {account} = this.state
    const {challengeId, propId} = this.props.proposal

    if (!account) {
      return false
    }

    try {
      const didReveal = await ParameterizerService.didReveal(challengeId, propId)

      if (this._isMounted) {
        this.setState({
          didReveal: didReveal
        })
      }
    } catch (error) {
      toastr.error('There was an error getting reveal')
      console.log('get reveal error: ', error)
    }
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
      toastr.error('There was an error getting challenge poll')
      console.log('get poll error: ', error)
    }
  }

  async getCommit () {
    try {
      const didCommit = await ParameterizerService.didCommit(this.props.proposal.challengeId)

      if (this._isMounted) {
        this.setState({
          didCommit
        })
      }
    } catch (error) {
      toastr.error('There was an error getting commit')
      console.log("error")
    }
  }

  onFormSubmit (event) {
    event.preventDefault()

    this.reveal()
  }

  async reveal () {
    const { salt, voteOption } = this.state
    const { challengeId, propId } = this.props.proposal
    if (!salt) {
      toastr.error('Please enter salt value')
      return false
    }

    if (voteOption === null) {
      toastr.error('Please select a vote option')
      return false
    }

    try {
      const revealed = await ParameterizerService.revealVote({challengeId, propId, voteOption, salt})
      if (revealed) {
        // toastr.success('Successfully revealed')

        // TODO: better way of resetting state
        // setTimeout(() => {
        //   window.location.reload()
        // }, 2e3)
      } else {
        // toastr.error('Reveal did not go through')
      }
    } catch (error) {
      PubSub.publish('TransactionProgressModal.error')
    }
  }

  onFileInput (event) {
    event.preventDefault()
    const file = event.target.files[0]
    const fr = new window.FileReader()

    fr.onload = () => {
      const contents = fr.result

      try {
        const {salt, voteOption, challengeId} = JSON.parse(contents)

        if (this._isMounted) {
          this.setState({
            salt,
            voteOption,
            challengeId
          })
        }

        // find element
        let saltInput = document.querySelector('#DomainVoteRevealSaltInput')
        let voteOptionDropdown = document.querySelector('#DomainVoteRevealVoteOption')

        // create event
        // let event = new Event('input', { bubbles: true })
        // set value
        saltInput.value = salt
        voteOptionDropdown.value = voteOption === 1 ? 'Support' : 'Oppose'
      // trigger event
        // saltInput.dispatchEvent(event)
        // voteOptionDropdown.dispatchEvent(event)
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

GovernanceVoteRevealContainer.propTypes = {
  domain: PropTypes.string
}

export default GovernanceVoteRevealContainer
